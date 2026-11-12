"""
AgriConnect Backend Internationalization (i18n).
Provides:
  - Indic digit normalization (Devanagari ०-९, Gurmukhi ੦-੯ -> ASCII 0-9)
  - Multilingual role normalization (Farmer/Buyer across EN, HI, PA)
  - Multilingual crop canonicalization and translations
  - Multilingual API error & response messages
"""
import re

# Devanagari & Gurmukhi numeral translation tables
INDIC_DIGITS_TABLE = str.maketrans({
    # Devanagari numerals ०-९
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    # Gurmukhi numerals ੦-੯
    "੦": "0", "੧": "1", "੨": "2", "੩": "3", "੪": "4",
    "੫": "5", "੬": "6", "੭": "7", "੮": "8", "੯": "9",
})

def normalize_digits(text):
    """Converts Devanagari & Gurmukhi numerals to standard ASCII 0-9."""
    if text is None:
        return ""
    return str(text).translate(INDIC_DIGITS_TABLE)


# Multilingual Role mappings
ROLE_MAP = {
    # English
    "farmer": "Farmer",
    "buyer": "Buyer",
    # Hindi
    "किसान": "Farmer",
    "खरीदार": "Buyer",
    # Punjabi
    "ਕਿਸਾਨ": "Farmer",
    "ਖ਼ਰੀਦਦਾਰ": "Buyer",
    "ਖਰੀਦਦਾਰ": "Buyer",
}

def normalize_role(role_text):
    """Maps Farmer/Buyer in English, Hindi, or Punjabi to canonical 'Farmer' | 'Buyer'."""
    if not role_text:
        return None
    cleaned = str(role_text).strip().lower()
    return ROLE_MAP.get(cleaned) or ROLE_MAP.get(str(role_text).strip())


def normalize_grade(grade_text):
    """Extracts quality grade A, B, or C from multilingual options."""
    if not grade_text:
        return None
    g = str(grade_text).strip().upper()
    if g.startswith("A"):
        return "A"
    if g.startswith("B"):
        return "B"
    if g.startswith("C"):
        return "C"
    return None


# Canonical crop dictionary with all 3 languages
CROP_CATALOG = [
    {"en": "Wheat", "hi": "गेहूं", "pa": "ਕਣਕ", "aliases": ["wheat", "gehu", "gehun", "kanak"]},
    {"en": "Rice", "hi": "चावल / धान", "pa": "ਚੌਲ / ਝੋਨਾ", "aliases": ["rice", "paddy", "chawal", "dhan", "jhona", "chaul"]},
    {"en": "Onion", "hi": "प्याज", "pa": "ਪਿਆਜ਼", "aliases": ["onion", "pyaz", "pyaaz", "piyaz", "ganda"]},
    {"en": "Tomato", "hi": "टमाटर", "pa": "ਟਮਾਟਰ", "aliases": ["tomato", "tamatar"]},
    {"en": "Potato", "hi": "आलू", "pa": "ਆਲੂ", "aliases": ["potato", "aaloo", "aalu"]},
    {"en": "Cabbage", "hi": "पत्ता गोभी", "pa": "ਬੰਦ ਗੋਭੀ", "aliases": ["cabbage", "patta gobhi", "band gobhi"]},
    {"en": "Bengal Gram", "hi": "चना", "pa": "ਛੋਲੇ", "aliases": ["bengal gram", "gram", "chana", "chole", "bengal gram(gram)(whole)"]},
    {"en": "Indian Beans", "hi": "सेम फली", "pa": "ਸੇਮ ਫ਼ਲੀਆਂ", "aliases": ["indian beans", "sem", "seam", "sem fali", "indian beans(seam)"]},
    {"en": "Banana - Green", "hi": "कच्चा केला", "pa": "ਹਰਾ ਕੇਲਾ", "aliases": ["banana - green", "green banana", "kacha kela", "hara kela"]},
    {"en": "Banana", "hi": "केला", "pa": "ਕੇਲਾ", "aliases": ["banana", "kela"]},
    {"en": "Orange", "hi": "संतरा", "pa": "ਸੰਤਰਾ", "aliases": ["orange", "santra"]},
    {"en": "Snakeguard", "hi": "चिचिंडा", "pa": "ਚਚਿੰਡਾ", "aliases": ["snakeguard", "snake gourd", "chichinda"]},
    {"en": "Ginger", "hi": "अदरक", "pa": "ਅਦਰਕ", "aliases": ["ginger", "green ginger", "ginger(green)", "adrak"]},
    {"en": "Cucumbar", "hi": "खीरा", "pa": "ਖੀਰਾ", "aliases": ["cucumbar", "cucumber", "cucumbar(kheera)", "kheera"]},
    {"en": "Cowpea", "hi": "लोबिया", "pa": "ਲੋਬੀਆ", "aliases": ["cowpea", "cowpea(veg)", "lobia", "chawle", "raungi"]},
    {"en": "Mustard", "hi": "सरसों", "pa": "ਸਰ੍ਹੋਂ", "aliases": ["mustard", "sarson", "sarhon"]},
    {"en": "Cotton", "hi": "कपास", "pa": "ਕਪਾਹ", "aliases": ["cotton", "kapas", "kapah"]},
    {"en": "Maize", "hi": "मक्का", "pa": "ਮੱਕੀ", "aliases": ["maize", "corn", "makka", "makki"]},
    {"en": "Mango", "hi": "आम", "pa": "ਅੰਬ", "aliases": ["mango", "aam", "amb"]},
    {"en": "Apple", "hi": "सेब", "pa": "ਸੇਬ", "aliases": ["apple", "seb"]},
    {"en": "Garlic", "hi": "लहसुन", "pa": "ਲਸਣ", "aliases": ["garlic", "lahsun", "lasun", "lasan"]},
    {"en": "Chilli", "hi": "हरी मिर्च", "pa": "ਹਰੀ ਮਿਰਚ", "aliases": ["chilli", "green chilli", "mirch", "hari mirch"]},
    {"en": "Cauliflower", "hi": "फूलगोभी", "pa": "ਫੁੱਲ ਗੋਭੀ", "aliases": ["cauliflower", "phool gobhi", "phul gobhi"]},
    {"en": "Brinjal", "hi": "बैंगन", "pa": "ਬੈਂਗਣ", "aliases": ["brinjal", "eggplant", "baingan", "baigan"]},
    {"en": "Ladyfinger", "hi": "भिंडी", "pa": "ਭਿੰਡੀ", "aliases": ["ladyfinger", "okra", "bhindi"]},
    {"en": "Green Peas", "hi": "मटर", "pa": "ਮਟਰ", "aliases": ["peas", "green peas", "matar"]},
    {"en": "Carrot", "hi": "गाजर", "pa": "ਗਾਜਰ", "aliases": ["carrot", "gajar"]},
    {"en": "Spinach", "hi": "पालक", "pa": "ਪਾਲਕ", "aliases": ["spinach", "palak"]},
    {"en": "Moong", "hi": "मूंग", "pa": "ਮੂੰਗ", "aliases": ["moong", "green gram", "mung"]},
    {"en": "Urad", "hi": "उड़द", "pa": "ਮਾਂਹ (ਉੜਦ)", "aliases": ["urad", "black gram", "maash", "mah"]},
    {"en": "Soyabean", "hi": "सोयाबीन", "pa": "ਸੋਇਆਬੀਨ", "aliases": ["soyabean", "soybean"]},
    {"en": "Groundnut", "hi": "मूंगफली", "pa": "ਮੂੰਗਫਲੀ", "aliases": ["groundnut", "peanut", "moongfali"]},
    {"en": "Sugarcane", "hi": "गन्ना", "pa": "ਗੰਨਾ", "aliases": ["sugarcane", "ganna"]},
]

