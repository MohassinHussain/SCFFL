# SCFFL: Smart City Fresh Food Logistics

![SCFFL Banner](https://img.shields.io/badge/Status-Implementation%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Built with](https://img.shields.io/badge/Built%20with-Python%20%7C%20Next.js-orange)
![Framework](https://img.shields.io/badge/Framework-FastAPI%20%7C%20React-blueviolet)

## Table of Contents

- [SCFFL: Smart City Fresh Food Logistics](#scffl-smart-city-fresh-food-logistics)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
  - [2. Features](#2-features)
    - [A. AI-Powered Predictive Models](#a-ai-powered-predictive-models)
    - [B. Intelligent Optimization Algorithms](#b-intelligent-optimization-algorithms)
    - [C. Data \& Validation Systems](#c-data--validation-systems)
    - [D. Intuitive Frontend Dashboard](#d-intuitive-frontend-dashboard)
  - [3. System Architecture](#3-system-architecture)
  - [4. Performance Benchmarks](#4-performance-benchmarks)
  - [5. Tech Stack](#5-tech-stack)
  - [6. Project Structure](#6-project-structure)
  - [7. Installation](#7-installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup (FastAPI)](#backend-setup-fastapi)
    - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
  - [8. Usage](#8-usage)
    - [Accessing the Dashboard](#accessing-the-dashboard)
    - [Key Dashboard Pages](#key-dashboard-pages)
    - [Testing Scenarios](#testing-scenarios)
  - [9. API Reference](#9-api-reference)
    - [Core Endpoints](#core-endpoints)
    - [Data \& Analysis Endpoints](#data--analysis-endpoints)
    - [Optimization Endpoints](#optimization-endpoints)
  - [10. Contributing](#10-contributing)
  - [11. License](#11-license)

---

## 1. Introduction

**SCFFL (Smart City Fresh Food Logistics)** is an intelligent, data-driven logistics platform engineered to revolutionize the distribution of perishable agricultural products in dynamic urban environments, with a specific focus on **Hyderabad, India**.

The fresh food supply chain is plagued by inefficiencies, leading to significant waste and increased costs. Traditional logistics models struggle with unpredictable traffic, fluctuating weather conditions, and static routing decisions. SCFFL tackles these critical challenges by integrating real-time data with advanced Artificial Intelligence models to:

*   **Minimize Perishable Food Waste:** By optimizing routes based on predicted time and environmental conditions.
*   **Enhance Routing Efficiency:** Moving beyond simple distance to factor in dynamic traffic congestion, weather impacts, and specific vehicle capabilities.
*   **Provide Dynamic Cost Estimation:** Delivering accurate cost predictions considering fuel type, maintenance, and potential penalties.
*   **Maximize Customer Satisfaction:** Utilizing fuzzy logic to quantify and improve delivery timeliness and product quality.

SCFFL acts as a **Logistics Control Tower**, proactively predicting future conditions and generating optimal delivery plans to ensure freshness, reduce operational expenses, and boost customer delight.

---

## 2. Features

SCFFL incorporates a sophisticated blend of AI and real-time data processing to deliver a comprehensive logistics solution:

### A. AI-Powered Predictive Models

*   **Traffic & Weather Prediction (LSTM):**
    *   **Algorithm:** Long Short-Term Memory (LSTM) Recurrent Neural Networks.
    *   **Role:** Predicts `traffic_index`, `travel_time`, `distribution_cost`, localized rain probability, and temperature.
    *   **Performance:**
        *   Traffic Model Accuracy: **84.50%** (classifying traffic as Low/High).
        *   Traffic Model F1 Score: **75.82%**.
        *   Evaluated on a 20% hold-out validation set from 5,000+ historical records.

*   **Customer Satisfaction (Fuzzy Logic):**
    *   **Algorithm:** Mamdani Fuzzy Inference System.
    *   **Inputs:** `Time Deviation` (promised vs. actual arrival), `Quality Score` (derived from road roughness, vehicle cooling efficiency, weather).
    *   **Output:** A granular satisfaction score (0-10) that mimics human judgment.

### B. Intelligent Optimization Algorithms

*   **Intelligent Route Optimization (Hybrid IQPSO-SA):**
    *   **Algorithm:** Hybrid Improved Quantum-Behaved Particle Swarm Optimization (IQPSO) with Simulated Annealing (SA).
    *   **Role:** Determines the most efficient sequence of delivery locations to minimize cost and maximize satisfaction.
    *   **Innovation:** IQPSO provides fast global exploration, while SA prevents premature convergence by accepting temporarily worse solutions to escape local optima, ensuring a robust global path.
    *   **Objective Function:** Minimizes a weighted sum of normalized cost and (1 - normalized satisfaction) with weights `w1=0.7` (cost) and `w2=0.3` (satisfaction).

*   **Strategic Hub Optimization:**
    *   **Algorithm:** K-Means Clustering + Random Forest.
    *   **Role:**
        *   **K-Means:** Groups demand points into optimal clusters to locate distribution hubs.
            *   Silhouette Score: **0.65** (indicating good cluster separation).
        *   **Random Forest:** Predicts the best product mix (e.g., Tomatoes vs. Rice) for each hub based on local demand patterns.

### C. Data & Validation Systems

*   **Simulatory Data Engine:**
    *   Custom `TrafficSimulator`, `VehicleSimulator`, and `WeatherSimulator` generate realistic, interlinked datasets (5000+ records) reflecting Hyderabad's geography and dynamic conditions.
    *   Addresses the lack of proprietary real-world logistics data by creating high-fidelity synthetic data capturing causal relationships between traffic, weather, and delivery performance.
*   **Real-Time Validator:**
    *   `ResultsAnalyzer` module checks LSTM predictions against live **TomTom Traffic API** and **Open-Meteo Weather API** to detect model drift and ensure real-world applicability.
    *   Calculates `Time Accuracy %` based on predicted vs. actual travel times.

### D. Intuitive Frontend Dashboard

*   **Built with Next.js:** Provides dynamic UI for comprehensive system monitoring and interaction.
*   **Sections:**
    *   **Traffic Analysis:** Visualizes peak hour trends and LSTM performance metrics.
    *   **Weather Impact:** Displays weather model performance and its effect on logistics.
    *   **Comparison Tables:** Dynamic UI showcasing the Proposed Hybrid-LSTM solution's performance against existing benchmarks.
    *   **Live Simulator:** Allows users to run specific delivery scenarios, inputting routes and times to see predicted cost, satisfaction, and real-time validation.
    *   **Hubs:** Visualizes optimized distribution hubs on an interactive map.
    *   **Vehicle:** Provides insights into the fleet's attributes and their impact on operations.

---

## 3. System Architecture

SCFFL employs a **Microservices-based Architecture** to ensure scalability, maintainability, and efficient resource utilization:

*   **Frontend:** A responsive web application built with **Next.js (React)**, providing a dynamic user interface for interacting with the system's various features.
*   **Backend:** A high-performance API server developed with **Python (FastAPI)**, chosen for its asynchronous capabilities and robust support for data science libraries. This handles all data processing, model inference, and optimization logic.
*   **Data Layer:**
    *   **Synthetic Data Generation:** Custom Python simulators generate realistic traffic, weather, and vehicle data.
    *   **External APIs:** Integration with **TomTom Traffic API** for real-time traffic validation and **Open-Meteo Weather API** for live weather data.
*   **AI/ML Models:**
    *   **LSTM Models:** Trained using TensorFlow for traffic and weather prediction.
    *   **Hybrid IQPSO-SA:** Implemented in Python for route optimization.
    *   **Fuzzy Logic System:** For customer satisfaction evaluation.
    *   **K-Means & Random Forest:** For strategic hub optimization.

This modular design allows for independent development and deployment of components, enhancing overall system robustness.

---

## 4. Performance Benchmarks

The **Proposed Hybrid IQPSO-SA** approach, combined with LSTM predictions, was validated against standard benchmarks from *Wang et al. (2021)* using a dynamic simulation of **50 Orders** and **7 Refrigerated Vehicles**.

| Metric                    | Proposed System (LSTM + Hybrid IQPSO-SA) | Benchmark (Wang IQPSO) | Benchmark (GA) | Benchmark (ACA) | Improvement (vs. Wang IQPSO) |
| :------------------------ | :--------------------------------------- | :--------------------- | :------------- | :-------------- | :--------------------------- |
| **Total Distribution Cost** | **₹24,650.45**                           | ₹30,497.50             | ₹37,158        | ₹19,027\*       | **~19.1% Less Cost**         |
| **Avg. Customer Satisfaction** | **9.35 / 10**                            | 8.41 / 10              | 9.12 / 10      | 7.52\* / 10     | **~11.2% Higher Satisfaction** |
| **Total Distance**        | **128.5 km**                             | 129.2 km               | 150.1 km       | 101.6 km        | -                            |
| **Fleet Usage**           | **7 Vehicles**                           | 8 Vehicles             | 11 Vehicles    | 4 Vehicles      | **12.5% Fewer Vehicles**     |

*\*Note: Costs converted to INR (1 CNY = 11 INR). ACA shows lower cost but with significantly unacceptable satisfaction, highlighting the balanced approach of SCFFL's multi-objective optimization.*

**Key Takeaways:**
*   **Cost Efficiency:** By proactively predicting and avoiding congestion, SCFFL achieves significant cost savings (approx. 19% over IQPSO).
*   **Superior Satisfaction:** The fuzzy logic controller ensures that cost reduction does not compromise quality, leading to a high customer satisfaction score (9.35/10).
*   **Robustness:** The Simulated Annealing component in the optimizer prevents the system from getting stuck in suboptimal routes.

---

## 5. Tech Stack

| Category      | Technology        | Description                                                       |
| :------------ | :---------------- | :---------------------------------------------------------------- |
| **Frontend**  | `Next.js`         | React framework for server-side rendering and dynamic UIs         |
|               | `React`           | JavaScript library for building user interfaces                   |
|               | `Shadcn UI`       | Reusable UI components for modern web applications                |
|               | `Tailwind CSS`    | Utility-first CSS framework for rapid styling                     |
|               | `Leaflet`         | Interactive maps for visualizing hubs                             |
|               | `Lucide React`    | Icon library for React                                            |
| **Backend**   | `Python`          | Primary language for AI/ML models and API                         |
|               | `FastAPI`         | High-performance Python web framework for API development         |
|               | `TensorFlow`      | For building and training LSTM models (Traffic & Weather)         |
|               | `scikit-learn`    | Machine learning library (K-Means, Random Forest)                 |
|               | `pandas`          | Data manipulation and analysis                                    |
|               | `numpy`           | Numerical computing                                               |
|               | `requests`        | HTTP library for API calls (TomTom, Open-Meteo)                   |
|               | `geopy`           | Geocoding library                                                 |
|               | `uvicorn`         | ASGI server for running FastAPI                                   |
| **APIs**      | `TomTom Traffic API` | Real-time traffic data for validation                           |
|               | `Open-Meteo Weather API` | Live weather data for validation                              |
| **Dev Tools** | `npm` / `yarn`    | Package manager for Node.js                                       |
|               | `pip`             | Package installer for Python                                      |
|               | `Git` / `GitHub`  | Version control and collaboration                                 |

---

## 6. Project Structure

The project is organized into two main parts: `scffl` (frontend) and `server` (backend), along with `essential_docs` and `artifacts` for documentation and results.

```
SCFFL/
├── README.md                           # Main project README
├── essential_docs/                     # Essential documentation and explanations
│   ├── essential_explanations/         # Detailed explanations for key components
│   │   ├── README.md                   # Project overview (redundant, but kept)
│   │   ├── BenchMarking algo.txt       # Notes on benchmarking algorithms
│   │   ├── Essentials for report.txt   # Checklist for final report
│   │   ├── Project execution flow (Backend).txt # Backend execution steps
│   │   ├── comparison_analysis.md      # Detailed comparison: Existing vs. Proposed
│   │   ├── optimization_iqpso_sa_explanation.md # Hybrid IQPSO-SA explanation
│   │   ├── project Metrics.txt         # Key project metrics
│   │   └── project_final_report.md     # Comprehensive project final report
├── artifacts/                          # Stores training results, benchmark outputs, and other artifacts
│   ├── Explanation.txt                 # Explanation of LSTM models & real-time validation
│   ├── IQPSO - Existing System.ipynb   # Jupyter notebook for existing IQPSO benchmark
│   ├── IQPSO - Existing System.py      # Python script for existing IQPSO benchmark
│   ├── Optimization_Explanation.txt    # Explanation of IQPSO+SA optimization & integration
│   ├── UI_Testing_Steps.txt            # Guide for testing the /overall dashboard
│   ├── benchmark_runner_explanation.md # Explanation of benchmark runner logic
│   ├── comparison_analysis.md          # Duplicate of essential_explanations/comparison_analysis.md (retained)
│   ├── metrics_output.txt              # CLI output of project metrics
│   └── metrics_result.txt              # CLI output of project metrics with formatted results
├── scffl/                              # Next.js Frontend Application
│   ├── public/                         # Static assets (images, etc.)
│   ├── src/                            # Source code for the Next.js app
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── api/products/route.js   # Example API route
│   │   │   ├── context/CartContext.jsx # React Context for cart management
│   │   │   ├── globals.css             # Global CSS styles
│   │   │   ├── layout.js               # Root layout for the application
│   │   │   ├── navigations/            # Pages for various navigation routes
│   │   │   │   ├── cart/page.js
│   │   │   │   ├── hubs/page.js
│   │   │   │   ├── order/page.js
│   │   │   │   ├── overall/page.js
│   │   │   │   ├── satisfaction/page.js # Currently commented out/placeholder
│   │   │   │   ├── tables/page.js
│   │   │   │   ├── traffic/page.js
│   │   │   │   ├── vehicle/page.js
│   │   │   │   └── weather/page.js
│   │   │   └── page.js                 # Home page
│   │   ├── components/                 # Reusable React components
│   │   │   ├── Header.js
│   │   │   ├── LeafletMap.jsx
│   │   │   ├── Sidebar.js
│   │   │   ├── art.js                  # (Likely a development/placeholder component)
│   │   │   └── ui/                     # Shadcn UI components
│   │   │       └── ...                 # (accordion, button, card, input, etc.)
│   │   └── lib/utils.js                # Utility functions for frontend
│   ├── .env.example                    # Example environment variables for frontend
│   ├── next.config.mjs                 # Next.js configuration
│   ├── package.json                    # Frontend dependencies and scripts
│   ├── postcss.config.mjs              # PostCSS configuration
│   ├── README.md                       # Next.js boilerplate README
│   └── tailwind.config.js              # Tailwind CSS configuration
└── server/                             # FastAPI Backend Application
    ├── .env                            # Environment variables (e.g., API keys)
    ├── main.py                         # FastAPI application entry point
    ├── models/                         # AI/ML models and related logic
    │   ├── data/                       # Datasets used by models
    │   │   ├── data_sets/              # Example datasets
    │   │   │   ├── hyderabad_agri_demand_dataset.csv
    │   │   │   ├── hyderabad_hourly_weather_data.csv
    │   │   │   ├── hyderabad_traffic_data.csv
    │   │   │   └── hyderabad_vehicle_data.csv
    │   │   └── coords_cache.json       # Cache for geocoding
    │   ├── optimization/               # Optimization algorithms
    │   │   └── iqpso_sa.py             # Hybrid IQPSO-SA implementation
    │   ├── training_models/            # Scripts for training models
    │   │   ├── train_traffic_model.py
    │   │   └── train_weather_model.py
    │   ├── __init__.py
    │   ├── benchmark_runner.py         # Logic for running benchmark simulations
    │   ├── dataset_utils.py            # Utilities for dataset handling
    │   ├── fuzzy_logic.py              # Fuzzy inference system for satisfaction
    │   ├── hub_optimizer.py            # K-Means and Random Forest for hub optimization
    │   ├── results_analyzer.py         # Analyzes and validates model results
    │   ├── traffic_analyzer.py         # LSTM traffic prediction logic
    │   └── weather_analyzer.py         # LSTM weather prediction logic
    ├── requirements.txt                # Backend Python dependencies
    └── tests/                          # (Placeholder for backend tests)
        └── ...
```

---

## 7. Installation

Follow these steps to set up and run the SCFFL project locally.

### Prerequisites

*   **Git:** For cloning the repository.
*   **Node.js (v18.x or higher) & npm (v8.x or higher) / Yarn:** For the Next.js frontend.
*   **Python (v3.9 or higher) & pip:** For the FastAPI backend.

### Backend Setup (FastAPI)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/SCFFL.git # Replace with actual repo URL
    cd SCFFL/server
    ```

2.  **Create a Python Virtual Environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure API Keys:**
    *   Create a `.env` file in the `server/` directory:
        ```env
        TOMTOM_TRAFFIC_API_KEY=YOUR_TOMTOM_API_KEY
        # No API key needed for Open-Meteo, it's free.
        # API_NINJAS_KEY=YOUR_API_NINJAS_KEY # (Optional, for hub_optimizer geocoding if enabled)
        ```
    *   Obtain a **TomTom Traffic API Key** from the [TomTom Developer Portal](https://developer.tomtom.com/).

5.  **Generate Synthetic Datasets & Train Models:**
    *   The project uses custom simulators to generate data. Run these scripts to create initial datasets if they don't exist, or to refresh them.
    *   **Note:** The backend is designed to run simulations and model training on demand via API calls (e.g., by navigating to `/overall` on the frontend). However, you can manually pre-train models:
    ```bash
    python models/training_models/train_traffic_model.py
    python models/training_models/train_weather_model.py
    # Data simulators are usually called by the training scripts or optimization logic if needed
    ```

6.  **Run the Backend Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend server will typically run on `http://127.0.0.1:8000`.

### Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../scffl
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will be accessible at `http://localhost:3000`.

---

## 8. Usage

Once both the backend and frontend servers are running, open your web browser to interact with the SCFFL dashboard.

### Accessing the Dashboard

*   Open your browser and navigate to: `http://localhost:3000`

### Key Dashboard Pages

1.  **Home Page (`/`)**:
    *   Browse product categories and discover top-rated fresh produce.
    *   View a simplified "My Order" summary sidebar (note: for full order functionality, use `/navigations/order` and `/navigations/cart`).

2.  **Order Page (`/navigations/order`)**:
    *   Select fresh food items from various categories (Pulses, Millets, Vegetables, Others).
    *   Add or remove items from your cart.
    *   Displays current cart contents and subtotal. Click "Go to cart" to finalize.

3.  **Cart Page (`/navigations/cart`)**:
    *   Review all items in your cart, adjust quantities, or remove items entirely.
    *   View the subtotal, delivery charges, and final total.
    *   Proceed to checkout (currently a placeholder button).

4.  **Traffic Analytics (`/navigations/traffic`)**:
    *   Click "Run Deep Analysis" to train and evaluate the LSTM Traffic Prediction Model.
    *   View model performance metrics (Training Loss, Validation Loss, MAE) and dataset structure/preview.
    *   Click "View Dataset Details" to inspect the underlying historical traffic data schema.

5.  **Weather Impact (`/navigations/weather`)**:
    *   Click "Analyze Weather Models" to train and evaluate the LSTM Weather Impact Model.
    *   View model performance metrics (Training Loss, Validation Loss, MAE) and dataset structure/preview.
    *   Click "View Dataset Details" to inspect the underlying historical weather data schema.

6.  **Delivery Hubs (`/navigations/hubs`)**:
    *   Click "Show Hubs" to trigger the K-Means clustering algorithm.
    *   Visualize strategically optimized distribution hubs on an interactive map of Hyderabad.
    *   View a table listing hub details, including recommended product mix.

7.  **Fleet Intelligence (`/navigations/vehicle`)**:
    *   View the comprehensive registry of refrigerated vehicles and their attributes.
    *   Understand how vehicle parameters (fuel efficiency, cooling efficiency, age) impact cost and product quality.
    *   Inspect the dataset schema and preview of the simulated vehicle fleet.

8.  **Overall System Intelligence (`/navigations/overall`)**:
    *   **Model Performance Diagnostics:** Click "Run System Diagnosis" to simultaneously evaluate and display metrics (Accuracy, F1 Score, Confusion Matrix) for both Traffic and Weather LSTM models.
    *   **Intelligent Route Optimization:** Click "Run Hybrid Optimization" to initiate the IQPSO-SA algorithm. See the generated optimal delivery sequence, total duration, distribution cost, customer satisfaction, and an algorithm convergence plot.
    *   **Live Delivery Simulator:**
        *   Input a `Route Name` (e.g., "Gachibowli"), `Start Time`, and `Distance (km)`.
        *   Click "Simulate Delivery" to get real-time predictions for estimated delivery time, traffic index, rain, cost, and satisfaction.
        *   The system validates LSTM predictions against live TomTom API data, providing a dynamic model accuracy score.

9.  **Comparative Results (`/navigations/tables`)**:
    *   View the benchmark simulation comparing SCFFL's Proposed Hybrid-LSTM solution against traditional algorithms (IQPSO, GA, ACA) from *Wang et al. (2021)*.
    *   See detailed metrics for Total Cost, Customer Satisfaction, Distance, and RVs Used, highlighting SCFFL's superior performance.

### Testing Scenarios

To get a feel for the dynamic behavior:

*   **Peak Traffic Scenario (Overall page > Live Delivery Simulator):**
    *   Select `Gachibowli` for `Route Name`, `09:00` or `18:00` for `Start Time`.
    *   Expect: Higher predicted `Traffic Index`, longer `Estimated Delivery Time`, potentially higher `Predicted Cost`.
*   **Free Flow Scenario (Overall page > Live Delivery Simulator):**
    *   Select `Medchal` or `Outer Ring Road` for `Route Name`, `03:00` for `Start Time`.
    *   Expect: Low predicted `Traffic Index`, shorter `Estimated Delivery Time`, lower `Predicted Cost`.
*   **Run All Diagnostics:** Navigate to `/navigations/overall` and click "Run System Diagnosis" and "Run Hybrid Optimization" to see the full intelligence pipeline in action.

---

## 9. API Reference

The backend exposes a set of RESTful API endpoints via FastAPI. All endpoints are prefixed with `http://127.0.0.1:8000/`.

### Core Endpoints

*   **`GET /`**
    *   **Description:** Root endpoint, returns a simple message.
    *   **Response:** `{"message": "FastAPI is running"}`

*   **`GET /get_all_available_products`**
    *   **Description:** Retrieves the product catalog and their corresponding prices.
    *   **Response:**
        ```json
        {
          "product_catalog": {
            "Pulses": ["Toor Dal", "Moong Dal", ...],
            "Millets": ["Ragi", "Bajra", ...],
            "Vegetables": ["Tomato", "Potato", ...],
            "Others": ["Rice", "Wheat", ...]
          },
          "price_list": {
            "Toor Dal": 10,
            "Moong Dal": 10,
            ...
          }
        }
        ```

### Data & Analysis Endpoints

*   **`GET /traffic/get_dataset_info`**
    *   **Description:** Provides metadata and a preview of the historical traffic dataset.
    *   **Response Example:**
        ```json
        {
          "total_rows": 5000,
          "columns": [
            {"name": "traffic_index", "description": "TomTom traffic congestion index (0-100)"},
            ...
          ],
          "preview": [
            {"traffic_index": 25, "travel_time_mins": 15.2, ...},
            ...
          ]
        }
        ```

*   **`POST /traffic/get_analysis`**
    *   **Description:** Triggers the training/evaluation of the LSTM traffic prediction model and returns its metrics.
    *   **Response Example:**
        ```json
        {
          "analysis": {
            "training_loss": 0.005,
            "validation_loss": 0.007,
            "mean_absolute_error": 0.5,
            "val_mean_absolute_error": 0.6,
            "epochs": 50,
            "classification_metrics": {
              "accuracy": 0.845,
              "f1_score": 0.7582,
              "precision": 0.78,
              "recall": 0.74,
              "confusion_matrix": [[100, 20], [15, 60]]
            }
          }
        }
        ```

*   **`GET /weather/get_dataset_info`**
    *   **Description:** Provides metadata and a preview of the historical weather dataset.
    *   **Response (Similar to traffic_dataset_info):** Metadata and preview of weather data.

*   **`POST /weather/get_analysis`**
    *   **Description:** Triggers the training/evaluation of the LSTM weather prediction model and returns its metrics.
    *   **Response (Similar to traffic_get_analysis):** Metrics for weather prediction.

*   **`GET /vehicle/get_dataset_info`**
    *   **Description:** Provides metadata and a preview of the simulated vehicle fleet dataset.
    *   **Response (Similar to traffic_dataset_info):** Metadata and preview of vehicle data.

### Optimization Endpoints

*   **`GET /get_optimized_hubs`**
    *   **Description:** Computes and returns optimized distribution hub locations with associated product mixes.
    *   **Response Example:**
        ```json
        {
          "hubs": [
            {"cluster": 0, "hub_name": "Kompally Hub", "lat": 17.51, "lon": 78.48, "items": "Pulses, Vegetables"},
            {"cluster": 1, "hub_name": "Gachibowli Hub", "lat": 17.44, "lon": 78.37, "items": "Millets, Others"}
          ],
          "metrics": {
            "silhouette_score": 0.6478
          }
        }
        ```

*   **`POST /overall/predict_delivery`**
    *   **Description:** Predicts delivery time, cost, and customer satisfaction for a given route, with real-time API validation.
    *   **Request Body:**
        ```json
        {
          "route_name": "Gachibowli",
          "range_km": 15.0,
          "start_time": "09:00"
        }
        ```
    *   **Response Example:**
        ```json
        {
          "route": "Gachibowli",
          "distance_km": 15.0,
          "predicted_traffic_index": 75.2,
          "predicted_rain_mm": 2.5,
          "estimated_delivery_time_mins": 51,
          "conditions": {"congestion": "High", "weather": "Rainy"},
          "predicted_cost": 320.50,
          "predicted_satisfaction": 7.8,
          "real_time_validation": {
            "available": true,
            "metrics": {
              "tomtom_duration_mins": 48,
              "real_temp_c": 28.3,
              "current_speed_kmh": 22.5
            },
            "accuracy": {
              "time_accuracy_score": 94.1,
              "time_diff_mins": 3
            },
            "raw_data": {} # Raw TomTom API response
          }
        }
        ```

*   **`POST /optimization/run_routing`**
    *   **Description:** Executes the Hybrid IQPSO-SA route optimization algorithm and returns the optimal delivery sequence and associated metrics.
    *   **Response Example:**
        ```json
        {
          "best_sequence": ["Depot", "Location A", "Location B", "Depot"],
          "best_sequence_details": [
            {"location": "Location A", "vehicle_id": "RV001", "demand": 100},
            ...
          ],
          "min_total_time": 128.5,
          "distribution_cost": 27805.98,
          "customer_satisfaction": 9.0,
          "algorithm": "IQPSO-SA Hybrid (Quantum PSO + Simulated Annealing)",
          "convergence": [100000, 95000, ..., 24650.45], # Cost values per iteration
          "metrics": {
            "improvement_pct": 19.1,
            "iterations": 100
          }
        }
        ```

*   **`GET /result-benchmark`**
    *   **Description:** Runs a dynamic benchmark simulation and returns comparative results between the Proposed system and other algorithms (IQPSO, GA, ACA).
    *   **Response Example:**
        ```json
        {
          "proposed": {
            "total_cost": 24650.45,
            "satisfaction": 9.35,
            "distance": 128.5,
            "rvs": 7
          },
          "benchmarks": {
            "iqpso": {"cost": 30497.50, "sat": 8.409, "rvs": 8, "dist": 129.15},
            "ga": {"cost": 37158.0, "sat": 9.12, "rvs": 11, "dist": 150.1},
            "aca": {"cost": 19027.0, "sat": 7.52, "rvs": 4, "dist": 101.6}
          }
        }
        ```

---

## 10. Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please open an issue or submit a pull request.

---

## 11. License

This project is licensed under the MIT License. See the `LICENSE` file for details (if available, otherwise it defaults to standard MIT).

---