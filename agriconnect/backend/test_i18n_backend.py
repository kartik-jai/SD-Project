"""
Automated End-to-End Multilingual (English, Hindi, Punjabi) Test Suite for AgriConnect Backend.
Tests:
 1. Indic Digit Normalization (ASCII, Devanagari ०-९, Gurmukhi ੦-੯)
 2. User Registration & Auth with multilingual roles & digits
 3. Crop Listings (Lots) posted in English, Hindi, and Punjabi
 4. Buyer Demands posted in English, Hindi, and Punjabi
 5. Cross-language data canonicalization and enrichment (crop_en, crop_hi, crop_pa)
 6. Localized API Error and Response Messages for EN, HI, and PA
 7. Mandi Prices API multilingual commodity translations
"""
import sys
import time
import json
import urllib.request
import urllib.error

# Force UTF-8 output on Windows consoles
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:5000"

def request(path, method="GET", data=None, token=None, lang="en"):
    url = f"{BASE_URL}{path}"
    headers = {
        "Content-Type": "application/json",
        "X-Language": lang,
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            resp_body = resp.read().decode("utf-8")
            return resp.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_body)
        except Exception:
            parsed = {"raw": err_body}
        return e.code, parsed

def print_section(title):
    print("\n" + "=" * 65)
    print(f" {title}")
    print("=" * 65)

