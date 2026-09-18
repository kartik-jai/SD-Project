import streamlit as st
import pandas as pd

def render_dashboard():
    st.sidebar.markdown(f"### Logged In As:")
    st.sidebar.info(f"**{st.session_state.user_name}**\n\nRole: *{st.session_state.user_role}*")
    
    if st.sidebar.button("Logout", use_container_width=True):
        st.session_state.logged_in = False
        st.session_state.user_role = None
        st.session_state.user_name = ""
        st.session_state.current_page = "home"
        st.rerun()

    # ==========================================
    # FARMER / FPO DASHBOARD
    # ==========================================
    if st.session_state.user_role == "Farmer / FPO":
        st.title("🌾 Manage your harvest.")
        st.caption(f"Welcome back, {st.session_state.user_name}. Publish lots and review sale-window recommendations.")
        
        tab1, tab2, tab3 = st.tabs(["📦 Create & List Produce Lot", "📑 My Listed Lots", "📈 Price Trend Insights"])
        
        with tab1:
            with st.container(border=True):
                st.subheader("Post a New Lot for Verified Buyers")
                c1, c2 = st.columns(2)
                with c1:
                    crop_type = st.selectbox("Crop Type", ["Wheat", "Mustard", "Tomato", "Basmati Paddy", "Maize", "Cotton"])
                    quantity = st.text_input("Estimated Quantity (in Quintals)", placeholder="e.g., 100")
                    quality_grade = st.selectbox("Quality Specification", ["Grade A (Premium)", "Grade FAQ", "Grade B"])
                with c2:
                    district = st.text_input("Mandi / Location", placeholder="e.g., Khanna Mandi")
                    expected_price = st.text_input("Reserve Price (₹ / Quintal)", placeholder="e.g., 2400")
                    st.text_area("Harvest Date & Moisture Details", placeholder="Harvested last week...")
                
                if st.button("Publish Lot to Verified Buyers", type="primary"):
                    if quantity and district:
                        new_lot = {
                            "id": f"LOT-{len(st.session_state.lots) + 101}",
                            "crop": crop_type,
                            "quantity": quantity,
                            "grade": quality_grade,
                            "location": district,
                            "farmer": st.session_state.user_name,
                            "price": expected_price if expected_price else "Negotiable",
                            "status": "Listed"
                        }
                        st.session_state.lots.append(new_lot)
                        st.success(f"Lot {new_lot['id']} published successfully!")
                    else:
                        st.error("Please provide both quantity and location.")

        with tab2:
            my_lots = [lot for lot in st.session_state.lots if lot["farmer"] == st.session_state.user_name]
            if not my_lots:
                st.info("You haven't listed any lots yet.")
            else:
                for lot in my_lots:
                    with st.container(border=True):
                        st.subheader(f"{lot['crop']} (ID: {lot['id']})")
                        c1, c2, c3, c4 = st.columns(4)
                        c1.metric("Quantity", f"{lot['quantity']} Qtl")
                        c2.metric("Grade", lot['grade'])
                        c3.metric("Target Price", f"₹{lot.get('price', 'N/A')}")
                        c4.metric("Status", lot['status'])

        with tab3:
            with st.container(border=True):
                st.subheader("🟢 Favorable Window Active")
                st.write("The 7-day moving average for Wheat and Mustard is trending above the 14-day baseline in your region. Verified buyers are actively seeking inventory.")

    # ==========================================
    # VERIFIED BUYER DASHBOARD
    # ==========================================
    elif st.session_state.user_role == "Verified Buyer":
        st.title("🤝 Live Market Lots.")
        st.caption(f"Welcome back, {st.session_state.user_name}. Browse listed lots and submit digital offers.")
        
        with st.container(border=True):
            c1, c2 = st.columns(2)
            crop_filter = c1.selectbox("Filter by Crop", ["All Crops", "Wheat", "Mustard", "Tomato", "Basmati Paddy"])
            c2.selectbox("Logistics Radius", ["All Regions", "Punjab & Haryana", "Rajasthan"])

        filtered_lots = st.session_state.lots
        if crop_filter != "All Crops":
            filtered_lots = [l for l in filtered_lots if crop_filter in l["crop"]]

        if not filtered_lots:
            st.info("No lots match your current filters.")
        
        for lot in filtered_lots:
            with st.container(border=True):
                st.subheader(f"{lot['crop']} (ID: {lot['id']})")
                st.caption(f"📍 {lot['location']} • 👨‍🌾 Farmer: {lot['farmer']}")
                c1, c2, c3 = st.columns(3)
                c1.metric("Quantity Available", f"{lot['quantity']} Qtl")
                c2.metric("Quality Grade", lot['grade'])
                c3.metric("Asking Price", f"₹{lot.get('price', 'N/A')}")
                
                if st.button(f"Submit Digital Offer", key=f"offer_{lot['id']}", type="primary"):
                    st.success(f"Offer worksheet initialized for {lot['id']}.")

    # ==========================================
    # ADMIN DASHBOARD
    # ==========================================
    elif st.session_state.user_role == "Admin / Market Regulator":
        st.title("⚙️ System Overview.")
        st.caption("Real-time monitoring of arrival volumes, match fulfillment rates, and performance.")
        
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Active Farmer Lots", len(st.session_state.lots))
        c2.metric("Verified Buyers", "42")
        c3.metric("Avg. Time-to-Match", "4.2h")
        c4.metric("Total Volume (Qtl)", "3,850")

        st.divider()
        st.subheader("Transaction Progression State")
        tx_data = pd.DataFrame({
            "Stage": ["Lots Listed", "Matches Surfaced", "Offers Submitted", "Offers Accepted", "Transactions Completed"],
            "Count": [128, 114, 86, 68, 62]
        })
        st.bar_chart(tx_data.set_index("Stage"))