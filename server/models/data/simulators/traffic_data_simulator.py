import pandas as pd
import numpy as np
from datetime import datetime, timedelta
try:
    from models.data.fuzzy_logic import fuzzy_system
except ImportError:
    try:
        import sys
        import os
        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
        from fuzzy_logic import fuzzy_system
    except ImportError:
        class MockFuzzy:
            def compute_satisfaction(self, t, q): return 5.0
        fuzzy_system = MockFuzzy()



import random

try:
    vehicle_df = pd.read_csv('models/data/data_sets/vehicle_data.csv')
    vehicles = vehicle_df.to_dict('records')
    vehicles_by_area = {}
    for v in vehicles:
        area = v.get('service_area', 'Unknown')
        if area not in vehicles_by_area:
            vehicles_by_area[area] = []
        vehicles_by_area[area].append(v)
            
except FileNotFoundError:
    print("Vehicle data not found. Please run vehicle_data_simulator.py first.")
    vehicles = []
    vehicles_by_area = {}


def generate_traffic_data(num_rows=5000): 
    print("Starting simulation with expanded routes and vehicle data...")
    routes_config = [
        {"name": "Kompally", "length": 6.0, "baseline": 48000, "type": "Highway"},
        {"name": "Gachibowli", "length": 7.5, "baseline": 110000, "type": "IT"},
        {"name": "Uppal", "length": 15.0, "baseline": 60000, "type": "Core"},
        {"name": "Mehdipatnam", "length": 5.0, "baseline": 70000, "type": "Core"},
        {"name": "Medchal", "length": 12.0, "baseline": 55000, "type": "Highway"},
        {"name": "L B Nagar", "length": 8.0, "baseline": 85000, "type": "Core"},
        {"name": "PVNR_Expressway", "length": 11.6, "baseline": 65000, "type": "Highway"},
        {"name": "HITEC_City_Main_Road", "length": 8.5, "baseline": 95000, "type": "IT"}
    ]

    start_date = datetime(2023, 1, 1)
    end_date = datetime(2024, 12, 31)
    
    def get_season(month):
        if 3 <= month <= 5: return "Summer"
        if 6 <= month <= 9: return "Monsoon"
        return "Winter"

    data = []
    
    total_seconds = int((end_date - start_date).total_seconds())
    delta = timedelta(hours=1)
    
    print("Starting simulation with random sampling...")
    
    for _ in range(num_rows):
        random_seconds = np.random.randint(0, total_seconds)
        current_time = start_date + timedelta(seconds=random_seconds)

        hour = current_time.hour
        month = current_time.month
        weekday = current_time.weekday()
        is_weekend = weekday >= 5
        season = get_season(month)
        
        is_peak_hour = False
        if 8 <= hour <= 11:
            time_factor = 2.2 # Heavy morning peak
            is_peak_hour = True
        elif 17 <= hour <= 21: # Extended evening peak for Hyderabad IT
            time_factor = 2.4 
            is_peak_hour = True
        elif 0 <= hour <= 5:
            time_factor = 0.15 
        elif 12 <= hour <= 16:
            time_factor = 1.2 # Mid-day is still active
        else:
            time_factor = 0.8
            
        if is_weekend:
            if 11 <= hour <= 22: # Weekends busy later
                time_factor = 1.4 # High leisure travel
            else:
                time_factor *= 0.5 

        season_impact = 1.0
        weather_event = 0 # 0=Clear, 1=Rain/Extreme
        if season == "Monsoon":
            if np.random.random() < 0.25: # 25% chance of rain
               season_impact = 0.85 # Flow reduces purely due to driving conditions
               weather_event = 1
        elif season == "Summer" and 12 <= hour <= 16:
            season_impact = 0.9 # Too hot, slightly less traffic mid-day
        
        for route in [random.choice(routes_config)]:
            r_type = route["type"]
        
            
            if r_type == "Highway": 
                route_free_flow_speed = np.random.randint(80, 95) # 80-95 km/h
            elif r_type == "IT": 
                route_free_flow_speed = np.random.randint(55, 70) # 55-70 km/h (IT roads wide but busy)
            else: # Core
                route_free_flow_speed = np.random.randint(45, 60) # 45-60 km/h
                
           
            
            target_speed = route_free_flow_speed # Default to free flow
            
            if is_peak_hour:
                if weather_event: # Worst case
                    target_speed = np.random.uniform(20, 40) 
                else:
                    if r_type == "IT":
                         target_speed = np.random.uniform(25, 45) # IT jams but moving
                    elif r_type == "Core":
                         target_speed = np.random.uniform(20, 40) 
                    else: # Highway
                         target_speed = np.random.uniform(50, 75) # Highways maintain speed better
                         
            elif 12 <= hour <= 16: # Mid-day moderate
                 target_speed = np.random.uniform(45, 75)
                 
            else: # Off-peak / Night / Early Morning
                 if is_weekend and 18 <= hour <= 21: # Weekend evening 
                     target_speed = np.random.uniform(40, 60)
                 else:
                     target_speed = np.random.uniform(route_free_flow_speed - 5, route_free_flow_speed)
            
            current_speed = min(route_free_flow_speed, max(5, target_speed))
            
         
            current_travel_time_min = (route["length"] / current_speed) * 60
            
            free_flow_travel_time_min = (route["length"] / route_free_flow_speed) * 60
            
       
            speed_ratio = current_speed / route_free_flow_speed
            traffic_index = (1.0 - speed_ratio) * 100
            traffic_index = max(10, min(100, traffic_index)) # Bounds

    
            if r_type == "Highway" or "NH44" in route["name"]:
                types = ["4W", "HCV", "2W"]
                weights = [0.4, 0.4, 0.2]
            elif r_type == "IT":
                types = ["4W", "2W", "3W"]
                weights = [0.6, 0.3, 0.1]
            else: 
                types = ["2W", "4W", "3W", "HCV"]
                weights = [0.45, 0.35, 0.15, 0.05]
            most_probable = np.random.choice(types, p=weights)
            
            pollution_index = min(1.0, traffic_index/100 + 0.1)

            t_start = current_time.strftime("%H:%M:%S")
            t_end = (current_time + delta).strftime("%H:%M:%S")

            area_vehicles = vehicles_by_area.get(route["name"], [])
            
            if area_vehicles and np.random.random() < 0.8: # 80% chance to use local fleet
                 vehicle = random.choice(area_vehicles)
            else:
                 vehicle = random.choice(vehicles) if vehicles else {}
                 
            veh_id = vehicle.get('vehicle_id', 'UNKNOWN')
            fuel_eff = vehicle.get('fuel_efficiency_l100km', 15.0) # Default 15L/100km
            cooling_eff = vehicle.get('cooling_efficiency_percent', 95.0)
            
            
            c_operation_fixed = 40.0 
            
          
            fuel_price = 90.0
            consumption_per_min = (fuel_eff / 100.0) * (current_speed / 60.0)
            fuel_cost_min = consumption_per_min * fuel_price
            
            c_running_per_min = fuel_cost_min + 1.0
            
            if weather_event: c_running_per_min += 0.5 
            
            c_transport_C1 = c_operation_fixed + (c_running_per_min * current_travel_time_min)
            
            
            damage_probability = (current_travel_time_min / 600) + (traffic_index / 800)
            
            if cooling_eff < 90:
                damage_probability += (90 - cooling_eff) * 0.005
                
            if weather_event: damage_probability += 0.02
            product_value = 1000 
            c_damage_C2 = product_value * min(1.0, damage_probability)
            
           
            promised_time = free_flow_travel_time_min * 1.3
            time_deviation = current_travel_time_min - promised_time
            c_penalty_C3 = 0
            if time_deviation > 0:
                c_penalty_C3 = time_deviation * 5.0 # 5 Rs per minute late (reduced from 20)
            
            total_distribution_cost = c_transport_C1 + c_damage_C2 + c_penalty_C3
            
           
            quality_score = 100.0 - (traffic_index / 4.0) 
            
            # Cooling impact
            if cooling_eff < 95:
                quality_score -= (95 - cooling_eff) * 1.5
                
            if weather_event: quality_score -= 15.0
            
            if current_travel_time_min > 30:
                decay_factor = (current_travel_time_min - 30) / 5.0 # Every 5 mins extra loses more quality
                quality_score -= decay_factor * 2.0
                
            quality_score = max(0, min(100, quality_score))
            
            satisfaction_score = fuzzy_system.compute_satisfaction(time_deviation, quality_score)
            
            row = {
                "route": route["name"],
                "time_start": t_start,
                "time_end": t_end,
                "range_km": route["length"],
                
                # API Aligned Columns
                "freeFlowSpeed": int(route_free_flow_speed),
                "currentSpeed": int(current_speed),
                "freeFlowTravelTime": int(free_flow_travel_time_min), # User API has ints usually
                "currentTravelTime": int(current_travel_time_min),    # delivered_time
                "traffic_index": int(traffic_index),
                
                "day_of_the_week": current_time.strftime("%A"),
                "season": season,
                "most_probable_vehicle_type": most_probable,
                "pollution_index": round(pollution_index, 3),
                "date": current_time.strftime("%Y-%m-%d"),
                "is_peak": 1 if is_peak_hour else 0,
                
                # New Metrics
                "distribution_cost": round(total_distribution_cost, 2),
                "customer_satisfaction": round(satisfaction_score, 2),
                "quality_score": round(quality_score, 1),
                "time_deviation": round(time_deviation, 1),
                "vehicle_id": veh_id 
            }
            data.append(row)
            
        if len(data) % 1000 == 0:
            print(f"Generated {len(data)} rows...")

    df = pd.DataFrame(data)
    print(f"Simulation complete. Validation:\n{df.head()}")
    print(f"Stats:\n{df.describe()}")
    output_file = 'models/data/data_sets/hyderabad_traffic_data.csv'
    df.to_csv(output_file, index=False)
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    generate_traffic_data()
