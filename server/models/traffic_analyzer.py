import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os

class TrafficAnalyzer:
    def __init__(self, data_path='models/data/hyderabad_traffic_data.csv'):
        self.data_path = data_path
        self.model = None
        self.scaler_X = MinMaxScaler()
        self.scaler_y = MinMaxScaler()
        self.label_encoders = {}
        self.model_path = 'models/saved/traffic_lstm.keras'
        self.encoders_path = 'models/saved/traffic_encoders.pkl'
        
        # Ensure saved directory exists
        os.makedirs('models/saved', exist_ok=True)

    def load_data(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found at {self.data_path}")
        return pd.read_csv(self.data_path)

    def preprocess(self, df):
        # Feature Engineering
        # Convert time string to hour float
        df['hour'] = pd.to_datetime(df['time_start'], format='%H:%M:%S').dt.hour
        
        # Encode categorical variables
        categorical_cols = ['route', 'day_of_the_week', 'season', 'most_probable_vehicle_type']
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            self.label_encoders[col] = le
            
        # Select Features and Target
        # Features: route, hour, day, season, is_peak, range_km, freeFlowSpeed
        # Target: traffic_index, currentTravelTime
        features = ['route', 'hour', 'day_of_the_week', 'season', 'is_peak', 'range_km', 'freeFlowSpeed']
        target = ['traffic_index', 'currentTravelTime']
        
        X = df[features].values
        y = df[target].values
        
        # Scale data
        X_scaled = self.scaler_X.fit_transform(X)
        y_scaled = self.scaler_y.fit_transform(y)
        
        # Reshape for LSTM [samples, time steps, features]
        X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
        
        return X_reshaped, y_scaled, features

    def build_model(self, input_shape):
        model = Sequential()
        model.add(LSTM(64, return_sequences=True, input_shape=input_shape))
        model.add(Dropout(0.2))
        model.add(LSTM(32))
        model.add(Dropout(0.2))
        model.add(Dense(16, activation='relu'))
        model.add(Dense(2)) # Predict Traffic Index and Delivered Time
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model

    def train_model(self, epochs=15, batch_size=32):
        print("Loading and preprocessing traffic data...")
        df = self.load_data()
        X, y, feature_names = self.preprocess(df)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print(f"Building LSTM Model with input shape {X.shape[1:]}...")
        self.model = self.build_model(X.shape[1:])
        
        print("Training model...")
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_test, y_test),
            verbose=1
        )
        
        # Save artifacts
        self.model.save(self.model_path)
        joblib.dump({
            'scaler_X': self.scaler_X,
            'scaler_y': self.scaler_y,
            'encoders': self.label_encoders,
            'features': feature_names
        }, self.encoders_path)
        
        print("Model training complete and saved.")
        
        # Return metrics
        loss = history.history['loss'][-1]
        val_loss = history.history['val_loss'][-1]
        
        # Calculate Classification Metrics for Traffic Index (Index 0)
        y_pred_scaled = self.model.predict(X_test)
        y_pred = self.scaler_y.inverse_transform(y_pred_scaled)
        y_test_orig = self.scaler_y.inverse_transform(y_test)
        
        # Traffic Index is at index 0
        threshold = 60
        y_pred_class = (y_pred[:, 0] > threshold).astype(int)
        y_test_class = (y_test_orig[:, 0] > threshold).astype(int)
        
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
        
        return {
            "status": "success",
            "training_loss": loss,
            "validation_loss": val_loss,
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

    def predict(self, route_name, time_str, day, season, is_peak=0, range_km=10.0):
        # Load encoders if not in memory
        if not self.label_encoders:
            saved_data = joblib.load(self.encoders_path)
            self.label_encoders = saved_data['encoders']
            self.scaler_X = saved_data['scaler_X']
            self.scaler_y = saved_data['scaler_y']
            
        if self.model is None:
             self.model = tf.keras.models.load_model(self.model_path)

        # Preprocess Input
        try:
            hour = pd.to_datetime(time_str, format='%H:%M').hour
            
            # Encode inputs safely (handle unseen labels if necessary, for now assuming validity)
            route_enc = self.label_encoders['route'].transform([route_name])[0]
            day_enc = self.label_encoders['day_of_the_week'].transform([day])[0]
            season_enc = self.label_encoders['season'].transform([season])[0]
            
            # Construct feature vector
            # ['route', 'hour', 'day_of_the_week', 'season', 'is_peak', 'range_km']

            # Determine freeFlowSpeed
            # Heuristic matches simulator
            ff_speed = 45 # Default Core
            if "Highway" in route_name or "Expressway" in route_name:
                 ff_speed = 85
            elif "IT" in route_name or "HITEC" in route_name or "Gachibowli" in route_name:
                 ff_speed = 60
            
            # ['route', 'hour', 'day_of_the_week', 'season', 'is_peak', 'range_km', 'freeFlowSpeed']
            features = np.array([[route_enc, hour, day_enc, season_enc, is_peak, range_km, ff_speed]])
            
            # Scale
            features_scaled = self.scaler_X.transform(features)
            
            # Reshape
            features_reshaped = features_scaled.reshape((1, 1, features_scaled.shape[1]))
            
            # Predict
            prediction_scaled = self.model.predict(features_reshaped)
            prediction = self.scaler_y.inverse_transform(prediction_scaled)
            
            # Return tuple: (traffic_index, delivered_time)
            return float(prediction[0][0]), float(prediction[0][1])
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return None

# Singleton instance for simple usage if needed
traffic_analyzer = TrafficAnalyzer()
