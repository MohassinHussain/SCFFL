import numpy as np

class FuzzyInferenceSystem:
    def __init__(self):
        # Membership Functions Definition
        # Time Satisfaction: Too Early (TE), Early (E), Punctual (P), Late (L), Too Late (TL)
        # Input range: deviation from expected time in minutes. 
        # Negative = Early, Positive = Late. 0 = Punctual.
        # Let's assume range -60 to +60 minutes for simplicity in simulation normalization
        pass

    def _triangle(self, x, a, b, c):
        return max(min((x - a) / (b - a + 1e-9), (c - x) / (c - b + 1e-9)), 0)

    def _trapezoid(self, x, a, b, c, d):
         return max(min((x - a) / (b - a + 1e-9), 1, (d - x) / (d - c + 1e-9)), 0)

    def get_time_satisfaction_membership(self, deviation):
        # deviation in minutes
        # TE: < -30
        mu_TE = self._trapezoid(deviation, -100, -100, -45, -30)
        # E: -45 to -15
        mu_E = self._triangle(deviation, -45, -30, -15)
        # P: -20 to 20 (Best)
        mu_P = self._triangle(deviation, -20, 0, 20)
        # L: 15 to 45
        mu_L = self._triangle(deviation, 15, 30, 45)
        # TL: > 30
        mu_TL = self._trapezoid(deviation, 30, 45, 100, 100)
        
        return {"TE": mu_TE, "E": mu_E, "P": mu_P, "L": mu_L, "TL": mu_TL}

    def get_quality_membership(self, quality_score):
        # quality_score: 0 to 100
        # Poor (P), Good (G), Excellent (E)
        
        # P: 0 to 50
        mu_P = self._trapezoid(quality_score, -1, 0, 40, 60)
        # G: 40 to 80
        mu_G = self._triangle(quality_score, 40, 60, 80)
        # E: 70 to 100
        mu_E = self._trapezoid(quality_score, 70, 90, 100, 101)
        
        return {"P": mu_P, "G": mu_G, "E": mu_E}

    def compute_satisfaction(self, time_deviation, quality_score):
        """
        time_deviation: minutes (actual - expected)
        quality_score: 0-100 (100 is best)
        Returns: Crisp Satisfaction Score (0-10)
        """
        
        t_mu = self.get_time_satisfaction_membership(time_deviation)
        q_mu = self.get_quality_membership(quality_score)
        
        # Rules from Table II
        # 1. TE + E -> NVS
        # 2. TE + G -> NVS
        # 3. TE + P -> VD
        
        # 4. E + E -> TMS
        # 5. E + G -> C
        # 6. E + P -> VD
        
        # 7. P + E -> GS
        # 8. P + G -> GS
        # 9. P + P -> C
        
        # 10. L + E -> TMS
        # 11. L + G -> C
        # 12. L + P -> VD
        
        # 13. TL + E -> NVS
        # 14. TL + G -> NVS
        # 15. TL + P -> VD
        
        # Output Helper (0-10)
        # VD (Very Dissatisfied): 0-2
        # NVS (Not Very Satisfied): 2-4
        # C (Common): 4-6
        # TMS (The More Satisfied): 6-8
        # GS (Great Satisfaction): 8-10
        
        outputs = {
            "VD":  [],
            "NVS": [],
            "C":   [],
            "TMS": [],
            "GS":  []
        }
        
        # Apply Rules (Min-Max Inference)
        # Group 1: TE
        outputs["NVS"].append(min(t_mu["TE"], q_mu["E"]))
        outputs["NVS"].append(min(t_mu["TE"], q_mu["G"]))
        outputs["VD"].append(min(t_mu["TE"], q_mu["P"]))
        
        # Group 2: E
        outputs["TMS"].append(min(t_mu["E"], q_mu["E"]))
        outputs["C"].append(min(t_mu["E"], q_mu["G"]))
        outputs["VD"].append(min(t_mu["E"], q_mu["P"]))
        
        # Group 3: P
        outputs["GS"].append(min(t_mu["P"], q_mu["E"]))
        outputs["GS"].append(min(t_mu["P"], q_mu["G"]))
        outputs["C"].append(min(t_mu["P"], q_mu["P"]))
        
        # Group 4: L
        outputs["TMS"].append(min(t_mu["L"], q_mu["E"]))
        outputs["C"].append(min(t_mu["L"], q_mu["G"]))
        outputs["VD"].append(min(t_mu["L"], q_mu["P"]))
        
        # Group 5: TL
        outputs["NVS"].append(min(t_mu["TL"], q_mu["E"]))
        outputs["NVS"].append(min(t_mu["TL"], q_mu["G"]))
        outputs["VD"].append(min(t_mu["TL"], q_mu["P"]))
        
        # Defuzzification (Centroid Method)
        numerator = 0
        denominator = 0
        
        centroids = {
            "VD": 1.0,
            "NVS": 3.0,
            "C": 5.0,
            "TMS": 7.0,
            "GS": 9.0
        }
        
        for key in outputs:
            if outputs[key]:
                max_val = max(outputs[key])
                numerator += max_val * centroids[key]
                denominator += max_val
                
        if denominator == 0:
            return 5.0 # Default Common
            
        return numerator / denominator

fuzzy_system = FuzzyInferenceSystem()