# Quick lookup index
CROP_INDEX = {}
for entry in CROP_CATALOG:
    # index english, hindi, punjabi representations and aliases
    for key_term in [entry["en"], entry["hi"], entry["pa"]] + entry.get("aliases", []):
        k = key_term.lower().replace("_", " ").strip()
        CROP_INDEX[k] = entry


def resolve_crop(crop_input):
    """
    Given any crop name entered in English, Hindi, or Punjabi,
    resolves and returns canonical info:
    {
       'canonical': 'Wheat',
       'en': 'Wheat',
       'hi': 'गेहूं',
       'pa': 'ਕਣਕ'
    }
    If unknown, returns fallback with input as canonical.
    """
    if not crop_input:
        return None
    raw = str(crop_input).strip()
    k = raw.lower().replace("_", " ")
    # remove parenthesized parts for matching
    cleaned = re.sub(r"\(.*?\)", "", k).strip()

    entry = CROP_INDEX.get(cleaned) or CROP_INDEX.get(k)
    if not entry:
        # Check partial/substring matches
        for cand_key, cand_entry in CROP_INDEX.items():
            if cand_key in cleaned or cleaned in cand_key:
                entry = cand_entry
                break

    if entry:
        return {
            "canonical": entry["en"],
            "en": entry["en"],
            "hi": entry["hi"],
            "pa": entry["pa"],
            "original": raw
        }
    
    return {
        "canonical": raw,
        "en": raw,
        "hi": raw,
        "pa": raw,
        "original": raw
    }


