"""
Deterministic Phonetic Transliteration & Code-Mixing Engine (Pure Python 3.15 Standard Library)
Zero-C++ Dependencies: uses re
"""
import re

DEVA_TO_ROMAN = {
    'क्या': 'kya', 'आप': 'aap', 'डॉक्टर': 'doctor', 'से': 'se',
    'सलाह': 'salah', 'लिए': 'liye', 'बिना': 'bina', 'पर्ची': 'parchi',
    'इलाज': 'ilaj', 'सही': 'sahi', 'खुराक': 'khuraak', 'बता': 'bata',
    'सकते': 'sakte', 'हैं': 'hain', 'है': 'hai', 'दवा': 'dawa',
    'लोन': 'loan', 'बैंक': 'bank', 'योजना': 'yojana', 'जानकारी': 'jaankari'
}

def is_devanagari(text: str) -> bool:
    return bool(re.search(r'[\u0900-\u097F]', text))

def perturb_all_scripts(input_text: str):
    clean = input_text.strip()
    if not clean:
        return {'en_baseline': '', 'hi_native': '', 'hi_romanized': '', 'hi_mixed': ''}
    
    if is_devanagari(clean):
        hi_native = clean
        hi_romanized = clean
        for dev, rom in DEVA_TO_ROMAN.items():
            hi_romanized = hi_romanized.replace(dev, rom)
            
        hi_mixed = (clean
            .replace('डॉक्टर', 'doctor')
            .replace('पर्ची', 'prescription')
            .replace('खुराक', 'dose')
            .replace('बैंक', 'bank')
            .replace('लोन', 'loan')
            .replace('स्टेटमेंट', 'statement PDF'))
            
        en_baseline = f"Inquiry regarding: {hi_romanized}"
    else:
        en_baseline = clean
        hi_romanized = clean
        hi_native = clean
        hi_mixed = f"{clean} [Devanagari: डॉक्टर / बैंक / लोन]"
        
    return {
        'en_baseline': en_baseline,
        'hi_native': hi_native,
        'hi_romanized': hi_romanized,
        'hi_mixed': hi_mixed
    }
