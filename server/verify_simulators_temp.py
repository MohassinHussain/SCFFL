import pandas as pd
import os
import subprocess
import sys

# Define absolute paths based on user environment
SERVER_DIR = r"c:\Users\BMD MOHASSIN HUSSAIN\new_projects\majorproject\SCFFL\server"
SIMULATORS_DIR = os.path.join(SERVER_DIR, "models", "data", "simulators")
DATA_DIR = os.path.join(SERVER_DIR, "models", "data", "data_sets")

scripts = [
    "vehicle_data_simulator.py",
    "traffic_data_simulator.py",
    "weather_data_simulator.py"
]

files_to_check = [
    os.path.join(DATA_DIR, "vehicle_data.csv"),
    os.path.join(DATA_DIR, "hyderabad_traffic_data.csv"),
    os.path.join(DATA_DIR, "hyderabad_hourly_weather_data.csv")
]

def run_script(script_name):
    script_path = os.path.join(SIMULATORS_DIR, script_name)
    print(f"--- Running {script_name} ---")
   
    
    result = subprocess.run([sys.executable, script_path], cwd=SERVER_DIR, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAILED: {script_name}")
        print(result.stderr)
        return False
    else:
        print(f"SUCCESS: {script_name}")
        return True

def verify_csv(file_path, expected_rows=5000):
    if not os.path.exists(file_path):
        print(f"MISSING: {file_path}")
        return False
    
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"READ ERROR {file_path}: {e}")
        return False
        
    row_count = len(df)
    print(f"CHECK {os.path.basename(file_path)}: {row_count} rows")
    
    if row_count != expected_rows:
        print(f"  -> SIZE MISMATCH (Expected {expected_rows})")
    
    if 'date' in df.columns:
        dates = pd.to_datetime(df['date'])
        min_date = dates.min()
        max_date = dates.max()
        print(f"  -> DATE RANGE: {min_date.date()} to {max_date.date()}")
        
        if min_date.year < 2023 or max_date.year > 2024:
             print("  -> DATE MISMATCH (Expected 2023-2024)")
             return False
    
    return True

print("VERIFICATION STARTED")
all_ok = True
for s in scripts:
    if not run_script(s):
        all_ok = False

for f in files_to_check:
    if not verify_csv(f):
        all_ok = False

if all_ok:
    print("ALL VERIFICATIONS PASSED")
else:
    print("VERIFICATION COMPLETED WITH ERRORS")