# Multilingual backend response and error messages
MESSAGES = {
    "enter_name": {
        "en": "Enter your name.",
        "hi": "अपना नाम दर्ज करें।",
        "pa": "ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ।"
    },
    "valid_phone": {
        "en": "Enter a valid phone number with 10 digits.",
        "hi": "10 अंकों का मान्य फ़ोन नंबर दर्ज करें।",
        "pa": "10 ਅੰਕਾਂ ਦਾ ਸਹੀ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ।"
    },
    "password_min": {
        "en": "Use a password with at least 6 characters.",
        "hi": "कम से कम 6 अक्षरों का पासवर्ड उपयोग करें।",
        "pa": "ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਪਾਸਵਰਡ ਵਰਤੋ।"
    },
    "choose_role": {
        "en": "Choose whether you are a farmer or a buyer.",
        "hi": "चुनें कि आप किसान हैं या खरीदार।",
        "pa": "ਚੁਣੋ ਕਿ ਤੁਸੀਂ ਕਿਸਾਨ ਹੋ ਜਾਂ ਖ਼ਰੀਦਦਾਰ।"
    },
    "phone_exists": {
        "en": "This phone number is already registered. Log in instead.",
        "hi": "यह फ़ोन नंबर पहले से पंजीकृत है। इसके बजाय लॉग इन करें।",
        "pa": "ਇਹ ਫ਼ੋਨ ਨੰਬਰ ਪਹਿਲਾਂ ਹੀ ਰਜਿਸਟਰਡ ਹੈ। ਲਾਗ ਇਨ ਕਰੋ।"
    },
    "login_wrong": {
        "en": "Phone number or password is wrong. Check both and try again.",
        "hi": "फ़ोन नंबर या पासवर्ड गलत है। दोनों की जाँच करें और पुनः प्रयास करें।",
        "pa": "ਫ਼ੋਨ ਨੰਬਰ ਜਾਂ ਪਾਸਵਰਡ ਗ਼ਲਤ ਹੈ। ਦੋਵੇਂ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
    },
    "session_expired": {
        "en": "Your session has expired. Log in again.",
        "hi": "आपका सत्र समाप्त हो गया है। पुनः लॉग इन करें।",
        "pa": "ਤੁਹਾਡਾ ਸੈਸ਼ਨ ਖ਼ਤਮ ਹੋ ਗਿਆ ਹੈ। ਦੁਬਾਰਾ ਲਾਗ ਇਨ ਕਰੋ।"
    },
    "account_not_found": {
        "en": "Account not found. Log in again.",
        "hi": "खाता नहीं मिला। पुनः लॉग इन करें।",
        "pa": "ਖਾਤਾ ਨਹੀਂ ਮਿਲਿਆ। ਦੁਬਾਰਾ ਲਾਗ ਇਨ ਕਰੋ।"
    },
    "role_forbidden": {
        "en": "Only {role}s can do this.",
        "hi": "केवल {role} ही यह कार्य कर सकते हैं।",
        "pa": "ਸਿਰਫ਼ {role} ਹੀ ਇਹ ਕਰ ਸਕਦੇ ਹਨ।"
    },
    "fill_fields": {
        "en": "Fill in crop, quantity and location.",
        "hi": "फसल, मात्रा और स्थान भरें।",
        "pa": "ਫ਼ਸਲ, ਮਾਤਰਾ ਅਤੇ ਸਥਾਨ ਭਰੋ।"
    },
    "choose_grade": {
        "en": "Choose a quality grade: A, B or C.",
        "hi": "गुणवत्ता ग्रेड चुनें: A, B या C।",
        "pa": "ਗੁਣਵੱਤਾ ਗਰੇਡ ਚੁਣੋ: A, B ਜਾਂ C।"
    },
    "price_min": {
        "en": "Enter a price above ₹0 per kg.",
        "hi": "₹0 प्रति किग्रा से अधिक कीमत दर्ज करें।",
        "pa": "₹0 ਪ੍ਰਤੀ ਕਿਲੋ ਤੋਂ ਵੱਧ ਕੀਮਤ ਦਰਜ ਕਰੋ।"
    },
    "listing_not_found": {
        "en": "Listing not found, or it belongs to someone else.",
        "hi": "लिस्टिंग नहीं मिली, या यह किसी अन्य की है।",
        "pa": "ਲਿਸਟਿੰਗ ਨਹੀਂ ਮਿਲੀ, ਜਾਂ ਇਹ ਕਿਸੇ ਹੋਰ ਦੀ ਹੈ।"
    },
    "no_files_uploaded": {
        "en": "No files uploaded. Provide one or more files in 'files' or 'file'.",
        "hi": "कोई फ़ाइल अपलोड नहीं की गई। कृपया 'files' में एक या अधिक फ़ाइलें दें।",
        "pa": "ਕੋਈ ਫ਼ਾਈਲ ਅੱਪਲੋਡ ਨਹੀਂ ਕੀਤੀ ਗਈ। ਕਿਰਪਾ ਕਰਕੇ 'files' ਵਿੱਚ ਫ਼ਾਈਲਾਂ ਦਿਓ।"
    },
    "process_success": {
        "en": "Successfully processed and updated {count} price records.",
        "hi": "सफलतापूर्वक {count} मूल्य रिकॉर्ड संसाधित और अद्यतन किए गए।",
        "pa": "ਸਫ਼ਲਤਾਪੂਰਵਕ {count} ਭਾਅ ਰਿਕਾਰਡ ਪ੍ਰੋਸੈਸ ਕੀਤੇ ਗਏ।"
    },
    "cannot_chat_self": {
        "en": "You cannot start a conversation with yourself.",
        "hi": "आप स्वयं से बातचीत शुरू नहीं कर सकते।",
        "pa": "ਤੁਸੀਂ ਆਪਣੇ ਆਪ ਨਾਲ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਨਹੀਂ ਕਰ ਸਕਦੇ।"
    },
    "conversation_not_found": {
        "en": "Conversation not found.",
        "hi": "बातचीत नहीं मिली।",
        "pa": "ਗੱਲਬਾਤ ਨਹੀਂ ਮਿਲੀ।"
    },
    "message_empty": {
        "en": "Enter a message or price offer.",
        "hi": "एक संदेश या मूल्य प्रस्ताव दर्ज करें।",
        "pa": "ਸੁਨੇਹਾ ਜਾਂ ਕੀਮਤ ਪੇਸ਼ਕਸ਼ ਦਰਜ ਕਰੋ।"
    },
    "offer_invalid": {
        "en": "Invalid offer action.",
        "hi": "अमान्य प्रस्ताव कार्रवाई।",
        "pa": "ਅਵੈਧ ਪੇਸ਼ਕਸ਼ ਕਾਰਵਾਈ।"
    },
    "role_chat_forbidden": {
        "en": "Chat is only available between farmers and buyers.",
        "hi": "बातचीत केवल किसानों और खरीदारों के बीच उपलब्ध है।",
        "pa": "ਗੱਲਬਾਤ ਸਿਰਫ਼ ਕਿਸਾਨਾਂ ਅਤੇ ਖ਼ਰੀਦਦਾਰਾਂ ਵਿਚਕਾਰ ਉਪਲਬਧ ਹੈ।"
    }
}


def get_request_lang(request):
    """Extracts preferred language (en, hi, pa) from Flask request."""
    # 1. Header X-Language
    l = request.headers.get("X-Language")
    if l in ("en", "hi", "pa"):
        return l
    
    # 2. Query param ?lang=hi
    l = request.args.get("lang")
    if l in ("en", "hi", "pa"):
        return l
    
    # 3. Accept-Language header
    al = request.headers.get("Accept-Language", "").lower()
    if "pa" in al:
        return "pa"
    if "hi" in al:
        return "hi"
    
    return "en"


