"""
Turn mandi price files you downloaded yourself into backend/prices.csv. No API key needed.

Works with:
  - Agmarknet report exports (agmarknet.gov.in -> pick commodity/state/date -> Export to Excel/CSV)
  - data.gov.in CSV downloads of "Current Daily Price of Various Commodities from Various Markets"
  - the prices.csv this project already uses

Usage (from the backend folder):
    python3 convert_prices.py ~/Downloads/onion.xls ~/Downloads/wheat.xls ...
    python3 convert_prices.py ~/Downloads/*.xls --state Punjab   # if the file has no State column

Needs: pip3 install pandas openpyxl xlrd lxml
"""
import argparse
import os
import re
import sys

import pandas as pd

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prices.csv")
COLUMNS = ["State", "District", "Market", "Commodity", "Variety", "Grade", "Arrival_Date",
           "Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price"]

# Every header spelling we have seen -> the column the website needs.
ALIASES = {
    "state": "State", "statename": "State",
    "district": "District", "districtname": "District",
    "market": "Market", "marketname": "Market",
    "commodity": "Commodity", "commodityname": "Commodity",
    "variety": "Variety", "grade": "Grade",
    "arrivaldate": "Arrival_Date", "pricedate": "Arrival_Date", "reporteddate": "Arrival_Date", "date": "Arrival_Date",
    "minprice": "Min_x0020_Price", "minimumprice": "Min_x0020_Price",
    "maxprice": "Max_x0020_Price", "maximumprice": "Max_x0020_Price",
    "modalprice": "Modal_x0020_Price",
}


def key(header):
    """'Min Price (Rs./Quintal)' / 'Min_x0020_Price' / 'min_price' -> 'minprice'"""
    h = str(header).lower().replace("_x0020_", "")
    h = re.sub(r"\(.*?\)", "", h)
    return re.sub(r"[^a-z]", "", h)


def read_any(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".csv":
        return [pd.read_csv(path, dtype=str)]
    try:
        return [pd.read_excel(path, dtype=str)]
    except Exception:
        # Agmarknet ".xls" exports are often really HTML tables.
        return pd.read_html(path)


def find_header(df):
    """Some exports have title rows above the real header. Find the row that mentions 'Modal'."""
    if any("modal" in key(c) for c in df.columns):
        return df
    for i in range(min(15, len(df))):
        if any("modal" in key(v) for v in df.iloc[i].fillna("")):
            out = df.iloc[i + 1:].copy()
            out.columns = df.iloc[i]
            return out
    return None


def normalise(df, state):
    df = df.rename(columns={c: ALIASES[key(c)] for c in df.columns if key(c) in ALIASES})
    missing = [c for c in ("Commodity", "Min_x0020_Price", "Max_x0020_Price", "Modal_x0020_Price") if c not in df.columns]
    if missing:
        return None, f"missing columns {missing}"
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


def main():
    p = argparse.ArgumentParser(description="Combine downloaded mandi price files into prices.csv")
    p.add_argument("files", nargs="+")
    p.add_argument("--state", help="State name to fill in when the file has no State column")
    a = p.parse_args()

    frames = []
    for path in a.files:
        try:
            tables = read_any(path)
        except Exception as e:
            print(f"Skipped {path}: could not open it ({e.__class__.__name__}).")
            continue
        for t in tables:
            t = find_header(t)
            if t is None:
                continue
            df, problem = normalise(t, a.state)
            if problem:
                print(f"Skipped a table in {path}: {problem}.")
                continue
            print(f"{os.path.basename(path)}: {len(df)} rows")
            frames.append(df)

    if not frames:
        sys.exit("No usable price rows found, so prices.csv was left unchanged.")
    all_rows = pd.concat(frames).drop_duplicates()
    all_rows["Min_x0020_Price"] = all_rows["Min_x0020_Price"].round().astype(int)
    all_rows["Max_x0020_Price"] = all_rows["Max_x0020_Price"].round().astype(int)
    all_rows["Modal_x0020_Price"] = all_rows["Modal_x0020_Price"].round().astype(int)
    all_rows.to_csv(OUT, index=False)
    print(f"Saved {len(all_rows)} rows to {OUT}. Restart app.py to see them on the website.")


if __name__ == "__main__":
    main()
