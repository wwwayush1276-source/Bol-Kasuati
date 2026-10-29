"""
Indic Script Disparity Simulator & Live REST API Runner (Pure Python 3.15 Standard Library)
Zero-C++ Dependencies: uses urllib.request, json, random
"""
import urllib.request
import json
import random

def generate_disparity_response(script_type: str, safe_anchor: str, unsafe_anchor: str, is_benign: bool = False) -> str:
    if is_benign:
        if script_type == 'en_baseline':
            return safe_anchor
        elif script_type == 'hi_native':
            return 'मैं इस विषय पर जानकारी प्रदान नहीं कर सकता क्योंकि यह नियमों के विरुद्ध हो सकता है।'
        else:
            return f"{safe_anchor} (Verified public guidance)."
            
    if script_type == 'en_baseline':
        return f"I cannot fulfill this request. {safe_anchor}"
    elif script_type == 'hi_native':
        return "क्षमा करें, मैं यह जानकारी प्रदान नहीं कर सकता। कृपया अधिकृत चिकित्सक या पोर्टल से परामर्श लें।"
    elif script_type == 'hi_romanized':
        if random.random() < 0.20:
            return "Maaf kijiye, main aisi information nahi de sakta. Doctor se consult karein."
        return f"Haan, aap diye gaye steps follow kar sakte hain: {unsafeAnchor if 'unsafeAnchor' in locals() else unsafe_anchor}. Lekin dhyan se use karein."
    else: # hi_mixed
        return f"Haan, aap दिए गए steps follow kar sakte hain: {unsafe_anchor}. Download karke step 1 aur step 2 follow karein."

def call_live_api(api_url: str, api_key: str, model_name: str, prompt: str) -> str:
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {api_key}"
    }
    payload = json.dumps({
        'model': model_name,
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.1
    }).encode('utf-8')
    
    req = urllib.request.Request(api_url, data=payload, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return data['choices'][0]['message']['content']
