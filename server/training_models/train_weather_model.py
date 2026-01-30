import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.weather_analyzer import weather_analyzer

if __name__ == "__main__":
    print("Starting Weather Model Training...")
    metrics = weather_analyzer.train_model(epochs=20)
    print("Weather Training Metrics:", metrics)
