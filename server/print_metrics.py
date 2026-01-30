
import sys
import os
import pandas as pd
import numpy as np
from sklearn.metrics import silhouette_score, accuracy_score, f1_score
from tensorflow.keras.models import load_model

# Add current directory to path to find models module
sys.path.append(os.getcwd())

# Redirect stdout to file
output_file = open("metrics_result.txt", "w", encoding="utf-8")
sys.stdout = output_file

print("\n=======================================================")
print("           PROJECT COMPREHENSIVE DIAGNOSTICS")
print("=======================================================\n")

# ---------------------------------------------------------
# 1. LSTM ACCURACY
# ---------------------------------------------------------
print("1. [LSTM] TRAFFIC PREDICTION MODEL")
try:
    from models.traffic_analyzer import traffic_analyzer
    # Load data for eval
    df = traffic_analyzer.load_data()
    X, y, _ = traffic_analyzer.preprocess(df)
    
    # Load model
    if os.path.exists(traffic_analyzer.model_path):
        model = load_model(traffic_analyzer.model_path)
        
        # Split as per training
        from sklearn.model_selection import train_test_split
        _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        y_pred_scaled = model.predict(X_test, verbose=0)
        y_pred = traffic_analyzer.scaler_y.inverse_transform(y_pred_scaled)
        y_test_orig = traffic_analyzer.scaler_y.inverse_transform(y_test)
        
        # Traffic Index Classification (Threshold 30)
        threshold = 30
        y_pred_class = (y_pred[:, 0] > threshold).astype(int)
        y_test_class = (y_test_orig[:, 0] > threshold).astype(int)
        
        acc = accuracy_score(y_test_class, y_pred_class)
        f1 = f1_score(y_test_class, y_pred_class, zero_division=0)
        
        print(f"   >> Model Accuracy:   {acc*100:.2f}%")
        print(f"   >> F1 Score:         {f1*100:.2f}%")
        print("   (Evaluated on 20% Hold-out Validation Set)")
        
    else:
        print("   [!] Model file not found. Please train first.")
except Exception as e:
    print(f"   [Error] {e}")


# ---------------------------------------------------------
# 2. IQPSO + SA (OPTIMIZATION)
# ---------------------------------------------------------
print("\n2. [IQPSO + SA] HYBRID OPTIMIZATION ALGORITHM")
try:
    from models.benchmark_runner import benchmark_runner
    print("   Running simulation (50 orders)... please wait.")
    
    # Run simulation
    res = benchmark_runner.run_benchmark_simulation()
    
    # Extract metrics
    prop_cost = res['proposed']['total_cost']
    wang_cost = res['benchmarks']['iqpso']['cost']
    
    prop_sat = res['proposed']['satisfaction']
    wang_sat = res['benchmarks']['iqpso']['sat']
    
    cost_improve = ((wang_cost - prop_cost) / wang_cost) * 100
    sat_improve = ((prop_sat - wang_sat) / wang_sat) * 100
    
    print(f"   >> Cost Efficiency:  {cost_improve:.2f}% Improvement over Benchmark")
    print(f"      (Proposed: ₹{prop_cost:,.2f} vs Wang IQPSO: ₹{wang_cost:,.2f})")
    print(f"   >> Satisfaction:     {sat_improve:.2f}% Improvement")
    print(f"      (Proposed: {prop_sat}/10 vs Wang IQPSO: {wang_sat}/10)")
    print("   (Based on Dynamic Simulation of 50 Orders)")

except Exception as e:
    print(f"   [Error] {e}")


# ---------------------------------------------------------
# 3. K-MEANS (CLUSTERING)
# ---------------------------------------------------------
print("\n3. [K-MEANS] HUB OPTIMIZATION")
try:
    from models.hub_optimizer import load_data, geocode_places, optimize_hubs_with_kmeans
    
    # Load and process
    df_hub = load_data()
    places = df_hub["place_name"].unique().tolist()
    
    # Run K-Means logic
    coords_map = geocode_places(places)
    df_hub, hubs = optimize_hubs_with_kmeans(df_hub, coords_map, n_hubs=6)
    
    # Calculate Silhouette Score
    X_cluster = df_hub[["lat", "lon"]]
    labels = df_hub["hub_cluster"]
    
    if len(set(labels)) > 1:
        sil = silhouette_score(X_cluster, labels)
        print(f"   >> Silhouette Score: {sil:.4f}")
        print(f"   >> Clustering Quality: {sil*100:.1f}%")
        print("   (Measures how well-separated the optimized hubs become)")
    else:
        print("   [!] Not enough clusters to calculate score.")

except Exception as e:
    print(f"   [Error] {e}")

print("\n=======================================================")
