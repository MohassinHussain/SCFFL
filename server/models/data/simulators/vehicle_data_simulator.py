
import pandas as pd
import numpy as np
import random

def generate_vehicle_data(num_records=5000):
    print(f"Generating {num_records} vehicle records...")
    
    vehicle_ids = [f"VH{str(i).zfill(5)}" for i in range(1, num_records + 1)]
    
    model_years = np.random.choice(range(2015, 2025), size=num_records, p=[0.05, 0.05, 0.05, 0.05, 0.05, 0.15, 0.15, 0.15, 0.15, 0.15])
    current_year = 2024
    years_in_service = current_year - model_years
    
    service_areas = [
        "Kompally", "Gachibowli", "Uppal", "Mehdipatnam", 
        "Medchal", "L B Nagar", "PVNR_Expressway", "HITEC_City_Main_Road"
    ]
    
    fuel_types = np.random.choice(['Diesel', 'Hybrid', 'Electric'], size=num_records, p=[0.7, 0.2, 0.1])
    
    data = []
    
    for i in range(num_records):
        ft = fuel_types[i]
        age = years_in_service[i]
        
        assigned_area = random.choice(service_areas)
        
        if ft == 'Diesel':
            mileage_empty = random.uniform(3.5, 5.5) # kmpl
            fuel_eff_base = 25.0 # l/100km
            accel = random.uniform(15, 25)
        elif ft == 'Hybrid':
            mileage_empty = random.uniform(5.0, 7.0)
            fuel_eff_base = 18.0
            accel = random.uniform(12, 20)
        else: # Electric
            mileage_empty = random.uniform(6.0, 8.0) # equivalent
            fuel_eff_base = 0 
            accel = random.uniform(10, 18)
            
        eff_loss = age * 0.02 # 2% loss per year
        mileage_empty *= (1 - eff_loss)
        
        max_load = random.choice([5000, 8000, 12000, 20000])
        typical_load = max_load * random.uniform(0.6, 0.9)
        mileage_loaded = mileage_empty * 0.7
        
        cooling_eff = random.uniform(85, 99) - (age * 1.5)
        refrig_type = random.choice(['R-404A', 'R-452A'])
        cooling_power = random.uniform(10, 25) # kW
        target_temp = random.choice([-20, -18, 2, 4]) # Frozen or Chilled
        
        annual_dist = random.uniform(50000, 120000)
        total_dist = annual_dist * (age + 0.5) # +0.5 for current partial year
        maint_hours = total_dist / 80.0
        
        if ft != 'Electric':
             fuel_efficiency_val = (100 / mileage_loaded) 
        else:
             fuel_efficiency_val = 0
        
        row = {
            "vehicle_id": vehicle_ids[i],
            "model_year": model_years[i],
            "total_distance_km": int(total_dist),
            "fuel_type": ft,
            "fuel_efficiency_l100km": round(fuel_efficiency_val, 1),
            "mileage_empty_kmpl": round(mileage_empty, 1),
            "mileage_loaded_kmpl": round(mileage_loaded, 1),
            "pickup_time_0to60s": round(accel, 1),
            "max_load_kg": max_load,
            "typical_load_kg": int(typical_load),
            "cooling_efficiency_percent": round(max(50, cooling_eff), 1),
            "refrigerant_type": refrig_type,
            "cooling_power_kw": round(cooling_power, 1),
            "target_temp_c": target_temp,
            "years_in_service": age,
            "annual_distance_km": int(annual_dist),
            "maintenance_hours": int(maint_hours),
            "service_area": assigned_area # NEW Column
        }
        data.append(row)
        
    df = pd.DataFrame(data)
    
    output_path = 'models/data/data_sets/vehicle_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    generate_vehicle_data()
