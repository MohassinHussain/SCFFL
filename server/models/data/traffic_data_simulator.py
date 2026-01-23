import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def simulate_hyderabad_traffic(output_file='hyderabad_traffic_data.csv'):
    # Hyderabad Routes Configuration
    # Name, Length (km), Baseline Daily Flow, Type (IT/Residential/Highway/Core)
    # Hyderabad Routes Configuration
    # Name, Length (km), Baseline Daily Flow, Type (IT/Residential/Highway/Core)
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

    # Simulation Parameters
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    
    def get_season(month):
        if 3 <= month <= 5: return "Summer"
        if 6 <= month <= 9: return "Monsoon"
        return "Winter"

    data = []
    
    current_time = start_date
    delta = timedelta(hours=1)
    
    print("Starting simulation with expanded routes...")
    
    while current_time <= end_date:
        hour = current_time.hour
        month = current_time.month
        weekday = current_time.weekday() # 0=Mon, 6=Sun
        is_weekend = weekday >= 5
        season = get_season(month)
        
        # Time of Day Factors (Hourly Pattern)
        # Peaks: 8-11 AM, 5-8 PM (17-20)
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
            
        # Weekend Factor
        if is_weekend:
            if 11 <= hour <= 22: # Weekends busy later
                time_factor = 1.4 # High leisure travel
            else:
                time_factor *= 0.5 

        # Season/Weather Factor
        season_impact = 1.0
        weather_event = 0 # 0=Clear, 1=Rain/Extreme
        if season == "Monsoon":
            if np.random.random() < 0.25: # 25% chance of rain
               season_impact = 0.85 # Flow reduces purely due to driving conditions
               weather_event = 1
        elif season == "Summer" and 12 <= hour <= 16:
            season_impact = 0.9 # Too hot, slightly less traffic mid-day
        
        for route in routes_config:
            r_type = route["type"]
            # --- Exact API Match Logic ---
            
            # 1. Define Free Flow Speed (km/h)
            # User example: 86. Ranges: >60 is free. 
            # We set high baselines for Highway/ORR
            
            if r_type == "Highway": 
                route_free_flow_speed = np.random.randint(80, 95) # 80-95 km/h
            elif r_type == "IT": 
                route_free_flow_speed = np.random.randint(55, 70) # 55-70 km/h (IT roads wide but busy)
            else: # Core
                route_free_flow_speed = np.random.randint(45, 60) # 45-60 km/h
                
            # 2. Determine Current Speed based on conditions (Time, Weather)
            # Target Ranges:
            # - High Traffic: 10 - 30 km/h
            # - Moderate: 30 - 50 km/h
            # - Free/Less: 60+ km/h
            
            target_speed = route_free_flow_speed # Default to free flow
            
            if is_peak_hour:
                if weather_event: # Worst case
                    target_speed = np.random.uniform(20, 40) 
                else:
                    # Peak hour traffic - Tuned up for realism/accuracy with TomTom
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
                     # Almost free flow
                     target_speed = np.random.uniform(route_free_flow_speed - 5, route_free_flow_speed)
            
            # Ensure logical bounds
            current_speed = min(route_free_flow_speed, max(5, target_speed))
            
            # 3. Calculate Travel Time ("delivered_time")
            # Time (min) = (Dist / Speed) * 60
            current_travel_time_min = (route["length"] / current_speed) * 60
            
            # Free Flow Time
            free_flow_travel_time_min = (route["length"] / route_free_flow_speed) * 60
            
            # 4. Traffic Index (derived from speed drop)
            # Speed/FreeSpeed ratio. 1.0 = 0 index, 0.1 = 100 index
            speed_ratio = current_speed / route_free_flow_speed
            traffic_index = (1.0 - speed_ratio) * 100
            traffic_index = max(10, min(100, traffic_index)) # Bounds

            # Vehicle Mix Logic
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
            
            # Pollution
            pollution_index = min(1.0, traffic_index/100 + 0.1)

            t_start = current_time.strftime("%H:%M:%S")
            t_end = (current_time + delta).strftime("%H:%M:%S")
            
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
                "is_peak": 1 if is_peak_hour else 0
            }
            data.append(row)
            
        current_time += delta
        
        if len(data) % 20000 == 0:
            print(f"Generated {len(data)} rows...")

    df = pd.DataFrame(data)
    print(f"Simulation complete. Validation:\n{df.head()}")
    print(f"Stats:\n{df.describe()}")
    
    df.to_csv(output_file, index=False)
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    simulate_hyderabad_traffic()
