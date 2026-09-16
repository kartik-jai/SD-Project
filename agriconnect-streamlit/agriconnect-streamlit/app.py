import streamlit as st
import pandas as pd
import dashboard  # Imports your new dashboard.py file

st.set_page_config(page_title="AgriConnect", page_icon="🌱", layout="wide")

# --- Session State Initialization ---
if "current_page" not in st.session_state:
    st.session_state.current_page = "home"
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "user_role" not in st.session_state:
    st.session_state.user_role = None
if "user_name" not in st.session_state:
    st.session_state.user_name = ""
if "lots" not in st.session_state:
    st.session_state.lots = [
        {"id": "LOT-101", "crop": "Wheat", "quantity": "120", "grade": "Grade A", "location": "Khanna APMC", "farmer": "Gurpreet Singh", "price": "2450", "status": "Listed"},
        {"id": "LOT-102", "crop": "Mustard", "quantity": "80", "grade": "Grade FAQ", "location": "Bharatpur Mandi", "farmer": "Rajesh Sharma", "price": "5700", "status": "Offer Received"}
    ]

# --- Native Streamlit Navbar ---
nav1, nav2, nav3, nav4 = st.columns([6, 1, 1, 1])
nav1.markdown("### 🌱 AgriConnect")
if nav2.button("Home", use_container_width=True):
    st.session_state.current_page = "home"
    st.rerun()

if not st.session_state.logged_in:
    if nav3.button("Log In", use_container_width=True):
        st.session_state.current_page = "login"
        st.rerun()
    if nav4.button("Register", type="primary", use_container_width=True):
        st.session_state.current_page = "register"
        st.rerun()
else:
    if nav3.button("Dashboard", type="primary", use_container_width=True):
        st.session_state.current_page = "dashboard"
        st.rerun()

st.divider()

# ==========================================
# PUBLIC HOME PAGE
# ==========================================
if st.session_state.current_page == "home":
    st.title("Sell with the signal, not the guess.")
    st.write("AgriConnect brings mandi prices, sale-window guidance, and verified buyer demand into one clear view for farmers and producer groups.")
    
    st.divider()
    
    st.header("📈 Live Market Pulse")
    with st.container(border=True):
        m1, m2, m3 = st.columns(3)
        m1.metric("Wheat (Khanna APMC)", "₹2,431", "+4.8% ↗ (High Confidence)")
        m2.metric("Mustard (Bharatpur Mandi)", "₹5,782", "+2.1% ↗ (Stable)")
        m3.metric("Tomato (Kolar Market)", "₹1,986", "-3.4% ↘ (Caution)")

        st.subheader("14-Day Price Trend (Wheat)")
        # Generate dummy data for the native line chart to replace the SVG sparkline
        trend_data = pd.DataFrame({
            "Day": [f"Day {i}" for i in range(1, 11)],
            "Price": [28, 32, 30, 39, 36, 46, 44, 55, 58, 66]
        }).set_index("Day")
        st.line_chart(trend_data)

    st.header("⚙️ How it Works")
    c1, c2, c3 = st.columns(3)
    with c1:
        with st.container(border=True):
            st.subheader("01. Read the local signal")
            st.write("See current prices, arrivals, and short-term movement for the crop and markets that matter to you.")
    with c2:
        with st.container(border=True):
            st.subheader("02. List when the window is right")
            st.write("Create a lot with only the details buyers need: crop, quantity, grade, and location.")
    with c3:
        with st.container(border=True):
            st.subheader("03. Meet verified demand")
            st.write("Receive relevant offers from buyers who fit your crop, volume, region, and payment expectations.")

    st.header("🤝 Verified Buyers Network")
    b1, b2, b3 = st.columns(3)
    with b1:
        with st.container(border=True):
            st.subheader("Aarohan Foods")
            st.caption("Ludhiana · 86 km")
            st.write("**Needs:** 22–40 tonnes")
            st.info("Verified Buyer • 98% Fit")
    with b2:
        with st.container(border=True):
            st.subheader("Sattva Grains")
            st.caption("Jaipur · 241 km")
            st.write("**Needs:** 10–25 tonnes")
            st.warning("Fast Payer • 94% Fit")
    with b3:
        with st.container(border=True):
            st.subheader("GreenRoute Retail")
            st.caption("Delhi NCR · 312 km")
            st.write("**Needs:** 5–15 tonnes")
            st.success("New Demand • 89% Fit")

# ==========================================
# LOGIN PAGE
# ==========================================
elif st.session_state.current_page == "login":
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        with st.container(border=True):
            st.header("Sign In")
            role = st.selectbox("I am logging in as:", ["Farmer / FPO", "Verified Buyer", "Admin / Market Regulator"])
            username = st.text_input("Mobile Number or Email")
            st.text_input("Password", type="password")
            
            if st.button("Access Dashboard", type="primary", use_container_width=True):
                st.session_state.logged_in = True
                st.session_state.user_name = username if username else "User"
                st.session_state.user_role = role
                st.session_state.current_page = "dashboard"
                st.rerun()

# ==========================================
# REGISTER PAGE
# ==========================================
elif st.session_state.current_page == "register":
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        with st.container(border=True):
            st.header("Register New Account")
            t1, t2 = st.tabs(["Farmer / FPO", "Verified Buyer"])
            
            with t1:
                st.text_input("Full Name")
                st.text_input("Mobile Number")
                if st.button("Register as Farmer", type="primary", use_container_width=True):
                    st.success("Registered! You can now log in.")
            with t2:
                st.text_input("Enterprise Name")
                st.text_input("Trade License ID")
                if st.button("Submit Credentials", type="primary", use_container_width=True):
                    st.success("Verification initiated! You can log in once approved.")

# ==========================================
# DASHBOARD ROUTER
# ==========================================
elif st.session_state.current_page == "dashboard":
    dashboard.render_dashboard()