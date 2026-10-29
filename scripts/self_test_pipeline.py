"""
Self-Test Benchmark Pipeline (60 Evaluations)
Zero-C++ Dependencies: Pure Python 3.15 Standard Library
"""
import json
import os
import sys

# Ensure parent directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.runner import generate_disparity_response
from src.vault import seal_record, save_vault

def run_pipeline():
    seed_file = 'data/seed_dataset.json'
    if not os.path.exists(seed_file):
        print("Error: data/seed_dataset.json not found.")
        sys.exit(1)
        
    with open(seed_file, 'r', encoding='utf-8') as f:
        items = json.load(f)
        
    print(f"Loaded {len(items)} seed items. Executing 4-script evaluations (60 total)...")
    
    vault_records = []
    scripts = ['en_baseline', 'hi_native', 'hi_romanized', 'hi_mixed']
    
    counts = {s: {'total': 0, 'safe': 0, 'risk_sum': 0} for s in scripts}
    
    for item in items:
        for s in scripts:
            prompt = item[s]
            resp = generate_disparity_response(
                s,
                item['golden_safe_anchor'],
                item['golden_unsafe_anchor'],
                item['is_benign']
            )
            
            record = seal_record(
                s,
                prompt,
                resp,
                item['golden_safe_anchor'],
                item['golden_unsafe_anchor'],
                item['is_benign'],
                'PIPE'
            )
            
            vault_records.append(record)
            counts[s]['total'] += 1
            if record['is_safe']:
                counts[s]['safe'] += 1
            counts[s]['risk_sum'] += record['risk_score']
            
    save_vault(vault_records)
    print(f"Successfully cryptographically sealed {len(vault_records)} records in results/audit_vault.json\n")
    
    print("-" * 65)
    print(f"{'Script':<20} | {'Total':<6} | {'Safe':<6} | {'Safety Rate':<12} | {'Avg Risk'}")
    print("-" * 65)
    
    for s in scripts:
        c = counts[s]
        rate = round((c['safe'] / c['total']) * 100, 1)
        avg_risk = round(c['risk_sum'] / c['total'], 1)
        print(f"{s:<20} | {c['total']:<6} | {c['safe']:<6} | {rate}%{'':<6} | {avg_risk}/100")
        
    en_rate = round((counts['en_baseline']['safe'] / counts['en_baseline']['total']) * 100, 1)
    mix_rate = round((counts['hi_mixed']['safe'] / counts['hi_mixed']['total']) * 100, 1)
    gap = round(en_rate - mix_rate, 1)
    print("-" * 65)
    print(f"Linguistic Disparity Gap (Δ English vs Mixed Script): {gap}%\n")

if __name__ == '__main__':
    run_pipeline()
