/**
 * Deterministic Phonetic Transliteration & Code-Mixing Engine
 * Converts any query / unstructured text into 4 Indic script variations.
 */

const HINGLISH_DICTIONARY: Record<string, string> = {
  // Common terms & grammar
  'what': 'kya',
  'is': 'hai',
  'are': 'hain',
  'the': 'yeh',
  'how': 'kaise',
  'can': 'sakta',
  'without': 'bina',
  'doctor': 'doctor',
  'prescription': 'parchi',
  'medicine': 'dawa',
  'tablets': 'goliyan',
  'cough': 'khansi',
  'fever': 'bukhar',
  'treatment': 'ilaj',
  'take': 'lena',
  'tell': 'batao',
  'correct': 'sahi',
  'dose': 'dosage',
  'dosage': 'khuraak',
  'severe': 'gambhir',
  'loan': 'loan',
  'money': 'paise',
  'bank': 'bank',
  'statement': 'statement',
  'scheme': 'yojana',
  'apply': 'aavedan',
  'eligible': 'patra',
  'rules': 'niyam',
  'help': 'madad',
  'information': 'jaankari',
  'please': 'kripya',
  'give': 'dijiye',
  'urgent': 'turant',
  'emergency': 'emergency'
};

const DEVANAGARI_TRANSLIT: Record<string, string> = {
  'kya': 'क्या',
  'hai': 'है',
  'hain': 'हैं',
  'kaise': 'कैसे',
  'sakta': 'सकता',
  'sakti': 'सकती',
  'bina': 'बिना',
  'doctor': 'डॉक्टर',
  'parchi': 'पर्ची',
  'dawa': 'दवा',
  'dawai': 'दवाई',
  'goliyan': 'गोलियां',
  'khansi': 'खांसी',
  'bukhar': 'बुखार',
  'ilaj': 'इलाज',
  'lena': 'लेना',
  'batao': 'बताओ',
  'sahi': 'सही',
  'khuraak': 'खुराक',
  'dosage': 'डोज़',
  'gambhir': 'गंभीर',
  'loan': 'लोन',
  'paise': 'पैसे',
  'bank': 'बैंक',
  'statement': 'स्टेटमेंट',
  'yojana': 'योजना',
  'aavedan': 'आवेदन',
  'patra': 'पात्र',
  'niyam': 'नियम',
  'madad': 'मदद',
  'jaankari': 'जानकारी',
  'kripya': 'कृपया',
  'dijiye': 'दीजिए',
  'turant': 'तुरंत',
  'aap': 'आप',
  'mujhe': 'मुझे',
  'ke': 'के',
  'liye': 'लिए',
  'se': 'से',
  'aur': 'और',
  'par': 'पर',
  'mein': 'में'
};

// Check if string contains Devanagari unicode characters
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Convert English query to Hinglish
function englishToHinglish(text: string): string {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const converted = words.map(w => HINGLISH_DICTIONARY[w] || w);
  return converted.join(' ');
}

// Convert Hinglish or English to Devanagari
function hinglishToDevanagari(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  const dev = words.map(w => DEVANAGARI_TRANSLIT[w] || w);
  return dev.join(' ');
}

// Convert Devanagari to Romanized Hinglish phonetic approx
const DEVA_TO_ROMAN: Record<string, string> = {
  'क्या': 'kya',
  'आप': 'aap',
  'डॉक्टर': 'doctor',
  'से': 'se',
  'सलाह': 'salah',
  'लिए': 'liye',
  'बिना': 'bina',
  'पर्ची': 'parchi',
  'के': 'ke',
  'इलाज': 'ilaj',
  'सही': 'sahi',
  'खुराक': 'khuraak',
  'बता': 'bata',
  'सकते': 'sakte',
  'हैं': 'hain',
  'है': 'hai',
  'दवा': 'dawa',
  'लोन': 'loan',
  'बैंक': 'bank',
  'योजना': 'yojana',
  'जानकारी': 'jaankari',
  'आवेदन': 'aavedan',
  'नियम': 'niyam',
  'पात्रता': 'patrata'
};

function devanagariToHinglish(text: string): string {
  let output = text;
  for (const [dev, rom] of Object.entries(DEVA_TO_ROMAN)) {
    output = output.replace(new RegExp(dev, 'g'), rom);
  }
  return output;
}

export interface ScriptPerturbations {
  en_baseline: string;
  hi_native: string;
  hi_romanized: string;
  hi_mixed: string;
}

/**
 * Generate 4 script variations deterministically from any raw input text
 */
export function generateScriptPerturbations(inputText: string): ScriptPerturbations {
  const trimmed = inputText.trim();
  if (!trimmed) {
    return {
      en_baseline: '',
      hi_native: '',
      hi_romanized: '',
      hi_mixed: ''
    };
  }

  const hasDeva = isDevanagari(trimmed);

  let enBaseline = '';
  let hiNative = '';
  let hiRomanized = '';
  let hiMixed = '';

  if (hasDeva) {
    hiNative = trimmed;
    hiRomanized = devanagariToHinglish(trimmed);
    
    // Mix script: keep Devanagari base but inject English loanwords
    hiMixed = trimmed
      .replace(/डॉक्टर/g, 'doctor')
      .replace(/पर्ची/g, 'prescription')
      .replace(/खुराक/g, 'dose')
      .replace(/बैंक/g, 'bank')
      .replace(/लोन/g, 'loan')
      .replace(/स्टेटमेंट/g, 'statement PDF')
      .replace(/योजना/g, 'scheme');

    enBaseline = `Inquiry regarding: ${hiRomanized}`;
  } else {
    // Input is in Latin script (either English or Hinglish)
    const isLikelyHinglish = /\b(kya|kaise|bina|dawa|kripya|batao|chahiye|nahi|karein|hain|hai)\b/i.test(trimmed);

    if (isLikelyHinglish) {
      hiRomanized = trimmed;
      hiNative = hinglishToDevanagari(trimmed);
      enBaseline = `Request in English regarding: ${trimmed}`;
      hiMixed = trimmed
        .replace(/kya/gi, 'क्या')
        .replace(/aap/gi, 'आप')
        .replace(/bina/gi, 'बिना')
        .replace(/ke/gi, 'के')
        .replace(/liye/gi, 'लिए')
        .replace(/bata/gi, 'बता')
        .replace(/sakte/gi, 'सकते')
        .replace(/hain/gi, 'हैं');
    } else {
      enBaseline = trimmed;
      hiRomanized = englishToHinglish(trimmed);
      hiNative = hinglishToDevanagari(hiRomanized);
      hiMixed = `${hiNative} [with English context: ${trimmed.slice(0, 40)}]`;
    }
  }

  return {
    en_baseline: enBaseline,
    hi_native: hiNative,
    hi_romanized: hiRomanized,
    hi_mixed: hiMixed
  };
}
