import pandas as pd
import os

DATA_DIR = 'models/data/data_sets'
TRAFFIC_FILE = os.path.join(DATA_DIR, 'hyderabad_traffic_data.csv')
DATA_DIR = 'models/data/data_sets'
TRAFFIC_FILE = os.path.join(DATA_DIR, 'hyderabad_traffic_data.csv')
WEATHER_FILE = os.path.join(DATA_DIR, 'hyderabad_hourly_weather_data.csv')
VEHICLE_FILE = os.path.join(DATA_DIR, 'vehicle_data.csv')

TRAFFIC_COLUMNS_DESC = {
    "route": "Name of the delivery route.",
    "time_start": "Start time of the observation/trip.",
    "time_end": "End time of the observation/trip.",
    "range_km": "Length of the route in Kilometers.",
    "freeFlowSpeed": "Theoretical maximum speed on the route (km/h).",
    "currentSpeed": "Actual recorded speed during the trip (km/h).",
    "freeFlowTravelTime": "Minimum time required to traverse the route (min).",
    "currentTravelTime": "Actual travel time taken (min).",
    "traffic_index": "Congestion score used by TomTom (0-100).",
    "distribution_cost": "Total dynamic cost of delivery (₹), including fuel, damage risk, and penalties.",
    "customer_satisfaction": "Fuzzy Logic score (0-10) based on Time Deviation and Service Quality.",
    "quality_score": "Intermediate quality metric (0-100) affected by road roughness and weather.",
    "time_deviation": "Difference between Actual and Promised delivery time (min).",
    "day_of_the_week": "Day of the week.",
    "season": "Season (Summer/Monsoon/Winter).",
    "most_probable_vehicle_type": "Dominant vehicle type on the road.",
    "pollution_index": "Estimated pollution level based on traffic congestion.",
    "date": "Date of the record.",
    "is_peak": "Binary indicator for peak traffic hours (1=Peak, 0=Off-Peak)."
}

WEATHER_COLUMNS_DESC = {
    "location": "Location name corresponding to the traffic route.",
    "latitude": "Latitude of the location.",
    "longitude": "Longitude of the location.",
    "timestamp": "Time of the weather forecast.",
    "date": "Date of the forecast.",
    "season": "Season context.",
    "temp_c": "Temperature in Celsius.",
    "rain_mm": "Precipitation volume in millimeters.",
    "humidity": "Percentage of humidity.",
    "visibility_km": "Visibility range in kilometers.",
    "is_raining": "Binary indicator if rain > 0mm."
}

VEHICLE_COLUMNS_DESC = {
    "vehicle_id": "Unique identifier for the vehicle.",
    "model_year": "Manufacturing year of the vehicle.",
    "total_distance_km": "Cumulative distance traveled by the vehicle.",
    "fuel_type": "Type of fuel used (Diesel, Hybrid, Electric).",
    "fuel_efficiency_l100km": "Fuel consumption rate (liters per 100km).",
    "mileage_empty_kmpl": "Mileage when the vehicle is unloaded.",
    "mileage_loaded_kmpl": "Mileage when the vehicle is fully loaded.",
    "pickup_time_0to60s": "Seconds taken to accelerate from 0 to 60 km/h.",
    "max_load_kg": "Maximum payload capacity in kg.",
    "typical_load_kg": "Average load carried per trip.",
    "cooling_efficiency_percent": "Efficiency of refrigeration unit (%).",
    "refrigerant_type": "Type of refrigerant used.",
    "cooling_power_kw": "Power rating of the cooling unit (kW).",
    "target_temp_c": "Target temperature setting for cargo.",
    "years_in_service": "Number of years the vehicle has been operational.",
    "annual_distance_km": "Average yearly travel distance.",
    "maintenance_hours": "Total maintenance hours logged."
}

def get_csv_preview(file_path, desc_map):
    if not os.path.exists(file_path):
        return {"error": "Dataset not found"}
    
    try:
        df = pd.read_csv(file_path)
        preview = df.head(50).to_dict(orient='records')
        columns = [{"name": col, "description": desc_map.get(col, "No description available.")} for col in df.columns]
        return {
            "preview": preview,
            "columns": columns,
            "total_rows": len(df)
        }
    except Exception as e:
        return {"error": str(e)}

def get_traffic_dataset_info():
    return get_csv_preview(TRAFFIC_FILE, TRAFFIC_COLUMNS_DESC)

def get_weather_dataset_info():
    return get_csv_preview(WEATHER_FILE, WEATHER_COLUMNS_DESC)

def get_vehicle_dataset_info():
    return get_csv_preview(VEHICLE_FILE, VEHICLE_COLUMNS_DESC)