def msg(key, lang="en", **kwargs):
    """Returns localized message string."""
    item = MESSAGES.get(key, {})
    text = item.get(lang) or item.get("en") or key
    for k, v in kwargs.items():
        text = text.replace(f"{{{k}}}", str(v))
    return text


# -------------------------------------------------------------
# Multilingual Unit Normalization
# -------------------------------------------------------------
UNIT_CATALOG = [
    {
        "en": "Quintal",
        "en_plural": "Quintal",
        "hi": "क्विंटल",
        "pa": "ਕੁਇੰਟਲ",
        "aliases": ["quintal", "quintals", "qtl", "qtls", "क्विंटल", "कुंतल", "ਕੁਇੰਟਲ", "ਕੁਇੰਟਲ਼"],
    },
    {
        "en": "kg",
        "en_plural": "kg",
        "hi": "किग्रा",
        "pa": "ਕਿਲੋ",
        "aliases": ["kg", "kgs", "kilo", "kilos", "kilogram", "kilograms", "किग्रा", "कि.ग्रा.", "किलो", "ਕਿਲੋ", "ਕਿਗ੍ਰਾ", "ਕਿਲੋਗ੍ਰਾਮ"],
    },
    {
        "en": "Bags",
        "en_singular": "Bag",
        "hi": "बोरी",
        "pa": "ਬੋਰੀਆਂ",
        "aliases": ["bag", "bags", "बोरी", "बोरीयां", "बोरीयाँ", "बोरीयों", "बोरे", "ਬੋਰੀ", "ਬੋਰੀਆਂ", "ਬੋਰੇ"],
    },
    {
        "en": "Crates",
        "en_singular": "Crate",
        "hi": "क्रेट",
        "pa": "ਕ੍ਰੇਟ",
        "aliases": ["crate", "crates", "क्रेट", "क्रे़ट", "क्रेट्स", "ਕ੍ਰੇਟ", "ਕਰੇਟ"],
    },
    {
        "en": "Tons",
        "en_singular": "Ton",
        "hi": "टन",
        "pa": "ਟਨ",
        "aliases": ["ton", "tons", "tonne", "tonnes", "टन", "ਟਨ"],
    },
    {
        "en": "Trolley",
        "en_singular": "Trolley",
        "hi": "ट्रॉली",
        "pa": "ਟਰਾਲੀ",
        "aliases": ["trolley", "trollies", "ट्रॉली", "ट्राली", "ਟਰਾਲੀ"],
    },
    {
        "en": "Maund",
        "en_singular": "Maund",
        "hi": "मन",
        "pa": "ਮਣ",
        "aliases": ["maund", "maunds", "mon", "mann", "मन", "ਮਣ"],
    },
]

def normalize_quantity(quantity_str, lang="en"):
    if not quantity_str:
        return ""
    raw = normalize_digits(str(quantity_str)).strip()
    m = re.match(r"^([\d.,]+)\s*(.*)$", raw)
    if m:
        num = m.group(1)
        unit_part = m.group(2).strip().lower()
        if not unit_part:
            return num
        for entry in UNIT_CATALOG:
            if any(unit_part == alias or unit_part.startswith(alias) or alias.startswith(unit_part) for alias in entry["aliases"]):
                if lang == "en":
                    try:
                        is_single = float(num) == 1.0
                    except ValueError:
                        is_single = False
                    unit = entry.get("en_singular") if is_single else entry["en"]
                    return f"{num} {unit or entry['en']}"
                return f"{num} {entry.get(lang, entry['en'])}"
        return f"{num} {m.group(2).strip()}"
    return raw


