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
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                participant1_id INTEGER NOT NULL,
                participant2_id INTEGER NOT NULL,
                item_type TEXT,
                item_id INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                text TEXT,
                offer_price REAL,
                offer_status TEXT,
                is_read INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS deals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                message_id INTEGER,
                buyer_id INTEGER NOT NULL,
                farmer_id INTEGER NOT NULL,
                item_type TEXT,
                item_id INTEGER,
                crop TEXT,
                quantity TEXT,
                quantity_kg REAL,
                agreed_price_per_kg REAL,
                total_amount REAL,
                paid_amount REAL,
                payment_type TEXT,
                payment_method TEXT,
                payment_id TEXT,
                status TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(conversation_id) REFERENCES conversations(id),
                FOREIGN KEY(buyer_id) REFERENCES users(id),
                FOREIGN KEY(farmer_id) REFERENCES users(id));
            """
        )
        # Clean up any same-role conversations if they exist
        c.execute(
            """
            DELETE FROM messages WHERE conversation_id IN (
                SELECT c.id FROM conversations c
                JOIN users u1 ON c.participant1_id=u1.id
                JOIN users u2 ON c.participant2_id=u2.id
                WHERE u1.role = u2.role
            )
            """
        )
        c.execute(
            """
            DELETE FROM conversations WHERE id IN (
                SELECT c.id FROM conversations c
                JOIN users u1 ON c.participant1_id=u1.id
                JOIN users u2 ON c.participant2_id=u2.id
                WHERE u1.role = u2.role
            )
            """
        )
        # Ensure status column exists in lots and demand
        for tbl in ("lots", "demand"):
            cols = [r["name"] for r in c.execute(f"PRAGMA table_info({tbl})").fetchall()]
            if "status" not in cols:
                c.execute(f"ALTER TABLE {tbl} ADD COLUMN status TEXT DEFAULT 'active'")


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
    # Aliases for duplicate test accounts so either test phone number logs into the primary account
    aliases = {
        "9100040569": "9100099551",
        "9100099586": "9100099551",
        "9300040569": "9300099551",
        "9300099586": "9300099551",
    }
    phone = aliases.get(phone, phone)
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
        rows = c.execute(
            f"SELECT * FROM {table} WHERE {owner_col}=? AND (status != 'fulfilled' OR status IS NULL) ORDER BY id DESC",
            (uid,),
        ).fetchall()
        return [dict(r) for r in rows]


def _all(table, owner_col):
    with conn() as c:
        rows = c.execute(
            f"SELECT t.*, u.name AS owner_name FROM {table} t LEFT JOIN users u ON u.id=t.{owner_col} "
            f"WHERE (t.status != 'fulfilled' OR t.status IS NULL) ORDER BY t.id DESC"
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


# ---- conversations & messages ----
def get_or_create_conversation(uid1, uid2, item_type=None, item_id=None):
    with conn() as c:
        u1 = c.execute("SELECT role FROM users WHERE id=?", (uid1,)).fetchone()
        u2 = c.execute("SELECT role FROM users WHERE id=?", (uid2,)).fetchone()
        if not u1 or not u2 or u1["role"] == u2["role"]:
            return None

        if item_type and item_id:
            row = c.execute(
                """
                SELECT * FROM conversations
                WHERE ((participant1_id=? AND participant2_id=?) OR (participant1_id=? AND participant2_id=?))
                  AND item_type=? AND item_id=?
                LIMIT 1
                """,
                (uid1, uid2, uid2, uid1, item_type, item_id),
            ).fetchone()
        else:
            row = c.execute(
                """
                SELECT * FROM conversations
                WHERE ((participant1_id=? AND participant2_id=?) OR (participant1_id=? AND participant2_id=?))
                ORDER BY updated_at DESC
                LIMIT 1
                """,
                (uid1, uid2, uid2, uid1),
            ).fetchone()

        if row:
            return dict(row)

        cur = c.execute(
            """
            INSERT INTO conversations (participant1_id, participant2_id, item_type, item_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """,
            (uid1, uid2, item_type, item_id),
        )
        new_row = c.execute("SELECT * FROM conversations WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(new_row)


def get_user_conversations(uid):
    with conn() as c:
        u_self = c.execute("SELECT role FROM users WHERE id=?", (uid,)).fetchone()
        self_role = u_self["role"] if u_self else None

        rows = c.execute(
            """
            SELECT * FROM conversations
            WHERE participant1_id=? OR participant2_id=?
            ORDER BY updated_at DESC
            """,
            (uid, uid),
        ).fetchall()

        out = []
        for r in rows:
            conv = dict(r)
            other_id = conv["participant2_id"] if int(conv["participant1_id"]) == int(uid) else conv["participant1_id"]
            u_row = c.execute("SELECT id, name, phone, role FROM users WHERE id=?", (other_id,)).fetchone()
            if not u_row or (self_role and u_row["role"] == self_role):
                continue
            conv["other_user"] = dict(u_row)

            # Fetch item summary if attached
            if conv["item_type"] == "lot" and conv["item_id"]:
                lot_row = c.execute(
                    "SELECT l.*, u.name AS owner_name FROM lots l LEFT JOIN users u ON u.id=l.farmer_id WHERE l.id=?",
                    (conv["item_id"],),
                ).fetchone()
                conv["item"] = dict(lot_row) if lot_row else None
            elif conv["item_type"] == "demand" and conv["item_id"]:
                dem_row = c.execute(
                    "SELECT d.*, u.name AS owner_name FROM demand d LEFT JOIN users u ON u.id=d.buyer_id WHERE d.id=?",
                    (conv["item_id"],),
                ).fetchone()
                conv["item"] = dict(dem_row) if dem_row else None
            else:
                conv["item"] = None

            # Last message
            last_msg = c.execute(
                "SELECT * FROM messages WHERE conversation_id=? ORDER BY id DESC LIMIT 1",
                (conv["id"],),
            ).fetchone()
            conv["last_message"] = dict(last_msg) if last_msg else None

            # Unread count
            unread_count = c.execute(
                "SELECT COUNT(*) AS cnt FROM messages WHERE conversation_id=? AND sender_id!=? AND is_read=0",
                (conv["id"], uid),
            ).fetchone()["cnt"]
            conv["unread_count"] = unread_count

            out.append(conv)
        return out


def get_conversation_messages(conv_id, uid):
    with conn() as c:
        conv_row = c.execute("SELECT * FROM conversations WHERE id=?", (conv_id,)).fetchone()
        if not conv_row:
            return None
        conv = dict(conv_row)
        if int(conv["participant1_id"]) != int(uid) and int(conv["participant2_id"]) != int(uid):
            return None

        other_id = conv["participant2_id"] if int(conv["participant1_id"]) == int(uid) else conv["participant1_id"]
        u_row = c.execute("SELECT id, name, phone, role FROM users WHERE id=?", (other_id,)).fetchone()
        u_self = c.execute("SELECT role FROM users WHERE id=?", (uid,)).fetchone()
        if not u_row or not u_self or u_row["role"] == u_self["role"]:
            return None
        conv["other_user"] = dict(u_row)

        # Mark unread messages as read
        c.execute(
            "UPDATE messages SET is_read=1 WHERE conversation_id=? AND sender_id!=? AND is_read=0",
            (conv_id, uid),
        )

        # Item details
        if conv["item_type"] == "lot" and conv["item_id"]:
            lot_row = c.execute(
                "SELECT l.*, u.name AS owner_name FROM lots l LEFT JOIN users u ON u.id=l.farmer_id WHERE l.id=?",
                (conv["item_id"],),
            ).fetchone()
            conv["item"] = dict(lot_row) if lot_row else None
        elif conv["item_type"] == "demand" and conv["item_id"]:
            dem_row = c.execute(
                "SELECT d.*, u.name AS owner_name FROM demand d LEFT JOIN users u ON u.id=d.buyer_id WHERE d.id=?",
                (conv["item_id"],),
            ).fetchone()
            conv["item"] = dict(dem_row) if dem_row else None
        else:
            conv["item"] = None

        # Messages list
        m_rows = c.execute(
            "SELECT * FROM messages WHERE conversation_id=? ORDER BY id ASC",
            (conv_id,),
        ).fetchall()
        messages = [dict(m) for m in m_rows]

        # Deals list (prioritizing full settlement and highest paid amount)
        d_rows = c.execute(
            """
            SELECT * FROM deals WHERE conversation_id=?
            ORDER BY
              CASE WHEN payment_type='full' THEN 1 ELSE 2 END ASC,
              paid_amount DESC,
              id DESC
            """,
            (conv_id,),
        ).fetchall()
        deals = [dict(d) for d in d_rows]

        return {"conversation": conv, "messages": messages, "deals": deals}


def add_message(conv_id, sender_id, text, offer_price=None):
    with conn() as c:
        conv_row = c.execute("SELECT * FROM conversations WHERE id=?", (conv_id,)).fetchone()
        if not conv_row:
            return None
        if conv_row["participant1_id"] != sender_id and conv_row["participant2_id"] != sender_id:
            return None

        offer_status = "pending" if offer_price is not None else None
        cur = c.execute(
            """
            INSERT INTO messages (conversation_id, sender_id, text, offer_price, offer_status, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
            """,
            (conv_id, sender_id, text, offer_price, offer_status),
        )
        c.execute("UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?", (conv_id,))
        new_msg = c.execute("SELECT * FROM messages WHERE id=?", (cur.lastrowid,)).fetchone()
        return dict(new_msg)


def update_offer_status(message_id, uid, status):
    with conn() as c:
        msg_row = c.execute("SELECT * FROM messages WHERE id=?", (message_id,)).fetchone()
        if not msg_row:
            return None
        msg = dict(msg_row)
        conv = c.execute("SELECT * FROM conversations WHERE id=?", (msg["conversation_id"],)).fetchone()
        if not conv:
            return None
        if conv["participant1_id"] != uid and conv["participant2_id"] != uid:
            return None

        # Status validation: recipient can accept/reject; sender can withdraw
        if status in ("accepted", "rejected") and msg["sender_id"] == uid:
            return None
        if status == "withdrawn" and msg["sender_id"] != uid:
            return None

        c.execute("UPDATE messages SET offer_status=? WHERE id=?", (status, message_id))
        c.execute("UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?", (msg["conversation_id"],))
        updated = c.execute("SELECT * FROM messages WHERE id=?", (message_id,)).fetchone()
        return dict(updated)


def get_unread_count(uid):
    with conn() as c:
        row = c.execute(
            """
            SELECT COUNT(*) AS cnt FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE (c.participant1_id=? OR c.participant2_id=?)
              AND m.sender_id!=?
              AND m.is_read=0
            """,
            (uid, uid, uid),
        ).fetchone()
        return row["cnt"] if row else 0


# ---- deals & payments ----
def create_deal(d):
    with conn() as c:
        cur = c.execute(
            """
            INSERT INTO deals (
                conversation_id, message_id, buyer_id, farmer_id, item_type, item_id,
                crop, quantity, quantity_kg, agreed_price_per_kg, total_amount, paid_amount,
                payment_type, payment_method, payment_id, status, created_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)
            """,
            (
                d["conversation_id"],
                d.get("message_id"),
                d["buyer_id"],
                d["farmer_id"],
                d.get("item_type"),
                d.get("item_id"),
                d.get("crop"),
                d.get("quantity"),
                d.get("quantity_kg"),
                d["agreed_price_per_kg"],
                d["total_amount"],
                d["paid_amount"],
                d.get("payment_type", "advance"),
                d.get("payment_method", "upi"),
                d["payment_id"],
                d.get("status", "paid"),
            ),
        )
        deal_id = cur.lastrowid

        # Insert deal confirmation message into chat
        ptype_display = d.get("payment_type", "advance").title()
        pmeth_display = d.get("payment_method", "upi").upper()
        if d.get("payment_type") == "cod":
            pay_text = f"🤝 Deal Confirmed! Mandi settlement agreed at ₹{d['agreed_price_per_kg']}/kg for {d.get('quantity')}. Total: ₹{d['total_amount']:,.2f}. Ref: {d['payment_id']}"
        else:
            pay_text = f"🎉 Deal Confirmed & Payment Received! ₹{d['paid_amount']:,.2f} paid ({ptype_display} via {pmeth_display}). Total: ₹{d['total_amount']:,.2f}. Ref: {d['payment_id']}"

        c.execute(
            """
            INSERT INTO messages (conversation_id, sender_id, text, is_read, created_at)
            VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
            """,
            (d["conversation_id"], d["buyer_id"], pay_text),
        )
        c.execute("UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?", (d["conversation_id"],))

        row = c.execute("SELECT * FROM deals WHERE id=?", (deal_id,)).fetchone()
        return dict(row)


def get_conversation_deals(conv_id):
    with conn() as c:
        rows = c.execute(
            """
            SELECT * FROM deals WHERE conversation_id=?
            ORDER BY
              CASE WHEN payment_type='full' THEN 1 ELSE 2 END ASC,
              paid_amount DESC,
              id DESC
            """,
            (conv_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def get_deal_by_message(conv_id, message_id):
    with conn() as c:
        row = c.execute(
            "SELECT * FROM deals WHERE conversation_id=? AND message_id=? ORDER BY id DESC LIMIT 1",
            (conv_id, message_id),
        ).fetchone()
        return dict(row) if row else None


def get_deal_by_id(deal_id):
    with conn() as c:
        row = c.execute("SELECT * FROM deals WHERE id=?", (deal_id,)).fetchone()
        if not row:
            return None
        deal = dict(row)
        b = c.execute("SELECT id, name, phone, role FROM users WHERE id=?", (deal["buyer_id"],)).fetchone()
        f = c.execute("SELECT id, name, phone, role FROM users WHERE id=?", (deal["farmer_id"],)).fetchone()
        deal["buyer"] = dict(b) if b else None
        deal["farmer"] = dict(f) if f else None
        return deal


def confirm_delivery(conv_id, buyer_id):
    """Marks the latest deal in conv_id as 'delivered' and satisfies both the related lot and demand.
    Ensures that both the satisfying farmer's lot and satisfied buyer's demand are marked 'fulfilled',
    so they vanish from the active marketplace dashboard while preserving chat and receipt integrity.
    """
    with conn() as c:
        conv = c.execute("SELECT * FROM conversations WHERE id=?", (conv_id,)).fetchone()
        if not conv:
            return None
        if int(conv["participant1_id"]) != int(buyer_id) and int(conv["participant2_id"]) != int(buyer_id):
            return None

        user_row = c.execute("SELECT role FROM users WHERE id=?", (buyer_id,)).fetchone()
        if not user_row or user_row["role"] != "Buyer":
            return None

        deal_row = c.execute(
            """
            SELECT * FROM deals WHERE conversation_id=?
            ORDER BY
              CASE WHEN payment_type='full' THEN 1 ELSE 2 END ASC,
              paid_amount DESC,
              id DESC
            LIMIT 1
            """,
            (conv_id,),
        ).fetchone()
        if not deal_row:
            return None

        deal = dict(deal_row)

        # Update all deals in conversation to 'delivered'
        c.execute("UPDATE deals SET status='delivered' WHERE conversation_id=?", (conv_id,))

        # 1. Mark satisfying farmer's lot as fulfilled
        if deal.get("item_type") == "lot" and deal.get("item_id"):
            c.execute("UPDATE lots SET status='fulfilled' WHERE id=?", (deal["item_id"],))
        if deal.get("farmer_id") and deal.get("crop"):
            c.execute(
                "UPDATE lots SET status='fulfilled' WHERE farmer_id=? AND LOWER(crop)=LOWER(?) AND (status != 'fulfilled' OR status IS NULL)",
                (deal["farmer_id"], deal["crop"]),
            )

        # 2. Mark satisfied buyer's demand as fulfilled
        if deal.get("item_type") == "demand" and deal.get("item_id"):
            c.execute("UPDATE demand SET status='fulfilled' WHERE id=?", (deal["item_id"],))
        if deal.get("buyer_id") and deal.get("crop"):
            c.execute(
                "UPDATE demand SET status='fulfilled' WHERE buyer_id=? AND LOWER(crop)=LOWER(?) AND (status != 'fulfilled' OR status IS NULL)",
                (deal["buyer_id"], deal["crop"]),
            )

        # 3. Add celebratory system/buyer message to conversation
        crop_name = deal.get("crop") or "produce"
        qty = deal.get("quantity") or ""
        qty_str = f" ({qty})" if qty else ""
        completion_msg = (
            f"📦 Lot Received & Verified! Trade successfully completed for {crop_name}{qty_str}. "
            f"The farmer's lot and buyer's demand have been fulfilled and closed."
        )
        c.execute(
            """
            INSERT INTO messages (conversation_id, sender_id, text, is_read, created_at)
            VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
            """,
            (conv_id, buyer_id, completion_msg),
        )
        c.execute("UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?", (conv_id,))

        updated_deal = c.execute("SELECT * FROM deals WHERE id=?", (deal["id"],)).fetchone()
        return dict(updated_deal)
