"""
AgriConnect Mandi Price Converter.
Normalizes raw Agmarknet exports (.csv, .xlsx, .xls, HTML tables) into clean prices.csv.
Can be used as a Python module or run via CLI.
"""
import io
import os
import re
import sys
import pandas as pd

COLUMNS = [
    "State", "District", "Market", "Commodity", "Variety", "Grade", "Arrival_Date",
    "Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price"
]

ALIASES = {
    # English
    "state": "State", "statename": "State",
    "district": "District", "districtname": "District",
    "market": "Market", "marketname": "Market",
    "commodity": "Commodity", "commodityname": "Commodity",
    "variety": "Variety", "grade": "Grade",
    "arrivaldate": "Arrival_Date", "pricedate": "Arrival_Date", "reporteddate": "Arrival_Date", "date": "Arrival_Date",
    "minprice": "Min_x0020_Price", "minimumprice": "Min_x0020_Price",
    "maxprice": "Max_x0020_Price", "maximumprice": "Max_x0020_Price",
    "modalprice": "Modal_x0020_Price",

    # Hindi / Devanagari
    "राज्य": "State", "राज्यकानाम": "State",
    "जिला": "District", "ज़िला": "District", "जिलेकानाम": "District",
    "मंडी": "Market", "बाजार": "Market", "बाज़ार": "Market", "मंडीकानाम": "Market",
    "फसल": "Commodity", "कमोडिटी": "Commodity", "फसलकानाम": "Commodity",
    "किस्म": "Variety", "प्रजाति": "Variety", "ग्रेड": "Grade",
    "आवकतारीख": "Arrival_Date", "आवकतिथि": "Arrival_Date", "तारीख": "Arrival_Date", "दिनांक": "Arrival_Date",
    "न्यूनतममूल्य": "Min_x0020_Price", "न्यूनतम": "Min_x0020_Price", "कमसेकम": "Min_x0020_Price",
    "अधिकतममूल्य": "Max_x0020_Price", "अधिकतम": "Max_x0020_Price",
    "औसतमूल्य": "Modal_x0020_Price", "मोडलमूल्य": "Modal_x0020_Price", "औसत": "Modal_x0020_Price", "मोडल": "Modal_x0020_Price",

    # Punjabi / Gurmukhi
    "ਸੂਬਾ": "State", "ਰਾਜ": "State",
    "ਜ਼ਿਲ੍ਹਾ": "District", "ਜ਼ਿਲਾ": "District",
    "ਮੰਡੀ": "Market", "ਬਾਜ਼ਾਰ": "Market",
    "ਫ਼ਸਲ": "Commodity", "ਵਸਤੂ": "Commodity", "ਫਸਲ": "Commodity",
    "ਕਿਸਮ": "Variety", "ਗਰੇਡ": "Grade",
    "ਆਮਦਮਿਤੀ": "Arrival_Date", "ਮਿਤੀ": "Arrival_Date", "ਤਾਰੀਖ": "Arrival_Date",
    "ਘੱਟੋਘੱਟ": "Min_x0020_Price", "ਨਿਊਨਤਮ": "Min_x0020_Price",
    "ਵੱਧਤੋਂਵੱਧ": "Max_x0020_Price", "ਅਧਿਕਤਮ": "Max_x0020_Price",
    "ਔਸਤ": "Modal_x0020_Price", "ਔਸਤਮੁੱਲ": "Modal_x0020_Price",
}


def key(header):
    """Normalize headers: strips whitespace, punctuation, and parenthesized units."""
    h = str(header).lower().replace("_x0020_", "")
    h = re.sub(r"\(.*?\)", "", h)
    return re.sub(r"[^\w\u0900-\u097F\u0A00-\u0A7F]", "", h, flags=re.UNICODE)


