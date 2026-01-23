# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "FastAPI is running"}

# @app.get("/products")
# def get_products():
#     return {"products": ["Rice", "Wheat", "Tomato"]}


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.hub_optimizer import get_optimized_hubs
from models.traffic_analyzer import traffic_analyzer
from models.weather_analyzer import weather_analyzer
from models.results_analyzer import results_analyzer
from pydantic import BaseModel



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Product catalog
PRODUCT_CATALOG = {
    "Pulses": ["Toor Dal", "Moong Dal", "Masoor Dal", "Urad Dal", "Chana Dal"],
    "Millets": ["Ragi", "Bajra", "Jowar", "Foxtail Millet", "Little Millet"],
    "Vegetables": [
        "Tomato", "Potato", "Onion", "Carrot", "Cabbage",
        "Beans", "Cauliflower", "Capsicum", "Spinach", "Garlic"
    ],
    "Others": ["Rice", "Wheat", "Sugar", "Salt", "Green Tea"]
}

PRICE_LIST = {
    item: (i + 1) * 10
    for i, category in enumerate(PRODUCT_CATALOG.values())
    for item in category
}

@app.get("/")
def root():
    return {"message": "FastAPI is running"}

@app.get("/get_all_available_products")
def get_all_available_products():
    return {
        "product_catalog": PRODUCT_CATALOG,
        "price_list": PRICE_LIST
    }

    
# @app.get("/get_optimized_hubs")
# def get_hubs():
#     try:
#         return {"hubs": get_optimized_hubs()}
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return {"error": str(e)}
# # 


@app.get("/get_optimized_hubs")
def get_hubs():
    from models.hub_optimizer import get_optimized_hubs
    return {"hubs": get_optimized_hubs()}

@app.post("/traffic/get_analysis")
def get_traffic_analysis():
    try:
        # Train model and get metrics
        # In production this should be async or background task
        metrics = traffic_analyzer.train_model(epochs=5)
        return {"analysis": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/weather/get_analysis")
def get_weather_analysis():
    try:
        # Train model and get metrics
        metrics = weather_analyzer.train_model(epochs=5)
        return {"analysis": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from models.optimization.iqpso_sa import iqpso_sa_optimizer

class DeliveryRequest(BaseModel):
    route_name: str
    range_km: float
    start_time: str = None  # Added optional start_time

@app.post("/overall/predict_delivery")
def predict_delivery(request: DeliveryRequest):
    try:
        from datetime import datetime
        # Use provided start_time or default to current time
        current_time = request.start_time if request.start_time else datetime.now().strftime("%H:%M")
        
        result = results_analyzer.analyze_delivery(request.route_name, current_time, request.range_km)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimization/run_routing")
def run_routing_optimization():
    try:
        result = iqpso_sa_optimizer.optimize()
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

