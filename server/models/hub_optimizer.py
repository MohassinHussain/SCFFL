import pandas as pd
import requests
import json
from pathlib import Path
from geopy.distance import geodesic
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier

DATA_PATH = "models\data\data_sets\hyderabad_agri_demand_dataset.csv"
CACHE_PATH = Path(__file__).parent / "data" / "coords_cache.json"
API_KEY = "wapQ2oOEmdDJ5sHyP8+HCA==7wwCvqvY2e2ZHsXC" 
GEOCODE_URL = "https://api.api-ninjas.com/v1/geocoding"


def load_data():
    return pd.read_csv(DATA_PATH)

def geocode_places(place_names):
    # load cache if exists
    if CACHE_PATH.exists():
        with open(CACHE_PATH, "r") as f:
            coords_cache = json.load(f)
    else:
        coords_cache = {}

    new_coords = {}
    for place in place_names:
        if place in coords_cache:
            continue
        try:
            resp = requests.get(
                f"{GEOCODE_URL}?city={place}&country=India",
                headers={"X-Api-Key": API_KEY}
            )
            if resp.status_code == 200 and resp.json():
                coords = resp.json()[0]
                coords_cache[place] = (coords["latitude"], coords["longitude"])
                new_coords[place] = coords_cache[place]
        except Exception as e:
            print(f"Geocoding failed for {place}: {e}")

    # save updated cache
    with open(CACHE_PATH, "w") as f:
        json.dump(coords_cache, f)

    return coords_cache


def optimize_hubs_with_kmeans(df, coords_map, n_hubs=6):
    df["lat"] = df["place_name"].map(lambda v: coords_map.get(v, (None, None))[0])
    df["lon"] = df["place_name"].map(lambda v: coords_map.get(v, (None, None))[1])
    df = df.dropna(subset=["lat", "lon"])

    kmeans = KMeans(n_clusters=n_hubs, random_state=42, n_init=10)
    # df["hub_cluster"] = kmeans.fit_predict(df[["lat", "lon"]])

    df.loc[:, "hub_cluster"] = kmeans.fit_predict(df[["lat", "lon"]])
    hubs = []
    for cluster_id, center in enumerate(kmeans.cluster_centers_):
        center_lat, center_lon = center
        hubs.append({
            "cluster": cluster_id,
            "hub_name": f"Hub-{cluster_id+1}",
            "lat": float(center_lat),
            "lon": float(center_lon)
        })
    return df, hubs

def classify_items_to_hubs(df):
    df = df.dropna(subset=["hub_cluster"])
    features = pd.get_dummies(df[["season", "month", "weather", "traffic"]])
    target = df["hub_cluster"]

    clf = RandomForestClassifier(random_state=42)
    clf.fit(features, target)

    predictions = clf.predict(features)
    df["predicted_cluster"] = predictions

    hub_items = (
        df.groupby("predicted_cluster")["product"]
        .apply(lambda x: ", ".join(x.value_counts().head(5).index))
        .to_dict()
    )
    return hub_items

def get_optimized_hubs():
    print("Called for hub optimizations")
    df = load_data()
    coords_map = geocode_places(df["place_name"].unique().tolist())
    df, hubs = optimize_hubs_with_kmeans(df, coords_map, n_hubs=6)
    hub_items = classify_items_to_hubs(df)

    for hub in hubs:
        hub["items"] = hub_items.get(hub["cluster"], "")

    return hubs