def read_any(source, filename=""):
    """
    Reads a file path or in-memory file stream (.csv, .xls, .xlsx, or HTML table).
    """
    ext = os.path.splitext(filename or getattr(source, "filename", ""))[1].lower()
    
    # Handle path strings
    if isinstance(source, str):
        if not ext:
            ext = os.path.splitext(source)[1].lower()
        if ext == ".csv":
            return [pd.read_csv(source, dtype=str)]
        try:
            return [pd.read_excel(source, dtype=str)]
        except Exception:
            return pd.read_html(source)

    # Handle file-like objects (e.g. Flask FileStorage / BytesIO)
    content = source.read() if hasattr(source, "read") else source
    if hasattr(source, "seek"):
        source.seek(0)

    bio = io.BytesIO(content) if isinstance(content, bytes) else io.StringIO(content)

    if ext == ".csv":
        try:
            return [pd.read_csv(bio, dtype=str)]
        except Exception:
            bio.seek(0)

    try:
        bio.seek(0)
        return [pd.read_excel(bio, dtype=str)]
    except Exception:
        bio.seek(0)
        try:
            return pd.read_html(bio)
        except Exception:
            # Final fallback: try csv
            bio.seek(0)
            return [pd.read_csv(bio, dtype=str)]


def find_header(df):
    """Detects header row containing 'modal' if exports have banner lines."""
    if any("modal" in key(c) for c in df.columns):
        return df
    for i in range(min(15, len(df))):
        if any("modal" in key(v) for v in df.iloc[i].fillna("")):
            out = df.iloc[i + 1:].copy()
            out.columns = df.iloc[i]
            return out
    return None


def normalise(df, state=None):
    """Normalizes columns, datatypes, and dates to AgriConnect standard."""
    df = df.rename(columns={c: ALIASES[key(c)] for c in df.columns if key(c) in ALIASES})
    missing = [c for c in ("Commodity", "Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price") if c not in df.columns]
    if missing:
        return None, f"Missing required columns: {missing}"

    for c in COLUMNS:
        if c not in df.columns:
            df[c] = state if c == "State" and state else ""

    if state:
        df["State"] = df["State"].replace("", state).fillna(state)

    for c in ("Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price"):
        df[c] = pd.to_numeric(df[c].astype(str).str.replace(",", ""), errors="coerce")

    df = df.dropna(subset=["Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price"])
    dates = pd.to_datetime(df["Arrival_Date"], errors="coerce", dayfirst=True)
    df["Arrival_Date"] = dates.dt.strftime("%d/%m/%Y").where(dates.notna(), df["Arrival_Date"])
    return df[COLUMNS], None


def process_price_files(files, state=None, out_csv=None, merge_existing=False):
    """
    Main ingestion function.
    Accepts a list of file paths or Flask FileStorage items.
    Returns (result_df, None) on success or (None, error_message).
    """
    frames = []
    
    if merge_existing and out_csv and os.path.exists(out_csv):
        try:
            existing = pd.read_csv(out_csv, dtype=str)
            frames.append(existing)
        except Exception:
            pass

    for f in files:
        fname = getattr(f, "filename", str(f))
        try:
            tables = read_any(f, filename=fname)
        except Exception as e:
            return None, f"Could not read {fname}: {e}"

        for t in tables:
            t = find_header(t)
            if t is None:
                continue
            df, problem = normalise(t, state)
            if problem:
                continue
            frames.append(df)

    if not frames:
        return None, "No valid Mandi price rows found in the provided files."

    all_rows = pd.concat(frames, ignore_index=True).drop_duplicates()
    all_rows["Min_x0020_Price"] = pd.to_numeric(all_rows["Min_x0020_Price"], errors="coerce").fillna(0).round().astype(int)
    all_rows["Max_x0020_Price"] = pd.to_numeric(all_rows["Max_x0020_Price"], errors="coerce").fillna(0).round().astype(int)
    all_rows["Modal_x0020_Price"] = pd.to_numeric(all_rows["Modal_x0020_Price"], errors="coerce").fillna(0).round().astype(int)

    if out_csv:
        os.makedirs(os.path.dirname(os.path.abspath(out_csv)), exist_ok=True)
        all_rows.to_csv(out_csv, index=False)

    return all_rows, None


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Convert Agmarknet price exports into prices.csv")
    parser.add_argument("files", nargs="+", help="Files to convert")
    parser.add_argument("--state", help="State name to fill in if missing")
    parser.add_argument("--output", default="prices.csv", help="Output file path (default: prices.csv)")
    args = parser.parse_args()

    df, err = process_price_files(args.files, state=args.state, out_csv=args.output)
    if err:
        print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)
    print(f"Successfully processed {len(df)} rows and saved to {args.output}")
