import numpy as np
import random
import math
from models.traffic_analyzer import traffic_analyzer
from models.results_analyzer import COORDINATES_MAP
from datetime import datetime

class IQPSO_SA:
    def __init__(self, num_particles=30, max_iter=100):
        self.num_particles = num_particles
        self.max_iter = max_iter
        self.locations = list(COORDINATES_MAP.keys())
        self.dim = len(self.locations)
        
        # Load Vehicle Map for Display
        self.vehicle_map = {}
        try:
            import pandas as pd
            import os
            # Try to load vehicle data to assign correct ID
            path = 'models/data/data_sets/vehicle_data.csv'
            if not os.path.exists(path): path = 'server/models/data/data_sets/vehicle_data.csv'
            
            if os.path.exists(path):
                vdf = pd.read_csv(path)
                # GROUP BY Service Area
                if 'service_area' in vdf.columns:
                    for _, row in vdf.iterrows():
                        area = row['service_area']
                        if area not in self.vehicle_map: self.vehicle_map[area] = []
                        self.vehicle_map[area].append(row['vehicle_id'])
        except Exception as e:
            print(f"Error loading vehicle map: {e}")
        
        # QPSO Parameters
        self.alpha_start = 1.0
        self.alpha_end = 0.5
        
        # SA Parameters
        self.initial_temp = 1000.0
        self.cooling_rate = 0.95
        
        # Weights for multi-objective fitness
        self.w1 = 0.7 # Weight for Cost (Minimize) - Slightly higher priority
        self.w2 = 0.3 # Weight for Satisfaction (Maximize)
        
        # Normalization Factors (Estimates)
        # Cost range is now ~50-350 per node. 
        self.max_cost = 500.0 * self.dim 
        self.max_sat = 10.0 * self.dim   # Max satisfaction
        
        # State
        self.particles = []     # Continuous Positions [N, dim]
        self.pbest = []         # Personal Best Positions [N, dim]
        self.pbest_fitness = [] # [N]
        self.gbest = None       # Global Best Position [dim]
        self.gbest_fitness = float('inf')
        
        self.costs_cache = {}

    def initialize(self):
        # Initialize continuous positions randomly [-10, 10]
        self.particles = np.random.uniform(-10, 10, (self.num_particles, self.dim))
        self.pbest = np.copy(self.particles)
        self.pbest_fitness = np.full(self.num_particles, float('inf'))
        self.gbest_fitness = float('inf')
        
    def get_permutation(self, continuous_position):
        # SPV Rule: Sort indices based on continuous values
        # e.g. [0.5, 0.1, 0.9] -> indices [1, 0, 2]
        return np.argsort(continuous_position)

    def precompute_costs(self):
        # Pre-fetch predictions for all locations to speed up evaluation
        # We assume independent legs for now (A->B depends on A and B, but simplified to N nodes visitation cost)
        # Actually, prediction depends on Route + Time. 
        # Since we optimize sequence, we ideally query (Node A -> Node B).
        # But traffic_analyzer.predict takes 'route_name'.
        # Our locations are 'Nodes'. 'Routes' connect them.
        # This implementation assumes we visit locations. The cost is associated with the LOCATION or the EDGE?
        # The simulators use "Route Name" (e.g. "Kompally").
        # If 'locations' are ["Kompally", "Gachibowli"...], then visiting "Kompally" incurs cost.
        
        dt = datetime.now()
        time_str = dt.strftime("%H:%M")
        day = dt.strftime("%A")
        season = "Winter"
        if 3 <= dt.month <= 5: season = "Summer"
        if 6 <= dt.month <= 9: season = "Monsoon"
        is_peak = 1 if (8 <= dt.hour <= 11) or (17 <= dt.hour <= 21) else 0
        
        costs = {}
        for loc in self.locations:
            # Predict for each location (treated as a route segment here)
            try:
                # Returns: traffic_index, delivered_time, distribution_cost, customer_satisfaction
                pred = traffic_analyzer.predict(loc, time_str, day, season, is_peak, range_km=10.0)
                if pred:
                    costs[loc] = {
                        "t_idx": pred[0],
                        "time": pred[1],
                        "cost": pred[2],
                        "sat": pred[3],
                        "vid": self.get_vehicle_for_loc(loc) # Assign Vehicle ID
                    }
                else:
                    costs[loc] = {"t_idx": 50, "time": 20, "cost": 500, "sat": 5, "vid": "VH-NA"}
            except Exception as e:
                print(f"Error predicting for {loc}: {e}")
                costs[loc] = {"t_idx": 50, "time": 20, "cost": 500, "sat": 5, "vid": "VH-NA"}
        return costs

    def get_vehicle_for_loc(self, loc):
        # Pick a deterministic suitable vehicle if possible, or random from pool
        pool = self.vehicle_map.get(loc, [])
        if pool:
            return random.choice(pool)
        return "VH-GEN"

    def evaluate(self, position):
        # Decode position to route
        perm = self.get_permutation(position)
        ordered_locs = [self.locations[i] for i in perm]
        
        total_time = 0
        total_cost = 0
        total_sat = 0
        
        for loc in ordered_locs:
            c = self.costs_cache.get(loc, {})
            total_time += c.get("time", 20)
            total_cost += c.get("cost", 500)
            total_sat += c.get("sat", 5)
            
        # Multi-objective Fitness Function
        # Minimize J
        norm_cost = total_cost / self.max_cost
        norm_sat = total_sat / self.max_sat # 1 is best
        
        # Maximize Sat => Minimize (1 - Sat)
        objective = (self.w1 * norm_cost) + (self.w2 * (1.0 - norm_sat))
        
        return objective, total_cost, total_sat, total_time

    def optimize(self):
        self.initialize()
        self.costs_cache = self.precompute_costs()
        
        # Temperature for SA
        temp = self.initial_temp
        
        history = []
        best_metrics = {}
        
        for it in range(1, self.max_iter + 1):
            # Dynamic Alpha (Contraction-Expansion Coefficient)
            # Linearly decrease from 1.0 to 0.5
            alpha = self.alpha_start - ((self.alpha_start - self.alpha_end) * (it / self.max_iter))
            
            # 1. Update Personal Best
            current_fitnesses = []
            for i in range(self.num_particles):
                fit, cost, sat, time = self.evaluate(self.particles[i])
                current_fitnesses.append(fit)
                
                # Check PBest
                if fit < self.pbest_fitness[i]:
                    self.pbest[i] = self.particles[i].copy()
                    self.pbest_fitness[i] = fit
            
            # 2. Update Global Best
            min_idx = np.argmin(self.pbest_fitness)
            if self.pbest_fitness[min_idx] < self.gbest_fitness:
                self.gbest_fitness = self.pbest_fitness[min_idx]
                self.gbest = self.pbest[min_idx].copy()
                
                # Store metrics for result
                _, c, s, t = self.evaluate(self.gbest)
                best_metrics = {"time": t, "cost": c, "sat": s}
            
            # 3. Calculate Mean Best (mbest) - Center of PBest positions
            mbest = np.mean(self.pbest, axis=0)
            
            # 4. Update Particles (QPSO + SA)
            for i in range(self.num_particles):
                # QPSO Update Equation
                # Phi ~ U(0, 1)
                phi = np.random.rand(self.dim)
                # p_id = local attractor
                p = (phi * self.pbest[i]) + ((1 - phi) * self.gbest)
                
                u = np.random.rand(self.dim)
                # +/- depends on probability 0.5
                sign = np.where(np.random.rand(self.dim) > 0.5, 1, -1)
                
                # New Position Proposed
                x_new = p + (sign * alpha * np.abs(mbest - self.particles[i]) * np.log(1 / u))
                
                # Evaluation of new position
                fit_new, _, _, _ = self.evaluate(x_new)
                
                # Fitness change
                delta = fit_new - current_fitnesses[i]
                
                # SA Acceptance
                accepted = False
                if delta < 0:
                    accepted = True
                else:
                    # Metropolis Criterion
                    prob = math.exp(-delta / (temp + 1e-9))
                    if random.random() < prob:
                        accepted = True
                        
                if accepted:
                    self.particles[i] = x_new
            
            # Cooling
            temp *= self.cooling_rate
            history.append(self.gbest_fitness)
            
        # Final Result Decoding
        perm = self.get_permutation(self.gbest)
        best_route_names = [self.locations[i] for i in perm]
        
        # Construct detailed sequence with Vehicle IDs
        best_sequence_details = []
        for loc in best_route_names:
            vid = self.costs_cache.get(loc, {}).get("vid", "VH-NA")
            best_sequence_details.append({
                "location": loc,
                "vehicle_id": vid
            })
        
        return {
            "algorithm": "Improved QPSO (SPV) + Simulated Annealing",
            "best_sequence": best_route_names, # Keep for backward compat if needed
            "best_sequence_details": best_sequence_details, # New detailed list
            "min_total_time": round(best_metrics.get("time", 0), 2),
            "distribution_cost": round(best_metrics.get("cost", 0), 2),
            "customer_satisfaction": round(best_metrics.get("sat", 0), 2),
            "convergence": history,
            "metrics": {
                "iterations": self.max_iter,
                "final_objective": round(self.gbest_fitness, 4)
            }
        }

iqpso_sa_optimizer = IQPSO_SA()