# -------------------------------------------------------------
# Multilingual Location Normalization
# -------------------------------------------------------------
LOCATION_CATALOG = [
    {"en": "Jalandhar", "hi": "जालंधर", "pa": "ਜਲੰਧਰ", "aliases": ["jalandhar", "जालंधर", "ਜਲੰਧਰ"]},
    {"en": "Ludhiana", "hi": "लुधियाना", "pa": "ਲੁਧਿਆਣਾ", "aliases": ["ludhiana", "लुधियाना", "ਲੁਧਿਆਣਾ"]},
    {"en": "Amritsar", "hi": "अमृतसर", "pa": "ਅੰਮ੍ਰਿਤਸਰ", "aliases": ["amritsar", "अमृतसर", "ਅੰਮ੍ਰਿਤਸਰ"]},
    {"en": "Patiala", "hi": "पटियाला", "pa": "ਪਟਿਆਲਾ", "aliases": ["patiala", "पटियाला", "ਪਟਿਆਲਾ"]},
    {"en": "Bathinda", "hi": "बठिंडा", "pa": "ਬਠਿੰਡਾ", "aliases": ["bathinda", "बठिंडा", "ਬਠਿੰਡਾ", "ਭਟਿੰਡਾ"]},
    {"en": "Khanna", "hi": "खन्ना", "pa": "ਖੰਨਾ", "aliases": ["khanna", "ਖੰਨਾ", "खन्ना"]},
    {"en": "Moga", "hi": "मोगा", "pa": "ਮੋਗਾ", "aliases": ["moga", "मोगा", "ਮੋਗਾ"]},
    {"en": "Hoshiarpur", "hi": "होशियारपुर", "pa": "ਹੁਸ਼ਿਆਰਪੁਰ", "aliases": ["hoshiarpur", "होशियारपुर", "ਹੁਸ਼ਿਆਰਪੁਰ"]},
    {"en": "Mohali", "hi": "मोहाली", "pa": "ਮੋਹਾਲੀ", "aliases": ["mohali", "मोहाली", "ਮੋਹਾਲੀ", "sas nagar"]},
    {"en": "Firozpur", "hi": "फ़िरोज़पुर", "pa": "ਫ਼ਿਰੋਜ਼ਪੁਰ", "aliases": ["firozpur", "ferozepur", "फ़िरोज़पुर", "ਫ਼ਿਰੋਜ਼ਪੁਰ"]},
    {"en": "Sangrur", "hi": "संगरूर", "pa": "ਸੰਗਰੂਰ", "aliases": ["sangrur", "संगरूर", "ਸੰਗਰੂਰ"]},
    {"en": "Gurdaspur", "hi": "गुरदासपुर", "pa": "ਗੁਰਦਾਸਪੁਰ", "aliases": ["gurdaspur", "गुरदासपुर", "ਗੁਰਦਾਸਪੁਰ"]},
    {"en": "Kapurthala", "hi": "कपूरथला", "pa": "ਕਪੂਰਥਲਾ", "aliases": ["kapurthala", "कपूरथला", "ਕਪੂਰਥਲਾ"]},
    {"en": "Pathankot", "hi": "पठानकोट", "pa": "ਪਠਾਨਕੋਟ", "aliases": ["pathankot", "पठानकोट", "ਪਠਾਨਕੋਟ"]},
    {"en": "Muktsar", "hi": "मुक्तसर", "pa": "ਮੁਕਤਸਰ", "aliases": ["muktsar", "मुक्तसर", "ਮੁਕਤਸਰ"]},
    {"en": "Faridkot", "hi": "फरीदकोट", "pa": "ਫ਼ਰੀਦਕੋਟ", "aliases": ["faridkot", "फरीदकोट", "ਫ਼ਰੀਦਕੋਟ"]},
    {"en": "Barnala", "hi": "बरनाला", "pa": "ਬਰਨਾਲਾ", "aliases": ["barnala", "बरनाला", "ਬਰਨਾਲਾ"]},
    {"en": "Rupnagar", "hi": "रूपनगर", "pa": "ਰੂਪਨਗਰ", "aliases": ["rupnagar", "ropar", "रूपनगर", "ਰੂਪਨਗਰ"]},
    {"en": "Fazilka", "hi": "फ़ाज़िल्का", "pa": "ਫ਼ਾਜ਼ਿਲਕਾ", "aliases": ["fazilka", "फ़ाज़िल्का", "ਫ਼ਾਜ਼ਿਲਕਾ"]},
    {"en": "Tarn Taran", "hi": "तरनतारन", "pa": "ਤਰਨ ਤਾਰਨ", "aliases": ["tarn taran", "tarntaran", "तरनतारन", "ਤਰਨ ਤਾਰਨ"]},
    {"en": "Mansa", "hi": "मानसा", "pa": "ਮਾਨਸਾ", "aliases": ["mansa", "मानसा", "ਮਾਨਸਾ"]},
    {"en": "Karnal", "hi": "करनाल", "pa": "ਕਰਨਾਲ", "aliases": ["karnal", "करनाल", "ਕਰਨਾਲ"]},
    {"en": "Ambala", "hi": "अंबाला", "pa": "ਅੰਬਾਲਾ", "aliases": ["ambala", "अंबाला", "ਅੰਬਾਲਾ"]},
    {"en": "Hisar", "hi": "हिसार", "pa": "ਹਿਸਾਰ", "aliases": ["hisar", "हिसार", "ਹਿਸਾਰ"]},
    {"en": "Panipat", "hi": "पानीपत", "pa": "ਪਾਨੀਪਤ", "aliases": ["panipat", "पानीपत", "ਪਾਨੀਪਤ"]},
    {"en": "Sonipat", "hi": "सोनीपत", "pa": "ਸੋਨੀਪਤ", "aliases": ["sonipat", "सोनीपत", "ਸੋਨੀਪਤ"]},
    {"en": "Rohtak", "hi": "रोहतक", "pa": "ਰੋਹਤਕ", "aliases": ["rohtak", "रोहतक", "ਰੋਹਤਕ"]},
    {"en": "Kurukshetra", "hi": "कुरुक्षेत्र", "pa": "ਕੁਰੂਕਸ਼ੇਤਰ", "aliases": ["kurukshetra", "कुरुक्षेत्र", "ਕੁਰੂਕਸ਼ੇਤਰ"]},
    {"en": "Sirsa", "hi": "सिरसा", "pa": "ਸਿਰਸਾ", "aliases": ["sirsa", "सिरसा", "ਸਿਰਸਾ"]},
    {"en": "Gurugram", "hi": "गुरुग्राम", "pa": "ਗੁਰੂਗ੍ਰਾਮ", "aliases": ["gurugram", "gurgaon", "गुरुग्राम", "ਗੁਰੂਗ੍ਰਾਮ"]},
    {"en": "Faridabad", "hi": "फरीदाबाद", "pa": "ਫ਼ਰੀਦਾਬਾਦ", "aliases": ["faridabad", "फरीदाबाद", "ਫ਼ਰੀਦਾਬਾਦ"]},
    {"en": "Yamunanagar", "hi": "यमुनानगर", "pa": "ਯਮੁਨਾਨਗਰ", "aliases": ["yamunanagar", "यमुनानगर", "ਯਮੁਨਾਨਗਰ"]},
    {"en": "Nashik", "hi": "नासिक", "pa": "ਨਾਸਿਕ", "aliases": ["nashik", "nasik", "नासिक", "ਨਾਸਿਕ"]},
    {"en": "Pune", "hi": "पुणे", "pa": "ਪੁਣੇ", "aliases": ["pune", "पुणे", "ਪੁਣੇ"]},
    {"en": "Nagpur", "hi": "नागपुर", "pa": "ਨਾਗਪੁਰ", "aliases": ["nagpur", "नागपुर", "ਨਾਗਪੁਰ"]},
    {"en": "Mumbai", "hi": "मुंबई", "pa": "ਮੁੰਬਈ", "aliases": ["mumbai", "bombay", "मुंबई", "ਮੁੰਬਈ"]},
    {"en": "Solapur", "hi": "सोलापुर", "pa": "ਸੋਲਾਪੁਰ", "aliases": ["solapur", "सोलापुर", "ਸੋਲਾਪੁਰ"]},
    {"en": "Kolhapur", "hi": "कोल्हापुर", "pa": "ਕੋਲ੍ਹਾਪੁਰ", "aliases": ["kolhapur", "कोल्हापुर", "ਕੋਲ੍ਹਾਪੁਰ"]},
    {"en": "Ahmednagar", "hi": "अहमदनगर", "pa": "ਅਹਿਮਦਨਗਰ", "aliases": ["ahmednagar", "ahmadnagar", "अहमदनगर", "ਅਹਿਮਦਨਗਰ"]},
    {"en": "Aurangabad", "hi": "औरंगाबाद", "pa": "ਔਰੰਗਾਬਾਦ", "aliases": ["aurangabad", "chhatrapati sambhajinagar", "औरंगाबाद", "ਔਰੰਗਾਬਾਦ"]},
    {"en": "Jalgaon", "hi": "जलगांव", "pa": "ਜਲਗਾਂਵ", "aliases": ["jalgaon", "जलगांव", "ਜਲਗਾਂਵ"]},
    {"en": "Indore", "hi": "इंदौर", "pa": "ਇੰਦੌਰ", "aliases": ["indore", "इंदौर", "इन्दौर", "ਇੰਦੌਰ"]},
    {"en": "Bhopal", "hi": "भोपाल", "pa": "ਭੋਪਾਲ", "aliases": ["bhopal", "भोपाल", "ਭੋਪਾਲ"]},
    {"en": "Ujjain", "hi": "उज्जैन", "pa": "ਉਜੈਨ", "aliases": ["ujjain", "उज्जैन", "ਉਜੈਨ"]},
    {"en": "Gwalior", "hi": "ग्वालियर", "pa": "ਗਵਾਲੀਅਰ", "aliases": ["gwalior", "ग्वालियर", "ਗਵਾਲੀਅਰ"]},
    {"en": "Jabalpur", "hi": "जबलपुर", "pa": "ਜਬਲਪੁਰ", "aliases": ["jabalpur", "जबलपुर", "ਜਬਲਪੁਰ"]},
    {"en": "Bhubaneswar", "hi": "भुवनेश्वर", "pa": "ਭੁਵਨੇਸ਼ਵਰ", "aliases": ["bhubaneswar", "bhubneswar", "भुवनेश्वर", "ਭੁਵਨੇਸ਼ਵਰ"]},
    {"en": "Baripada", "hi": "बारीपदा", "pa": "ਬਾਰੀਪਦਾ", "aliases": ["baripada", "बारीपदा", "ਬਾਰੀਪਦਾ"]},
    {"en": "Cuttack", "hi": "कटक", "pa": "ਕਟਕ", "aliases": ["cuttack", "कटक", "ਕਟਕ"]},
    {"en": "Jaipur", "hi": "जयपुर", "pa": "ਜੈਪੁਰ", "aliases": ["jaipur", "जयपुर", "ਜੈਪੁਰ"]},
    {"en": "Jodhpur", "hi": "जोधपुर", "pa": "ਜੋਧਪੁਰ", "aliases": ["jodhpur", "जोधपुर", "ਜੋਧਪੁਰ"]},
    {"en": "Kota", "hi": "कोटा", "pa": "ਕੋਟਾ", "aliases": ["kota", "कोटा", "ਕੋਟਾ"]},
    {"en": "Bikaner", "hi": "बीकानेर", "pa": "ਬੀਕਾਨੇਰ", "aliases": ["bikaner", "बीकानेर", "ਬੀਕਾਨੇਰ"]},
    {"en": "Lucknow", "hi": "लखनऊ", "pa": "ਲਖਨਊ", "aliases": ["lucknow", "लखनऊ", "ਲਖਨਊ"]},
    {"en": "Kanpur", "hi": "कानपुर", "pa": "ਕਾਨਪੁਰ", "aliases": ["kanpur", "कानपुर", "ਕਾਨਪੁਰ"]},
    {"en": "Varanasi", "hi": "वाराणसी", "pa": "ਵਾਰਾਣਸੀ", "aliases": ["varanasi", "banaras", "वाराणसी", "ਵਾਰਾਣਸੀ"]},
    {"en": "Agra", "hi": "आगरा", "pa": "ਆਗਰਾ", "aliases": ["agra", "आगरा", "ਆਗਰਾ"]},
    {"en": "Kheragarh", "hi": "खेरागढ़", "pa": "ਖੇਰਾਗੜ੍ਹ", "aliases": ["kheragarh", "खेरागढ़", "ਖੇਰਾਗੜ੍ਹ"]},
    {"en": "Delhi", "hi": "दिल्ली", "pa": "ਦਿੱਲੀ", "aliases": ["delhi", "new delhi", "दिल्ली", "नई दिल्ली", "ਦਿੱਲੀ", "ਨਵੀਂ ਦਿੱਲੀ"]},
    {"en": "Chandigarh", "hi": "चंडीगढ़", "pa": "ਚੰਡੀਗੜ੍ਹ", "aliases": ["chandigarh", "चंडीगढ़", "ਚੰਡੀਗੜ੍ਹ"]},
    {"en": "Punjab", "hi": "पंजाब", "pa": "ਪੰਜਾਬ", "aliases": ["punjab", "पंजाब", "ਪੰਜਾਬ"]},
    {"en": "Haryana", "hi": "हरियाणा", "pa": "ਹਰਿਆਣਾ", "aliases": ["haryana", "हरियाणा", "ਹਰਿਆਣਾ"]},
    {"en": "Madhya Pradesh", "hi": "मध्य प्रदेश", "pa": "ਮੱਧ ਪ੍ਰਦੇਸ਼", "aliases": ["madhya pradesh", "mp", "मध्य प्रदेश", "ਮੱਧ ਪ੍ਰਦੇਸ਼"]},
    {"en": "Maharashtra", "hi": "महाराष्ट्र", "pa": "ਮਹਾਰਾਸ਼ਟਰ", "aliases": ["maharashtra", "महाराष्ट्र", "ਮਹਾਰਾਸ਼ਟਰ"]},
    {"en": "Rajasthan", "hi": "राजस्थान", "pa": "ਰਾਜਸਥਾਨ", "aliases": ["rajasthan", "राजस्थान", "ਰਾਜਸਥਾਨ"]},
    {"en": "Uttar Pradesh", "hi": "उत्तर प्रदेश", "pa": "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", "aliases": ["uttar pradesh", "up", "उत्तर प्रदेश", "ਉੱਤਰ ਪ੍ਰਦੇਸ਼"]},
    {"en": "Odisha", "hi": "ओडिशा", "pa": "ਓਡੀਸ਼ਾ", "aliases": ["odisha", "orissa", "ओडिशा", "ਉੜੀਸਾ", "ਓਡੀਸ਼ਾ"]},
    {"en": "Gujarat", "hi": "गुजरात", "pa": "ਗੁਜਰਾਤ", "aliases": ["gujarat", "गुजरात", "ਗੁਜਰਾਤ"]},
    {"en": "Bihar", "hi": "बिहार", "pa": "ਬਿਹਾਰ", "aliases": ["bihar", "बिहार", "ਬਿਹਾਰ"]},
    {"en": "West Bengal", "hi": "पश्चिम बंगाल", "pa": "ਪੱਛਮੀ ਬੰਗਾਲ", "aliases": ["west bengal", "पश्चिम बंगाल", "ਪੱਛਮੀ ਬੰਗਾਲ"]},
    {"en": "Himachal Pradesh", "hi": "हिमाचल प्रदेश", "pa": "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼", "aliases": ["himachal pradesh", "himachal", "हिमाचल प्रदेश", "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼"]},
    {"en": "Karnataka", "hi": "कर्नाटक", "pa": "ਕਰਨਾਟਕ", "aliases": ["karnataka", "कर्नाटक", "ਕਰਨਾਟਕ"]},
    {"en": "Tamil Nadu", "hi": "तमिलनाडु", "pa": "ਤਮਿਲਨਾਡੂ", "aliases": ["tamil nadu", "तमिलनाडु", "ਤਮਿਲਨਾਡੂ"]},
    {"en": "Andhra Pradesh", "hi": "आंध्र प्रदेश", "pa": "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", "aliases": ["andhra pradesh", "आंध्र प्रदेश", "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼"]},
    {"en": "Telangana", "hi": "तेलंगाना", "pa": "ਤੇਲੰਗਾਨਾ", "aliases": ["telangana", "तेलंगाना", "ਤੇਲੰਗਾਨਾ"]},
    {"en": "Kerala", "hi": "केरल", "pa": "ਕੇਰਲ", "aliases": ["kerala", "keralam", "केरल", "ਕੇਰਲ"]},
    {"en": "Uttarakhand", "hi": "उत्तराखंड", "pa": "ਉੱਤਰਾਖੰਡ", "aliases": ["uttarakhand", "उत्तराखंड", "ਉੱਤਰਾਖੰਡ"]},
    {"en": "Assam", "hi": "असम", "pa": "ਅਸਾਮ", "aliases": ["assam", "असम", "ਅਸਾਮ"]},
    {"en": "Jharkhand", "hi": "झारखंड", "pa": "ਝਾਰਖੰਡ", "aliases": ["jharkhand", "झारखंड", "ਝਾਰਖੰਡ"]},
    {"en": "Chhattisgarh", "hi": "छत्तीसगढ़", "pa": "ਛੱਤੀਸਗੜ੍ਹ", "aliases": ["chhattisgarh", "chattisgarh", "छत्तीसगढ़", "ਛੱਤੀਸਗੜ੍ਹ"]},
]

