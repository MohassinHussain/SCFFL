import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os

class WeatherAnalyzer:
    def __init__(self, data_path='models/data/hyderabad_hourly_weather_data.csv'):
        self.data_path = data_path
        self.model = None
        self.scaler_X = MinMaxScaler()
        self.scaler_y = MinMaxScaler()
        self.label_encoders = {}
        self.model_path = 'models/saved/weather_lstm.keras'
        self.encoders_path = 'models/saved/weather_encoders.pkl'
        
        os.makedirs('models/saved', exist_ok=True)

    def load_data(self):
        return pd.read_csv(self.data_path)

    def preprocess(self, df):
        # Convert timestamp to hour
        df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        
        # Features: location, hour, season
        # Target: rain_mm (could also multi-output predict temp_c, but treating rain as critical due to logistics)
        
        le_loc = LabelEncoder()
        df['location'] = le_loc.fit_transform(df['location'])
        self.label_encoders['location'] = le_loc
        
        le_sea = LabelEncoder()
        df['season'] = le_sea.fit_transform(df['season'])
        self.label_encoders['season'] = le_sea
        
        features = ['location', 'hour', 'season']
        target = ['rain_mm', 'temp_c'] # Multi-target
        
        X = df[features].values
        y = df[target].values
        
        X_scaled = self.scaler_X.fit_transform(X)
        y_scaled = self.scaler_y.fit_transform(y)
        
        X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
        
        return X_reshaped, y_scaled, features

    def build_model(self, input_shape):
        model = Sequential()
        model.add(LSTM(64, return_sequences=True, input_shape=input_shape))
        model.add(Dropout(0.2))
        model.add(LSTM(32))
        model.add(Dropout(0.2))
        model.add(Dense(16, activation='relu'))
        model.add(Dense(2)) # Predict Rain and Temp
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model

    def train_model(self, epochs=10, batch_size=32):
        print("Loading and preprocessing weather data...")
        df = self.load_data()
        X, y, feature_names = self.preprocess(df)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Building Weather LSTM Model...")
        self.model = self.build_model(X.shape[1:])
        
        print("Training model...")
        history = self.model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, y_test), verbose=1)
        
        self.model.save(self.model_path)
        joblib.dump({
            'scaler_X': self.scaler_X,
            'scaler_y': self.scaler_y,
            'encoders': self.label_encoders,
            'features': feature_names
        }, self.encoders_path)
        
        print("Weather model saved.")
        # Calculate Classification Metrics (Rain > 0.5mm = Rainy)
        # y_test has shape (samples, 2) -> [rain, temp]
        y_pred_scaled = self.model.predict(X_test)
        y_pred = self.scaler_y.inverse_transform(y_pred_scaled)
        y_test_orig = self.scaler_y.inverse_transform(y_test)

        # Slice 0 for rain
        y_pred_rain = y_pred[:, 0]
        y_test_rain = y_test_orig[:, 0]

        threshold = 0.5
        y_pred_class = (y_pred_rain > threshold).astype(int)
        y_test_class = (y_test_rain > threshold).astype(int)

        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

        return {
            "status": "success",
            "training_loss": history.history['loss'][-1],
            "validation_loss": history.history['val_loss'][-1],
            "mean_absolute_error": history.history['mae'][-1],
            "val_mean_absolute_error": history.history['val_mae'][-1],
            "epochs": epochs,
            "classification_metrics": {
                "accuracy": float(accuracy_score(y_test_class, y_pred_class)),
                "precision": float(precision_score(y_test_class, y_pred_class, zero_division=0)),
                "recall": float(recall_score(y_test_class, y_pred_class, zero_division=0)),
                "f1_score": float(f1_score(y_test_class, y_pred_class, zero_division=0)),
                "confusion_matrix": confusion_matrix(y_test_class, y_pred_class).tolist()
            }
        }

    def predict(self, location, hour, season):
        if not self.label_encoders:
            saved_data = joblib.load(self.encoders_path)
            self.label_encoders = saved_data['encoders']
            self.scaler_X = saved_data['scaler_X']
            self.scaler_y = saved_data['scaler_y']
            
        if self.model is None:
             self.model = tf.keras.models.load_model(self.model_path)
             
        try:
            loc_enc = self.label_encoders['location'].transform([location])[0]
            sea_enc = self.label_encoders['season'].transform([season])[0]
            
            features = np.array([[loc_enc, hour, sea_enc]])
            features_scaled = self.scaler_X.transform(features)
            features_reshaped = features_scaled.reshape((1, 1, features_scaled.shape[1]))
            
            prediction_scaled = self.model.predict(features_reshaped)
            prediction = self.scaler_y.inverse_transform(prediction_scaled)
            
            return {
                "rain_mm": float(prediction[0][0]),
                "temp_c": float(prediction[0][1])
            }
        except Exception as e:
            print(f"Weather prediction error: {e}")
            return None

weather_analyzer = WeatherAnalyzer()