def test_multilingual_backend():
    passed = 0
    failed = 0
    ts = int(time.time()) % 100000

    def assert_true(condition, msg):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {msg}")
            passed += 1
        else:
            print(f"  [FAIL] {msg}")
            failed += 1

    # -------------------------------------------------------------
    # 1. TEST MANDI PRICES MULTILINGUAL CATALOG
    # -------------------------------------------------------------
    print_section("1. Mandi Prices Multilingual Commodity Enrichment")
    status, prices = request("/api/prices")
    assert_true(status == 200 and len(prices) > 0, f"Fetched {len(prices)} mandi price items")
    sample = prices[0] if prices else {}
    assert_true("commodity_en" in sample and "commodity_hi" in sample and "commodity_pa" in sample,
                f"Item '{sample.get('commodity')}' enriched with: EN='{sample.get('commodity_en')}', HI='{sample.get('commodity_hi')}', PA='{sample.get('commodity_pa')}'")

    # -------------------------------------------------------------
    # 2. TEST LOCALIZED VALIDATION ERRORS IN ALL 3 LANGUAGES
    # -------------------------------------------------------------
    print_section("2. Localized Error Messages (EN, HI, PA)")
    # Test short password error in EN
    s_en, err_en = request("/api/register", method="POST", data={"name": "A", "phone": "9800000001", "password": "123", "role": "Farmer"}, lang="en")
    assert_true(s_en == 400 and "at least 6 characters" in err_en.get("error", ""),
                f"EN Error: {err_en.get('error')}")

    # Test short password error in HI
    s_hi, err_hi = request("/api/register", method="POST", data={"name": "अ", "phone": "9800000001", "password": "123", "role": "किसान"}, lang="hi")
    assert_true(s_hi == 400 and "कम से कम 6 अक्षरों" in err_hi.get("error", ""),
                f"HI Error: {err_hi.get('error')}")

    # Test short password error in PA
    s_pa, err_pa = request("/api/register", method="POST", data={"name": "ਸ", "phone": "9800000001", "password": "123", "role": "ਕਿਸਾਨ"}, lang="pa")
    assert_true(s_pa == 400 and "ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ" in err_pa.get("error", ""),
                f"PA Error: {err_pa.get('error')}")

    # -------------------------------------------------------------
    # 3. REGISTRATION IN ALL 3 LANGUAGES
    # -------------------------------------------------------------
    print_section("3. User Registration with Multilingual Roles & Numerals")

    # A. English Farmer with standard ASCII digits
    phone_en = f"91000{ts:05d}"
    s1, u_en = request("/api/register", method="POST", data={
        "name": "John Farmer",
        "phone": phone_en,
        "password": "password123",
        "role": "Farmer"
    })
    assert_true(s1 == 201 and u_en.get("user", {}).get("role") == "Farmer",
                f"English Farmer registered (Role: {u_en.get('user', {}).get('role')}, Phone: {phone_en})")
    token_en = u_en.get("token")

    # B. Hindi Farmer with Devanagari Role 'किसान' and Devanagari Phone Numerals '९...'
    # Convert phone digits to Devanagari numerals
    devanagari_digits = str.maketrans("0123456789", "०१२३४५६७८९")
    raw_phone_hi = f"92000{ts:05d}"
    phone_hi_dev = raw_phone_hi.translate(devanagari_digits)
    s2, u_hi = request("/api/register", method="POST", data={
        "name": "रामेश किसान",
        "phone": phone_hi_dev,
        "password": "password123",
        "role": "किसान"   # Hindi for Farmer
    })
    saved_phone_hi = u_hi.get("user", {}).get("phone")
    saved_role_hi = u_hi.get("user", {}).get("role")
    assert_true(s2 == 201 and saved_role_hi == "Farmer" and saved_phone_hi == raw_phone_hi,
                f"Hindi Farmer registered! Sent Role='किसान' -> Normalized to '{saved_role_hi}'. Sent Phone='{phone_hi_dev}' -> Normalized to '{saved_phone_hi}'")
    token_hi = u_hi.get("token")

    # C. Punjabi Buyer with Gurmukhi Role 'ਖ਼ਰੀਦਦਾਰ' and Gurmukhi Phone Numerals '੯...'
    gurmukhi_digits = str.maketrans("0123456789", "੦੧੨੩੪੫੬੭੮੯")
    raw_phone_pa = f"93000{ts:05d}"
    phone_pa_gur = raw_phone_pa.translate(gurmukhi_digits)
    s3, u_pa = request("/api/register", method="POST", data={
        "name": "ਹਰਪ੍ਰੀਤ ਸਿੰਘ",
        "phone": phone_pa_gur,
        "password": "password123",
        "role": "ਖ਼ਰੀਦਦਾਰ"   # Punjabi for Buyer
    })
    saved_phone_pa = u_pa.get("user", {}).get("phone")
    saved_role_pa = u_pa.get("user", {}).get("role")
    assert_true(s3 == 201 and saved_role_pa == "Buyer" and saved_phone_pa == raw_phone_pa,
                f"Punjabi Buyer registered! Sent Role='ਖ਼ਰੀਦਦਾਰ' -> Normalized to '{saved_role_pa}'. Sent Phone='{phone_pa_gur}' -> Normalized to '{saved_phone_pa}'")
    token_pa = u_pa.get("token")

    # D. Test Login with Indic Numerals
    s_log, log_resp = request("/api/login", method="POST", data={
        "phone": phone_hi_dev,  # Devanagari numerals
        "password": "password123"
    })
    assert_true(s_log == 200 and log_resp.get("user", {}).get("id") == u_hi.get("user", {}).get("id"),
                f"Login successful using Devanagari numerals: '{phone_hi_dev}'")

    # -------------------------------------------------------------
    # 4. POSTING CROP LOTS IN ALL 3 LANGUAGES
    # -------------------------------------------------------------
    print_section("4. Posting Crop Lots in English, Hindi, and Punjabi")

    # A. English Post: Wheat
    s_lot_en, r_lot_en = request("/api/lots", method="POST", token=token_en, data={
        "crop": "Wheat",
        "quantity": "500 kg",
        "quality": "A",
        "location": "Karnal, Haryana",
        "price_per_kg": 24.5
    })
    assert_true(s_lot_en == 201 and "id" in r_lot_en, f"English Lot posted (Wheat, ID: {r_lot_en.get('id')})")

    # B. Hindi Post: 'गेहूं' (Wheat) with Devanagari digits for quantity and price!
    s_lot_hi, r_lot_hi = request("/api/lots", method="POST", token=token_hi, data={
        "crop": "गेहूं",                      # Hindi for Wheat
        "quantity": "१००० किग्रा",             # 1000 kg with Devanagari digits
        "quality": "A",
        "location": "इंदौर, मध्य प्रदेश",
        "price_per_kg": "२५.५"               # 25.5 with Devanagari digits
    })
    assert_true(s_lot_hi == 201 and "id" in r_lot_hi, f"Hindi Lot posted ('गेहूं' with Devanagari digits, ID: {r_lot_hi.get('id')})")

    # Also test another Hindi crop: 'टमाटर' (Tomato)
    s_lot_hi2, r_lot_hi2 = request("/api/lots", method="POST", token=token_hi, data={
        "crop": "टमाटर",
        "quantity": "२०० क्रेट",
        "quality": "B",
        "location": "नासिक",
        "price_per_kg": "३०"
    })
    assert_true(s_lot_hi2 == 201, f"Hindi Lot posted ('टमाटर', ID: {r_lot_hi2.get('id')})")

    # C. Punjabi Farmer Posting: Register a Punjabi farmer
    raw_phone_pa_farmer = f"94000{ts:05d}"
    phone_pa_farmer_gur = raw_phone_pa_farmer.translate(gurmukhi_digits)
    _, u_pa_farmer = request("/api/register", method="POST", data={
        "name": "ਗੁਰਦੀਪ ਕਿਸਾਨ",
        "phone": phone_pa_farmer_gur,
        "password": "password123",
        "role": "ਕਿਸਾਨ"   # Punjabi for Farmer
    })
    token_pa_farmer = u_pa_farmer.get("token")

    # Post Punjabi Lot: 'ਕਣਕ' (Wheat) and 'ਆਲੂ' (Potato) with Gurmukhi digits
    s_lot_pa, r_lot_pa = request("/api/lots", method="POST", token=token_pa_farmer, data={
        "crop": "ਕਣਕ",                       # Punjabi for Wheat
        "quantity": "੫੦ ਬੋਰੀਆਂ",              # 50 bags with Gurmukhi digits
        "quality": "A",
        "location": "ਲੁਧਿਆਣਾ, ਪੰਜਾਬ",
        "price_per_kg": "੨੬.੦"               # 26.0 with Gurmukhi digits
    })
    assert_true(s_lot_pa == 201 and "id" in r_lot_pa, f"Punjabi Lot posted ('ਕਣਕ' with Gurmukhi digits, ID: {r_lot_pa.get('id')})")

    s_lot_pa2, r_lot_pa2 = request("/api/lots", method="POST", token=token_pa_farmer, data={
        "crop": "ਆਲੂ",                       # Punjabi for Potato
        "quantity": "੮੦ ਕੁਇੰਟਲ",             # 80 quintal
        "quality": "B",
        "location": "ਜਲੰਧਰ",
        "price_per_kg": "੧੮.੫"
    })
    assert_true(s_lot_pa2 == 201, f"Punjabi Lot posted ('ਆਲੂ', ID: {r_lot_pa2.get('id')})")

    # -------------------------------------------------------------
    # 5. POSTING BUYER DEMAND IN MULTIPLE LANGUAGES
    # -------------------------------------------------------------
    print_section("5. Posting Buyer Demand in Punjabi & Hindi")

    # Punjabi Buyer posting demand for 'ਸਰ੍ਹੋਂ' (Mustard) with Gurmukhi numerals
    s_dem_pa, r_dem_pa = request("/api/demand", method="POST", token=token_pa, data={
        "crop": "ਸਰ੍ਹੋਂ",                      # Punjabi for Mustard
        "quantity": "੧੦੦ ਕੁਇੰਟਲ",
        "quality": "A",
        "location": "ਬਠਿੰਡਾ, ਪੰਜਾਬ",
        "price_per_kg": "੫੫.੦"
    })
    assert_true(s_dem_pa == 201 and "id" in r_dem_pa, f"Punjabi Demand posted ('ਸਰ੍ਹੋਂ' with Gurmukhi digits, ID: {r_dem_pa.get('id')})")

    # Hindi Buyer
    raw_phone_hi_buyer = f"95000{ts:05d}"
    _, u_hi_buyer = request("/api/register", method="POST", data={
        "name": "सुरेश खरीदार",
        "phone": raw_phone_hi_buyer.translate(devanagari_digits),
        "password": "password123",
        "role": "खरीदार"   # Hindi for Buyer
    })
    token_hi_buyer = u_hi_buyer.get("token")

    s_dem_hi, r_dem_hi = request("/api/demand", method="POST", token=token_hi_buyer, data={
        "crop": "चावल / धान",                 # Hindi for Rice / Paddy
        "quantity": "५०० क्विंटल",
        "quality": "A",
        "location": "करनाल, हरियाणा",
        "price_per_kg": "३५"
    })
    assert_true(s_dem_hi == 201, f"Hindi Demand posted ('चावल / धान' with Devanagari digits, ID: {r_dem_hi.get('id')})")

    # -------------------------------------------------------------
    # 6. VERIFY CROSS-LANGUAGE RESOLUTION & ENRICHMENT
    # -------------------------------------------------------------
    print_section("6. Cross-Language Data Canonicalization & Retrieval")

    # Fetch all lots as buyer
    _, all_lots = request("/api/lots/all", token=token_pa)
    
    # Check the Hindi Wheat post
    hi_wheat_lot = next((item for item in all_lots if item["id"] == r_lot_hi["id"]), None)
    assert_true(hi_wheat_lot is not None, "Retrieved Hindi-posted lot")
    if hi_wheat_lot:
        assert_true(hi_wheat_lot["crop"] == "Wheat",
                    f"Hindi 'गेहूं' correctly canonicalized to '{hi_wheat_lot['crop']}'")
        assert_true(hi_wheat_lot["crop_en"] == "Wheat" and hi_wheat_lot["crop_hi"] == "गेहूं" and hi_wheat_lot["crop_pa"] == "ਕਣਕ",
                    f"Multilingual translations present: EN='{hi_wheat_lot['crop_en']}', HI='{hi_wheat_lot['crop_hi']}', PA='{hi_wheat_lot['crop_pa']}'")
        assert_true(hi_wheat_lot["price_per_kg"] == 25.5,
                    f"Devanagari price '२५.५' converted to float: {hi_wheat_lot['price_per_kg']}")
        assert_true(hi_wheat_lot["quantity"] == "1000 किग्रा",
                    f"Devanagari quantity '१००० किग्रा' normalized digits: '{hi_wheat_lot['quantity']}'")

    # Check the Punjabi Wheat post
    pa_wheat_lot = next((item for item in all_lots if item["id"] == r_lot_pa["id"]), None)
    assert_true(pa_wheat_lot is not None, "Retrieved Punjabi-posted lot")
    if pa_wheat_lot:
        assert_true(pa_wheat_lot["crop"] == "Wheat",
                    f"Punjabi 'ਕਣਕ' correctly canonicalized to '{pa_wheat_lot['crop']}'")
        assert_true(pa_wheat_lot["crop_en"] == "Wheat" and pa_wheat_lot["crop_hi"] == "गेहूं" and pa_wheat_lot["crop_pa"] == "ਕਣਕ",
                    f"Multilingual translations present: EN='{pa_wheat_lot['crop_en']}', HI='{pa_wheat_lot['crop_hi']}', PA='{pa_wheat_lot['crop_pa']}'")
        assert_true(pa_wheat_lot["price_per_kg"] == 26.0,
                    f"Gurmukhi price '੨੬.੦' converted to float: {pa_wheat_lot['price_per_kg']}")
        assert_true(pa_wheat_lot["quantity"] == "50 ਬੋਰੀਆਂ",
                    f"Gurmukhi quantity '੫੦ ਬੋਰੀਆਂ' normalized digits: '{pa_wheat_lot['quantity']}'")

    # Check the Punjabi Potato post
    pa_potato_lot = next((item for item in all_lots if item["id"] == r_lot_pa2["id"]), None)
    if pa_potato_lot:
        assert_true(pa_potato_lot["crop"] == "Potato" and pa_potato_lot["crop_hi"] == "आलू" and pa_potato_lot["crop_pa"] == "ਆਲੂ",
                    f"Punjabi 'ਆਲੂ' canonicalized to '{pa_potato_lot['crop']}' (HI='{pa_potato_lot['crop_hi']}', PA='{pa_potato_lot['crop_pa']}')")

    # Check all demand retrieval
    _, all_demand = request("/api/demand/all", token=token_en)
    pa_mustard_dem = next((item for item in all_demand if item["id"] == r_dem_pa["id"]), None)
    if pa_mustard_dem:
        assert_true(pa_mustard_dem["crop"] == "Mustard",
                    f"Punjabi demand 'ਸਰ੍ਹੋਂ' canonicalized to '{pa_mustard_dem['crop']}' (HI='{pa_mustard_dem['crop_hi']}', PA='{pa_mustard_dem['crop_pa']}')")
        assert_true(pa_mustard_dem["price_per_kg"] == 55.0,
                    f"Gurmukhi demand price '੫੫.੦' converted to float: {pa_mustard_dem['price_per_kg']}")

    hi_rice_dem = next((item for item in all_demand if item["id"] == r_dem_hi["id"]), None)
    if hi_rice_dem:
        assert_true(hi_rice_dem["crop"] == "Rice",
                    f"Hindi demand 'चावल / धान' canonicalized to '{hi_rice_dem['crop']}' (HI='{hi_rice_dem['crop_hi']}', PA='{hi_rice_dem['crop_pa']}')")

    # -------------------------------------------------------------
    # 7. SUMMARY
    # -------------------------------------------------------------
    print_section("TEST SUMMARY")
    print(f"  TOTAL TESTS : {passed + failed}")
    print(f"  PASSED      : {passed}")
    print(f"  FAILED      : {failed}")
    if failed == 0:
        print("\n  >> ALL THREE LANGUAGES (English, Hindi, Punjabi) FULLY UNDERSTOOD & VERIFIED! <<\n")
    return failed == 0

if __name__ == "__main__":
    success = test_multilingual_backend()
    sys.exit(0 if success else 1)
