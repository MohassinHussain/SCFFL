# from fastapi import FastAPI

# app = FastAPI()

# @app.get("/")
# def root():
#     return {"message": "FastAPI is running"}

# @app.get("/products")
# def get_products():
#     return {"products": ["Rice", "Wheat", "Tomato"]}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.hub_optimizer import get_optimized_hubs


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
