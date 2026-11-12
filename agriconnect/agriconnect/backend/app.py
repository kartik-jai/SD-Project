"""AgriConnect API (Flask + SQLite). Run: python app.py  -> http://127.0.0.1:5000"""
import csv
import os
import re
from functools import wraps

from flask import Flask, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

import db

HERE = os.path.dirname(__file__)
app = Flask(__name__)
SECRET = os.environ.get("AGRICONNECT_SECRET", "dev-secret-change-me")
signer = URLSafeTimedSerializer(SECRET)
TOKEN_AGE = 60 * 60 * 24 * 7
ROLES = ("Farmer", "Buyer")


def err(msg, code=400):
    return jsonify({"error": msg}), code


def auth(role=None):
    def deco(fn):
        @wraps(fn)
        def wrapper(*a, **kw):
            header = request.headers.get("Authorization", "")
            token = header[7:] if header.startswith("Bearer ") else ""
            try:
                uid = signer.loads(token, max_age=TOKEN_AGE)["uid"]
            except (BadSignature, SignatureExpired, KeyError):
                return err("Your session has expired. Log in again.", 401)
            user = db.get_user(uid)
            if not user:
                return err("Account not found. Log in again.", 401)
            if role and user["role"] != role:
                return err(f"Only {role.lower()}s can do this.", 403)
            g.user = user
            return fn(*a, **kw)
        return wrapper
    return deco


def session_for(user):
    return {"token": signer.dumps({"uid": user["id"]}), "user": user}


# ---------- auth ----------
@app.post("/api/register")
def register():
    d = request.get_json(silent=True) or {}
    name = str(d.get("name", "")).strip()
    phone = re.sub(r"\s+", "", str(d.get("phone", "")))
    password = str(d.get("password", ""))
    role = d.get("role")
    if not name:
        return err("Enter your name.")
    if not re.fullmatch(r"\+?\d{10,13}", phone):
        return err("Enter a valid phone number with 10 digits.")
    if len(password) < 6:
        return err("Use a password with at least 6 characters.")
    if role not in ROLES:
        return err("Choose whether you are a farmer or a buyer.")
    if db.phone_exists(phone):
        return err("This phone number is already registered. Log in instead.", 409)
    uid = db.register_user(name, phone, password, role)
    return jsonify(session_for(db.get_user(uid))), 201


@app.post("/api/login")
def login():
    d = request.get_json(silent=True) or {}
    user = db.check_login(re.sub(r"\s+", "", str(d.get("phone", ""))), str(d.get("password", "")))
    if not user:
        return err("Phone number or password is wrong. Check both and try again.", 401)
    return jsonify(session_for(user))


@app.get("/api/me")
@auth()
def me():
    return jsonify(g.user)


# ---------- listings ----------
def clean_listing(d):
    crop = str(d.get("crop", "")).strip()
    quantity = str(d.get("quantity", "")).strip()
    location = str(d.get("location", "")).strip()
    quality = d.get("quality")
    try:
        price = float(d.get("price_per_kg"))
    except (TypeError, ValueError):
        price = 0
    if not crop or not quantity or not location:
        return None, "Fill in crop, quantity and location."
    if quality not in ("A", "B", "C"):
        return None, "Choose a quality grade: A, B or C."
    if price <= 0:
        return None, "Enter a price above ₹0 per kg."
    return {"crop": crop, "quantity": quantity, "quality": quality, "location": location, "price_per_kg": price}, None


def listing_routes(name, create, mine, everyone, delete, role):
    def post():
        item, e = clean_listing(request.get_json(silent=True) or {})
        if e:
            return err(e)
        return jsonify({"id": create(g.user["id"], item)}), 201

    def get_mine():
        return jsonify(mine(g.user["id"]))

    def get_all():
        return jsonify(everyone())

    def remove(item_id):
        if not delete(item_id, g.user["id"]):
            return err("Listing not found, or it belongs to someone else.", 404)
        return jsonify({"ok": True})

    app.add_url_rule(f"/api/{name}", f"post_{name}", auth(role)(post), methods=["POST"])
    app.add_url_rule(f"/api/{name}/mine", f"mine_{name}", auth(role)(get_mine))
    app.add_url_rule(f"/api/{name}/all", f"all_{name}", auth()(get_all))
    app.add_url_rule(f"/api/{name}/<int:item_id>", f"del_{name}", auth(role)(remove), methods=["DELETE"])


listing_routes("lots", db.create_lot, db.my_lots, db.all_lots, db.delete_lot, "Farmer")
listing_routes("demand", db.create_demand, db.my_demand, db.all_demand, db.delete_demand, "Buyer")


# ---------- mandi prices (from prices.csv) ----------
def load_prices():
    path = os.path.join(HERE, "prices.csv")
    if not os.path.exists(path):
        return []
    out = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            r = {k.replace("_x0020_", "_"): v for k, v in r.items()}
            try:
                lo, hi, mo = (float(r[k]) / 100 for k in ("Min_Price", "Max_Price", "Modal_Price"))
            except (KeyError, TypeError, ValueError):
                continue
            out.append({
                "state": r.get("State", ""), "district": r.get("District", ""), "market": r.get("Market", ""),
                "commodity": r.get("Commodity", ""), "variety": r.get("Variety", ""), "grade": r.get("Grade", ""),
                "date": r.get("Arrival_Date", ""), "min": round(lo, 2), "max": round(hi, 2), "modal": round(mo, 2),
            })
    return out


@app.get("/api/prices")
def prices():
    return jsonify(load_prices())


if __name__ == "__main__":
    db.init_db()
    app.run(host="127.0.0.1", port=5000, debug=False)
else:
    db.init_db()
