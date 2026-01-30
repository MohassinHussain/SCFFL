# SCFFL: Smart City Fresh Food Logistics

## 1. Main Idea of the Project
SCFFL (Smart City Fresh Food Logistics) is an intelligent, data-driven logistics platform designed to optimize the distribution of perishable agricultural products in urban environments (specifically Hyderabad). It integrates real-time traffic data, weather conditions, and vehicle-specific attributes to ensure fresh food is delivered efficiently, minimizing waste and maximizing customer satisfaction.

## 2. What Problems are Solved
*   **Perishable Food Waste:** Reduces spoilage by optimizing routes based on time and environmental conditions.
*   **Inefficient Routing:** Moves beyond simple distance-based routing to consider traffic congestion, weather impact, and vehicle capabilities.
*   **Unpredictable Costs:** Provides accurate dynamic cost estimation considering fuel type, maintenance, and penalties.
*   **Customer Dissatisfaction:** Uses fuzzy logic to quantify and improve customer satisfaction by balancing delivery timeliness with product quality.

## 3. System Architecture & Algorithms

### A. Traffic & Weather Prediction (LSTM)
*   **Algorithm:** Long Short-Term Memory (LSTM) Recurrent Neural Networks.
*   **Performance:**
    *   **Accuracy:** **84.50%** in classifying traffic conditions (Low/High).
    *   **F1 Score:** **75.82%**.
*   **Usage:**
    *   **Traffic Model:** Predicts `traffic_index`, `travel_time`, and `distribution_cost`.
    *   **Weather Model:** Predicts localized rain probability and temperature.

### B. Intelligent Route Optimization (IQPSO-SA)
*   **Algorithm:** Hybrid Improved Quantum-Behaved Particle Swarm Optimization (IQPSO) with Simulated Annealing (SA).
*   **Usage:** Determines the optimal sequence of delivery locations.
*   **Innovation:**
    *   **IQPSO:** Fast global exploration of route possibilities.
    *   **Simulated Annealing (SA):** Prevents getting stuck in local optima by accepting temporarily worse solutions to find a better global path.

### C. Customer Satisfaction (Fuzzy Logic)
*   **Algorithm:** Fuzzy Inference System (Mamdani).
*   **Inputs:**
    *   `Time Deviation`: Difference between promised and actual arrival (e.g., -10 mins early, +30 mins late).
    *   `Quality Score`: Derived from road roughness, vehicle cooling efficiency, and weather.
*   **Output:** A granular satisfaction score (0-10) that mimics human judgment.

### D. Strategic Hub Optimization
*   **Algorithm:** K-Means Clustering + Random Forest.
*   **Usage:**
    *   **K-Means:** Groups demand points into optimal clusters to locate Distribution Hubs (Silhouette Score: **0.65**).
    *   **Random Forest:** Predicts the best product mix (e.g., Tomatoes vs Rice) for each hub based on local demand patterns.

## 4. Parameter Consideration
The system considers a holistic set of parameters for every decision:
*   **Traffic:** Congestion index (TomTom scale), current speed, free-flow speed.
*   **Weather:** Rain intensity (affects speed & safety), Temperature (affects cooling cost).
*   **Vehicle Attributes:**
    *   **Fuel Efficiency:** Impacts running costs (Diesel vs Electric).
    *   **Cooling Efficiency:** Impacts product quality preservation.
    *   **Age/Maintenance:** Adds probability of delays/breakdowns.

## 5. Comparative Results (Proposed vs Benchmark)
We validated our **Hybrid IQPSO-SA** approach against the standard benchmarks from *Wang et al. (2021)* using a dynamic simulation of **50 Orders**.

| Metric | Proposed System (Hybrid IQPSO-SA) | Benchmark (Wang IQPSO) | Improvement |
| :--- | :--- | :--- | :--- |
| **Total Cost** | **₹27,805.98** | ₹30,497.50 | **8.83% Less Cost** |
| **Satisfaction** | **9.0 / 10** | 8.41 / 10 | **7.03% Higher Satisfaction** |
| **Distance** | **128.5 km** | 129.2 km | - |

*(Note: Costs converted to INR. Simulation demonstrates that our data-driven approach avoids costly congestion that static benchmarks miss.)*

## 6. Project Components & features
*   **Simulatory Data Engine:**
    *   Custom `TrafficSimulator`, `VehicleSimulator`, and `WeatherSimulator` generate realistic, interlinked datasets (5000+ records) reflecting local Hyderabad geography.
*   **Real-Time Validator:**
    *   `ResultsAnalyzer` module checks LSTM predictions against live **TomTom Traffic API** and **Open-Meteo Weather API** to ensure model drift is detected.
*   **Frontend Dashboard (Next.js):**
    *   **Traffic Analysis:** Visualizes peak hour trends.
    *   **Comparison Tables:** Dynamic UI showing the Proposed vs Benchmark performance.
    *   **Live Simulator:** Run specific delivery scenarios to see cost breakdown.

## 7. How to Test the Application
1.  **Traffic Analysis:** Navigate to `/traffic` to see LSTM predictions vs Real-time data.
2.  **Comparison:** Go to `/navigations/tables` to run the active benchmark simulation and see the results table.
3.  **Hub Optimization:** Check the Hubs page to see K-Means clustering in action.
4.  **Prediction:** Use the home page simulator to input a route (e.g., "Gachibowli") and time, and see the predicted Cost & Satisfaction.

## 8. Conclusion
This project successfully demonstrates that a **Hybrid AI approach**—combining Deep Learning for environment prediction with Evolutionary Algorithms for routing—significantly outperforms static heuristics. By integrating distinct "Satisfaction" and "Cost" objectives, it provides a balanced, sustainable solution for modern urban cold chains.