LOCATION_INDEX = {}
for entry in LOCATION_CATALOG:
    for alias in entry["aliases"]:
        LOCATION_INDEX[alias.lower().strip()] = entry

def resolve_location(location_str, lang="en"):
    if not location_str:
        return ""
    raw = str(location_str).strip()
    if not raw:
        return ""
    direct = LOCATION_INDEX.get(raw.lower())
    if direct:
        return direct.get(lang, direct["en"])
    
    parts = re.split(r"([,/·\-])", raw)
    out = []
    for p in parts:
        trimmed = p.strip()
        if not trimmed or re.match(r"^[,/·\-]$", trimmed):
            out.append(p)
        else:
            match = LOCATION_INDEX.get(trimmed.lower())
            out.append(match.get(lang, match["en"]) if match else trimmed)
    res = "".join(out)
    return re.sub(r"\s*,\s*", ", ", res).strip()


# -------------------------------------------------------------
# Multilingual Name Translation
# -------------------------------------------------------------
NAME_WORD_MAP = {
    "ਕਿਸਾਨ": {"en": "Farmer", "hi": "किसान", "pa": "ਕਿਸਾਨ"},
    "किसान": {"en": "Farmer", "hi": "किसान", "pa": "ਕਿਸਾਨ"},
    "farmer": {"en": "Farmer", "hi": "किसान", "pa": "ਕਿਸਾਨ"},
    "ਖ਼ਰੀਦਦਾਰ": {"en": "Buyer", "hi": "खरीदार", "pa": "ਖ਼ਰੀਦਦਾਰ"},
    "ਖਰੀਦਦਾਰ": {"en": "Buyer", "hi": "खरीदार", "pa": "ਖ਼ਰੀਦਦਾਰ"},
    "खरीदार": {"en": "Buyer", "hi": "खरीदार", "pa": "ਖ਼ਰੀਦਦਾਰ"},
    "buyer": {"en": "Buyer", "hi": "खरीदार", "pa": "ਖ਼ਰੀਦਦਾਰ"},
    "ਗੁਰਦੀਪ": {"en": "Gurdeep", "hi": "गुरदीप", "pa": "ਗੁਰਦੀਪ"},
    "गुरदीप": {"en": "Gurdeep", "hi": "गुरदीप", "pa": "ਗੁਰਦੀਪ"},
    "gurdeep": {"en": "Gurdeep", "hi": "गुरदीप", "pa": "ਗੁਰਦੀਪ"},
    "ਰਾਮੇਸ਼": {"en": "Ramesh", "hi": "रामेश", "pa": "ਰਾਮੇਸ਼"},
    "रामेश": {"en": "Ramesh", "hi": "रामेश", "pa": "ਰਾਮੇਸ਼"},
    "रमेश": {"en": "Ramesh", "hi": "रमेश", "pa": "ਰਮੇਸ਼"},
    "ramesh": {"en": "Ramesh", "hi": "रमेश", "pa": "ਰਮੇਸ਼"},
    "ਹਰਪ੍ਰੀਤ": {"en": "Harpreet", "hi": "हरप्रीत", "pa": "ਹਰਪ੍ਰੀਤ"},
    "हरप्रीत": {"en": "Harpreet", "hi": "हरप्रीत", "pa": "ਹਰਪ੍ਰੀਤ"},
    "harpreet": {"en": "Harpreet", "hi": "हरप्रीत", "pa": "ਹਰਪ੍ਰੀਤ"},
    "ਸੁਰੇਸ਼": {"en": "Suresh", "hi": "सुरेश", "pa": "ਸੁਰੇਸ਼"},
    "सुरेश": {"en": "Suresh", "hi": "सुरेश", "pa": "ਸੁਰੇਸ਼"},
    "suresh": {"en": "Suresh", "hi": "सुरेश", "pa": "ਸੁਰੇਸ਼"},
    "ਸਿੰਘ": {"en": "Singh", "hi": "सिंह", "pa": "ਸਿੰਘ"},
    "सिंह": {"en": "Singh", "hi": "सिंह", "pa": "ਸਿੰਘ"},
    "singh": {"en": "Singh", "hi": "सिंह", "pa": "ਸਿੰਘ"},
    "ਕੁਮਾਰ": {"en": "Kumar", "hi": "कुमार", "pa": "ਕੁਮਾਰ"},
    "कुमार": {"en": "Kumar", "hi": "कुमार", "pa": "ਕੁਮਾਰ"},
    "kumar": {"en": "Kumar", "hi": "कुमार", "pa": "ਕੁਮਾਰ"},
    "ਪ੍ਰਿਆ": {"en": "Priya", "hi": "प्रिया", "pa": "ਪ੍ਰਿਆ"},
    "प्रिया": {"en": "Priya", "hi": "प्रिया", "pa": "ਪ੍ਰਿਆ"},
    "priya": {"en": "Priya", "hi": "प्रिया", "pa": "ਪ੍ਰਿਆ"},
    "ਕਾਰਤਿਕ": {"en": "Kartik", "hi": "कार्तिक", "pa": "ਕਾਰਤਿਕ"},
    "कार्तिक": {"en": "Kartik", "hi": "कार्तिक", "pa": "ਕਾਰਤਿਕ"},
    "kartik": {"en": "Kartik", "hi": "कार्तिक", "pa": "ਕਾਰਤਿਕ"},
    "ਜੈਨ": {"en": "Jain", "hi": "जैन", "pa": "ਜੈਨ"},
    "जैन": {"en": "Jain", "hi": "जैन", "pa": "ਜੈਨ"},
    "jain": {"en": "Jain", "hi": "जैन", "pa": "ਜੈਨ"},
    "ਜੌਨ": {"en": "John", "hi": "जॉन", "pa": "ਜੌਨ"},
    "जॉन": {"en": "John", "hi": "जॉन", "pa": "ਜੌਨ"},
    "john": {"en": "John", "hi": "जॉन", "pa": "ਜੌਨ"},
}

def resolve_name(name_str, lang="en"):
    if not name_str:
        return ""
    words = str(name_str).strip().split()
    out = []
    for w in words:
        entry = NAME_WORD_MAP.get(w) or NAME_WORD_MAP.get(w.lower())
        out.append(entry.get(lang, entry["en"]) if entry else w)
    return " ".join(out)
