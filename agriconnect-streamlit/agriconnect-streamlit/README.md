# AgriConnect Streamlit Frontend

This folder contains a Streamlit conversion of the AgriConnect React frontend. The visual direction is preserved as the **Field Atlas** system: chalk paper canvas, Monsoon Green, Fraunces editorial headlines, DM Sans interface text, agricultural photography, market-signal cards, buyer verification tags, responsive sections, and the sample lot flow.

## Run locally

Create a virtual environment, install the dependencies, and start Streamlit from this folder:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

The app is frontend-only and uses local generated assets from `assets/`. The sample market data is intentionally presentational and should be replaced with the AgriConnect backend/API when the data layer is ready.

## Included interactions

The crop selector updates the market signal card and sparkline. The top actions and buyer area provide Streamlit feedback messages. The “Create a sample lot” expander recreates the original lot modal flow with crop, quality, quantity, and location fields, followed by a publish confirmation.

## Fidelity note

Streamlit is not a pixel-for-pixel replacement for React because its rendering model is Python-driven and reruns the page on interaction. This implementation keeps the same information architecture, copy, imagery, palette, typography, spacing rhythm, cards, gradients, responsive breakpoints, and core interactions while using native Streamlit controls where a custom React interaction cannot be reproduced directly.
