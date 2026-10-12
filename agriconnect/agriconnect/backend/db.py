"""SQLite access for AgriConnect. Schema matches the original Streamlit project's table.db."""
import os
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash

DB_PATH = os.environ.get("AGRICONNECT_DB", os.path.join(os.path.dirname(__file__), "table.db"))


def conn():
    c = sqlite3.connect(DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init_db():
    with conn() as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, phone TEXT UNIQUE, password TEXT, role TEXT);
            CREATE TABLE IF NOT EXISTS lots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_id INTEGER, crop TEXT, quantity TEXT, quality TEXT, location TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP, price_per_kg REAL DEFAULT 0);
            CREATE TABLE IF NOT EXISTS demand (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buyer_id INTEGER, crop TEXT, quantity TEXT, quality TEXT, location TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP, price_per_kg REAL DEFAULT 0);
            """
        )


# ---- users ----
def phone_exists(phone):
    with conn() as c:
        return c.execute("SELECT 1 FROM users WHERE phone=?", (phone,)).fetchone() is not None


def register_user(name, phone, password, role):
    with conn() as c:
        cur = c.execute(
            "INSERT INTO users (name, phone, password, role) VALUES (?,?,?,?)",
            (name, phone, generate_password_hash(password), role),
        )
        return cur.lastrowid


def check_login(phone, password):
    """Returns user dict or None. Upgrades legacy plain-text passwords to hashes."""
    with conn() as c:
        row = c.execute("SELECT * FROM users WHERE phone=?", (phone,)).fetchone()
        if not row:
            return None
        stored = row["password"] or ""
        if stored.startswith(("scrypt:", "pbkdf2:")):
            ok = check_password_hash(stored, password)
        else:
            ok = stored == password
            if ok:
                c.execute("UPDATE users SET password=? WHERE id=?", (generate_password_hash(password), row["id"]))
        return {"id": row["id"], "name": row["name"], "phone": row["phone"], "role": row["role"]} if ok else None


def get_user(uid):
    with conn() as c:
        row = c.execute("SELECT id, name, phone, role FROM users WHERE id=?", (uid,)).fetchone()
        return dict(row) if row else None


# ---- lots / demand (same shape, different owner column) ----
def _create(table, owner_col, uid, d):
    with conn() as c:
        cur = c.execute(
            f"INSERT INTO {table} ({owner_col}, crop, quantity, quality, location, price_per_kg) VALUES (?,?,?,?,?,?)",
            (uid, d["crop"], d["quantity"], d["quality"], d["location"], d["price_per_kg"]),
        )
        return cur.lastrowid


def _mine(table, owner_col, uid):
    with conn() as c:
        rows = c.execute(f"SELECT * FROM {table} WHERE {owner_col}=? ORDER BY id DESC", (uid,)).fetchall()
        return [dict(r) for r in rows]


def _all(table, owner_col):
    with conn() as c:
        rows = c.execute(
            f"SELECT t.*, u.name AS owner_name FROM {table} t LEFT JOIN users u ON u.id=t.{owner_col} ORDER BY t.id DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def _delete(table, owner_col, item_id, uid):
    with conn() as c:
        return c.execute(f"DELETE FROM {table} WHERE id=? AND {owner_col}=?", (item_id, uid)).rowcount > 0


def create_lot(uid, d): return _create("lots", "farmer_id", uid, d)
def my_lots(uid): return _mine("lots", "farmer_id", uid)
def all_lots(): return _all("lots", "farmer_id")
def delete_lot(i, uid): return _delete("lots", "farmer_id", i, uid)
def create_demand(uid, d): return _create("demand", "buyer_id", uid, d)
def my_demand(uid): return _mine("demand", "buyer_id", uid)
def all_demand(): return _all("demand", "buyer_id")
def delete_demand(i, uid): return _delete("demand", "buyer_id", i, uid)
