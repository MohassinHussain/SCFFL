import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def simulate_hyderabad_weather(output_file='models/data/data_sets/hyderabad_hourly_weather_data.csv'):
    # Hyderabad Locations (Matching Traffic Simulator)
    locations = [
        {"name": "Kompally", "lat": 17.54145002014721, "lon": 78.49092328971071},
        {"name": "Gachibowli", "lat": 17.450524139245275, "lon": 78.34655494004758},
        {"name": "Uppal", "lat": 17.40139809188057, "lon": 78.56925669271646},
        {"name": "Mehdipatnam", "lat": 17.39623428520163, "lon": 78.4417508780221},
        {"name": "Medchal", "lat": 17.647783124602935, "lon": 78.48665491046361},
        {"name": "L B Nagar", "lat": 17.34367740962585, "lon": 78.55587986747992},
        # Keeping others with approx coords if needed, or removing if strictly limited
        {"name": "PVNR_Expressway", "lat": 17.375, "lon": 78.434}, # Near Mehdipatnam
        {"name": "HITEC_City_Main_Road", "lat": 17.447, "lon": 78.376} # Near Gachibowli
    ]

    # Simulation Parameters
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    
    data = []
    current_time = start_date
    delta = timedelta(hours=1)
    
    print("Starting weather simulation...")
    
    while current_time <= end_date:
        month = current_time.month
        hour = current_time.hour
        
        # Season Logic
        if 3 <= month <= 5: 
            season = "Summer"
            base_temp = 35.0
            rain_prob = 0.05
        elif 6 <= month <= 9: 
            season = "Monsoon"
            base_temp = 28.0
            rain_prob = 0.40 # High probability of rain
        else: 
            season = "Winter"
            base_temp = 22.0
            rain_prob = 0.02

        # Daily fluctuation
        # Peak temp at 14:00, Lowest at 04:00
        temp_fluctuation = -5.0 * np.cos(np.pi * (hour - 14) / 12)
        base_temp += temp_fluctuation
        
        # Global Rain Event for the hour (City-wide correlation)
        is_raining_citywide = np.random.random() < rain_prob
        
        for loc_data in locations:
            loc = loc_data["name"]
            # Local Variations
            temp_noise = np.random.normal(0, 1.5)
            temp_c = base_temp + temp_noise
            
            # Heat Island Effect for Core areas
            if "Uppal" in loc or "Mehdipatnam" in loc or "L B Nagar" in loc:
                temp_c += 1.0
                
            # Rain Logic
            rain_mm = 0.0
            if is_raining_citywide:
                # Some variability per location
                if np.random.random() < 0.8: # 80% chance it's raining here too if raining citywide
                    intensity = np.random.exponential(5.0) # mm/hr
                    rain_mm = intensity
                    
                    if season == "Monsoon":
                        rain_mm += 2.0 # Heavier in monsoon
            
            # Humidity (Higher when raining, Lower in summer)
            humidity = 60
            if season == "Summer": humidity = 40
            if season == "Monsoon": humidity = 80
            if rain_mm > 0: humidity = 95
            
            # Visibility (km)
            visibility = 10.0
            if rain_mm > 5: visibility = 4.0
            if rain_mm > 20: visibility = 1.0
            if season == "Winter" and 4 <= hour <= 8: visibility = 2.0 # Morning fog

            row = {
                "location": loc,
                "latitude": loc_data["lat"],
                "longitude": loc_data["lon"],
                "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "date": current_time.strftime("%Y-%m-%d"),
                "season": season,
                "temp_c": round(temp_c, 1),
                "rain_mm": round(rain_mm, 1),
                "humidity": int(humidity + np.random.normal(0, 5)),
                "visibility_km": round(visibility, 1),
                "is_raining": 1 if rain_mm > 0 else 0
            }
            data.append(row)
            
        current_time += delta
        
        if len(data) % 20000 == 0:
            print(f"Generated {len(data)} weather rows...")

    df = pd.DataFrame(data)
    
    # Validation
    rainy_days = df[df['rain_mm'] > 0].shape[0]
    print(f"Simulation complete. Total rows: {len(df)}")
    print(f"Rows with rain: {rainy_days} ({rainy_days/len(df)*100:.1f}%)")
    print(df.head())
    
    df.to_csv(output_file, index=False)
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    simulate_hyderabad_weather()
