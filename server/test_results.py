from models.results_analyzer import results_analyzer

# Test a route
result = results_analyzer.analyze_delivery("HITEC_City_Main_Road", "09:00", 8.5)
print(result)
