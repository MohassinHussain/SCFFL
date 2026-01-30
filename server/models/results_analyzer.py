from models.traffic_analyzer import traffic_analyzer
from models.weather_analyzer import weather_analyzer
from datetime import datetime
import numpy as np
import requests
import os
from dotenv import load_dotenv

load_dotenv()


COORDINATES_MAP = {
    "Kompally": {"lat": 17.54145002014721, "lon": 78.49092328971071},
    "Gachibowli": {"lat": 17.450524139245275, "lon": 78.34655494004758},
    "Uppal": {"lat": 17.40139809188057, "lon": 78.56925669271646},
    "Mehdipatnam": {"lat": 17.39623428520163, "lon": 78.4417508780221},
    "Medchal": {"lat": 17.647783124602935, "lon": 78.48665491046361},
    "L B Nagar": {"lat": 17.34367740962585, "lon": 78.55587986747992}
}

class ResultsAnalyzer:
    def __init__(self):
        self.weather_analyzer = weather_analyzer
        self.traffic_analyzer = traffic_analyzer
        self.tomtom_api_key = os.getenv("TOMTOM_TRAFFIC_API_KEY")

    def get_tomtom_flow_segment(self, location_name):
        """
        Fetch real-time flow segment data for a specific point.
        """
        if not self.tomtom_api_key:
            print("TomTom API Key missing.")
            return None

        coords = COORDINATES_MAP.get(location_name)
        if not coords:
            return None

        # https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={lat},{long}&key=API_KEY
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point={coords['lat']},{coords['lon']}&key={self.tomtom_api_key}"
        
        try:
            response = requests.get(url)
            data = response.json()
            return data
        except Exception as e:
            print(f"TomTom API Error: {e}")
        return None

    def get_open_meteo_weather(self, lat, lon):
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,precipitation&timezone=auto"
            response = requests.get(url)
            data = response.json()
            if "current" in data:
                return {
                    "temp_c": data["current"]["temperature_2m"],
                    "rain_mm": data["current"]["precipitation"]
                }
        except Exception as e:
            print(f"Open-Meteo API Error: {e}")
        return None

    def analyze_delivery(self, route_name, start_time_str, range_km):
        """
        Predict delivery time based on LSTM Traffic and Weather models AND Validate with Real-time APIs.
        """
        try:
            # 1. Parse Time Context
            dt = datetime.now() 
            day_name = dt.strftime("%A")
            month = dt.month
            
            if 3 <= month <= 5: season = "Summer"
            elif 6 <= month <= 9: season = "Monsoon"
            else: season = "Winter"
            
            hour = int(start_time_str.split(":")[0])
            
            
            # 2. Get Weather Prediction (LSTM)
            weather_pred = self.weather_analyzer.predict(route_name, hour, season)
            lstm_rain_mm = 0
            if weather_pred:
                lstm_rain_mm = max(0, weather_pred['rain_mm'])
            
            # 3. Get Traffic Prediction (LSTM)
            is_peak = 1 if (8 <= hour <= 11) or (17 <= hour <= 21) else 0
            
            # Predict
            # Returns (traffic_index, currentTravelTime) or None
            prediction_result = self.traffic_analyzer.predict(route_name, start_time_str, day_name, season, is_peak, range_km)
            
            if prediction_result:
                pred_index, pred_time, pred_cost, pred_sat = prediction_result
            else:
                pred_time = (range_km / 30.0) * 60
                pred_index = 50.0
                pred_cost = 0.0
                pred_sat = 5.0

            lstm_estimated_time_mins = pred_time
            traffic_index = pred_index
            
            
            real_time_metrics = {}
            accuracy_metrics = {}
            raw_json_data = None
            
            flow_data = self.get_tomtom_flow_segment(route_name)
            
            if flow_data and "flowSegmentData" in flow_data:
                raw_json_data = flow_data # Store full JSON for UI
                segment = flow_data["flowSegmentData"]
                
                current_speed_kmh = segment.get("currentSpeed", 0)
                free_flow_speed_kmh = segment.get("freeFlowSpeed", 0)
                
                if current_speed_kmh > 0:
                    # RealTimeDuration = (RangeKM / CurrentSegmentSpeed) * 60
                    rt_estimated_mins = (range_km / current_speed_kmh) * 60
                    
                    real_time_metrics["tomtom_duration_mins"] = round(rt_estimated_mins, 1)
                    real_time_metrics["current_speed_kmh"] = current_speed_kmh
                    real_time_metrics["free_flow_speed_kmh"] = free_flow_speed_kmh
                    
                    # Accuracy: how close was LSTM to Real-time?
                    if rt_estimated_mins > 0:
                        error_margin = abs(lstm_estimated_time_mins - rt_estimated_mins)
                        accuracy_pct = max(0, 100 - (error_margin / rt_estimated_mins * 100))
                        accuracy_metrics["time_accuracy_score"] = round(accuracy_pct, 1)
                        accuracy_metrics["time_diff_mins"] = round(lstm_estimated_time_mins - rt_estimated_mins, 1)

            coords = COORDINATES_MAP.get(route_name)
            if coords:
                weather_data = self.get_open_meteo_weather(coords["lat"], coords["lon"])
                if weather_data:
                    real_time_metrics["real_temp_c"] = weather_data["temp_c"]
                    real_time_metrics["real_rain_mm"] = weather_data["rain_mm"]
                    
                    accuracy_metrics["rain_diff_mm"] = round(lstm_rain_mm - weather_data["rain_mm"], 2)

            return {
                "route": route_name,
                "distance_km": range_km,
                "predicted_traffic_index": round(traffic_index, 1),
                "predicted_rain_mm": round(lstm_rain_mm, 1),
                "estimated_delivery_time_mins": int(lstm_estimated_time_mins),
                "predicted_cost": round(pred_cost, 2),
                "predicted_satisfaction": round(pred_sat, 2),
                "conditions": {
                    "congestion": "High" if traffic_index > 60 else "Low",
                    "weather": "Rainy" if lstm_rain_mm > 0.5 else "Clear"
                },
                "real_time_validation": {
                    "available": bool(flow_data),
                    "metrics": real_time_metrics,
                    "accuracy": accuracy_metrics,
                    "raw_data": raw_json_data
                }
            }
            
        except Exception as e:
            print(f"Analysis Error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}

results_analyzer = ResultsAnalyzer()
