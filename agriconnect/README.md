# AgriConnect

React frontend + Flask API + SQLite. Farmers post lots, buyers post demand, and every listing shows its price against real mandi rates from `backend/prices.csv`.

## Run it (two terminals)

**1. Backend**
```
cd backend
pip install -r requirements.txt
python app.py
```
Runs on http://127.0.0.1:5000. It creates `table.db` on first run.

**2. Frontend**
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The dev server forwards `/api` to the backend.

## Use your existing data
- Copy your current `table.db` into `backend/` before starting. Same tables, nothing to migrate. Old plain-text passwords turn into hashes the first time each person logs in.
- Replace `backend/prices.csv` with a bigger download any time. Restart the backend to load it.

## Folders
- `backend/app.py` API routes and auth. `backend/db.py` all SQLite queries.
- `frontend/src/pages` screens. `frontend/src/roles.js` all farmer/buyer wording. `frontend/src/styles.css` the design.
