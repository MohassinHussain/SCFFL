import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.traffic_analyzer import traffic_analyzer

if __name__ == "__main__":
    print("Starting Training...")
    metrics = traffic_analyzer.train_model(epochs=20) # 50 epochs for accuracy
    print("Training Metrics:", metrics)
