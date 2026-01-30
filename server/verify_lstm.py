from models.traffic_analyzer import traffic_analyzer
import pandas as pd
import os

import sys
sys.path.append(os.getcwd())

print("--- Starting LSTM Improvement Verification ---")

print("Training model with new parameters (Fractional Hour, 20 Epochs)...")
try:
    metrics = traffic_analyzer.train_model(epochs=20)
    print(f"Training Complete. MAE: {metrics['mean_absolute_error']:.4f}, Val MAE: {metrics['val_mean_absolute_error']:.4f}")
except Exception as e:
    print(f"Training Failed: {e}")
    exit(1)

route = "Mehdipatnam"
time_str = "10:30"
day = "Monday"
season = "Winter"
range_km = 5.0 # Mehdipatnam length

print(f"\nPredicting for: {route} at {time_str} ({day}, {season})")
try:
    result = traffic_analyzer.predict(route, time_str, day, season, is_peak=0, range_km=range_km)
    
    if result:
        traffic_index, time_min, cost, satisfaction = result
        print(f"Prediction Results:")
        print(f"  Traffic Index: {traffic_index:.1f}")
        print(f"  Travel Time: {time_min:.1f} min")
        print(f"  Cost: {cost:.1f}")
        print(f"  Satisfaction: {satisfaction:.1f}")
        
    
        
        if 5.0 <= time_min <= 20.0:
            print("  [PASS] Prediction is within reasonable range (5-20 min).")
        else:
            print(f"  [WARN] Prediction {time_min:.1f} min seems outlier for 5km.")
            
    else:
        print("Prediction returned None")

except Exception as e:
    print(f"Prediction Failed: {e}")
