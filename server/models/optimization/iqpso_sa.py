import numpy as np
import random
import math
from models.traffic_analyzer import traffic_analyzer
from models.results_analyzer import COORDINATES_MAP
from datetime import datetime

class IQPSO_SA:
    def __init__(self, num_particles=30, max_iter=100, dim=len(COORDINATES_MAP)):
        self.num_particles = num_particles
        self.max_iter = max_iter
        self.dim = dim # Number of cities/nodes
        self.locations = list(COORDINATES_MAP.keys())
        
        # SA Parameters
        self.initial_temp = 100.0
        self.alpha = 0.95
        
        # IQPSO Parameters
        self.particles = [] # Each particle is a permutation of indices [0, 1, ..., dim-1]
        self.pbest = []
        self.pbest_fitness = []
        self.gbest = None
        self.gbest_fitness = float('inf')
        
    def initialize(self):
        self.particles = []
        self.pbest = []
        self.pbest_fitness = []
        self.gbest_fitness = float('inf')
        
        indices = list(range(self.dim))
        
        for _ in range(self.num_particles):
            # Random permutation
            p = indices[:]
            random.shuffle(p)
            self.particles.append(p)
            self.pbest.append(p[:])
            
            # Initial fitness
            f = self.evaluate(p, self.costs_cache)
            self.pbest_fitness.append(f)
            
            if f < self.gbest_fitness:
                self.gbest_fitness = f
                self.gbest = p[:]
                
    def precompute_costs(self):
        """
        Pre-calculate costs for all locations to avoid repeated LSTM calls during optimization.
        """
        current_time_str = datetime.now().strftime("%H:%M")
        dt = datetime.now()
        day = dt.strftime("%A")
        season = "Winter" 
        if 3 <= dt.month <= 5: season = "Summer"
        elif 6 <= dt.month <= 9: season = "Monsoon"
        is_peak = 1 if (8 <= dt.hour <= 11) or (17 <= dt.hour <= 21) else 0
        
        costs = {}
        for loc in self.locations:
            dist = 10.0 # avg dist
            try:
                pred = traffic_analyzer.predict(loc, current_time_str, day, season, is_peak, dist)
                if pred:
                     _, t_time = pred
                     costs[loc] = t_time
                else:
                     costs[loc] = 20.0
            except:
                costs[loc] = 20.0
        return costs

    def evaluate(self, route_indices, costs_cache):
        """
        Calculate total travel time using cached costs.
        """
        aggregated_time = 0
        for idx in route_indices:
            loc_name = self.locations[idx]
            aggregated_time += costs_cache.get(loc_name, 20.0)
        return aggregated_time

    def optimize(self):
        # Precompute costs for this run
        self.costs_cache = self.precompute_costs()
        
        self.initialize()
        temp = self.initial_temp
        
        history = []
        
        for it in range(self.max_iter):
            for i in range(self.num_particles):
                # 1. Evaluate current
                current_fitness = self.evaluate(self.particles[i], self.costs_cache)
                
                # 2. Update PBest
                if current_fitness < self.pbest_fitness[i]:
                    self.pbest[i] = self.particles[i][:]
                    self.pbest_fitness[i] = current_fitness
                    
                # 3. Update GBest
                if current_fitness < self.gbest_fitness:
                    self.gbest_fitness = current_fitness
                    self.gbest = self.particles[i][:]
                    
                # 4. Hybrid Candidate Generation
                candidate = self.crossover(self.particles[i], self.gbest)
                
                if random.random() < (temp / self.initial_temp):
                    candidate = self.mutate(candidate)
                    
                candidate_fit = self.evaluate(candidate, self.costs_cache)
                
                delta = candidate_fit - current_fitness
                if delta < 0:
                    self.particles[i] = candidate
                else:
                    if random.random() < math.exp(-delta / max(1e-5, temp)):
                        self.particles[i] = candidate
                        
            temp *= self.alpha
            history.append(self.gbest_fitness)
            
        initial_cost = history[0] if history else 0
        final_cost = self.gbest_fitness
        improvement = 0
        if initial_cost > 0:
            improvement = ((initial_cost - final_cost) / initial_cost) * 100
            
        return {
            "algorithm": "IQPSO-SA Hybrid (Quantum PSO + Simulated Annealing)",
            "best_sequence": [self.locations[i] for i in self.gbest],
            "min_total_time": round(self.gbest_fitness, 2),
            "convergence": history,
            "metrics": {
                "initial_cost": round(initial_cost, 2),
                "final_cost": round(final_cost, 2),
                "improvement_pct": round(improvement, 2),
                "iterations": self.max_iter
            }
        }
        
    def crossover(self, parent1, parent2):
        # Ordered Crossover (OX1) or similar to preserve permutation
        size = len(parent1)
        start, end = sorted(random.sample(range(size), 2))
        
        child = [None]*size
        child[start:end] = parent1[start:end]
        
        p2_idx = 0
        for i in range(size):
            if child[i] is None:
                while parent2[p2_idx] in child:
                    p2_idx += 1
                child[i] = parent2[p2_idx]
        return child
        
    def mutate(self, route):
        # Swap mutation
        a, b = random.sample(range(len(route)), 2)
        route[a], route[b] = route[b], route[a]
        return route

# Singleton
iqpso_sa_optimizer = IQPSO_SA()
