/**
 * AgriConnect Internationalization (i18n)
 * Supported languages:
 *   - en: English
 *   - hi: हिन्दी (Hindi)
 *   - pa: ਪੰਜਾਬੀ (Punjabi)
 */

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "हि" },
  { code: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
];

export const TRANSLATIONS = {
  en: {
    // Brand / Common
    tagline: "AgriConnect · Connecting Farmers & Buyers directly",
    footer_text: "AgriConnect · Software Engineering project, Thapar Institute (UCS503P)",
    login: "Log in",
    create_account: "Create account",
    logout: "Log out",
    try_again: "Try again",
    please_wait: "Please wait…",
    search: "Search",
    keep: "Keep",
    unknown: "Unknown",
    welcome: "Welcome",
    welcome_back: "Welcome back",
    session_expired: "Your session expired. Log in again.",
    switch_language: "Language",

    // Landing Page
    hero_title: "Know the mandi rate before you name your price.",
    hero_desc: "Farmers post what they have. Buyers post what they need. Every listing shows the price per kg next to latest government mandi rates, so both sides start from the same number.",
    create_free_acc: "Create a free account",
    already_have_one: "I already have one",
    how_farmers_title: "Farmers",
    how_farmers_desc: "Post a lot with quantity, grade, location and your price. See what buyers are asking for.",
    how_buyers_title: "Buyers",
    how_buyers_desc: "Post the demand you need filled and the price you will pay. Browse every farmer's lot.",
    how_both_title: "Both",
    how_both_desc: "A price bar on each listing shows how far it sits from the mandi average.",

    // Auth
    login_title: "Log in",
    register_title: "Create your account",
    i_am_a: "I am a",
    role_farmer: "Farmer",
    role_buyer: "Buyer",
    full_name: "Full name",
    phone_number: "Phone number",
    phone_placeholder: "10-digit mobile number",
    password: "Password",
    password_placeholder: "At least 6 characters",
    already_account_q: "Already have an account?",
    new_to_agri_q: "New to AgriConnect?",

    // Navigation & Shell
    nav_post_farmer: "Post a lot",
    nav_mine_farmer: "My lots",
    nav_browse_farmer: "Buyer demand",
    nav_post_buyer: "Post demand",
    nav_mine_buyer: "My demand",
    nav_browse_buyer: "Farmer lots",
    mandi_rates: "Mandi rates",
    mandi_rates_today: "Latest mandi rates",
    as_of: "As of {date}",
    mandi_rates_sub: "Government market prices from Agmarknet, converted to ₹ per kg.",
    search_rates_placeholder: "Search crop, market or state",
    rates_count_label: "rates",
    no_rates_loaded: "No rates loaded. Copy prices.csv into the backend folder and restart the API.",
    per_kg_source: "₹ per kg · Source: Agmarknet, data.gov.in",

    // Table Headers
    th_crop: "Crop",
    th_market: "Market",
    th_low: "Low",
    th_high: "High",
    th_avg: "Average",

    // Listings / Cards
    search_crop_location: "Search crop or location",
    nothing_matches: 'Nothing matches "{q}". Try another crop or place.',
    posted_on: "Posted",
    grade_label: "Grade",
    farmer_asks: "You ask",
    farmer_offers: "Offers",
    buyer_offers: "You offer",
    buyer_asks: "Asks",
    per_kg: "/kg",
    yes_delete: "Yes, delete lot",
    yes_cancel: "Yes, cancel demand",
    delete_lot: "Delete lot",
    cancel_demand: "Cancel demand",
    lot_deleted: "Lot deleted",
    demand_cancelled: "Demand cancelled",

    // Empty States
    farmer_mine_empty: "You haven't posted a lot yet. Post one and buyers will see it straight away.",
    buyer_mine_empty: "You haven't posted demand yet. Post one and farmers will see it straight away.",
    farmer_browse_empty: "No buyer has posted demand yet. Check back later.",
    buyer_browse_empty: "No farmer has posted a lot yet. Check back later.",
    farmer_lots_hint: "Explore what fellow farmers are posting, compare asking prices, and analyze market supply.",
    buyer_demand_hint: "Browse what buyers and traders are looking to purchase and the prices they offer.",
    no_lots_yet: "No farmer lots posted yet.",
    no_demand_yet: "No buyer demand posted yet.",
    you: "You",

    // Form: Post Listing
    post_farmer_title: "Post a lot",
    post_farmer_hint: "Tell buyers what you have and the price you want per kg.",
    post_buyer_title: "Post demand",
    post_buyer_hint: "Tell farmers what you need and the price you will pay per kg.",
    field_crop: "Crop",
    crop_placeholder: "Wheat, onion, tomato…",
    field_quantity: "Quantity",
    quantity_placeholder: "500 kg",
    field_quality: "Quality grade",
    grade_a: "A (best)",
    grade_b: "B",
    grade_c: "C",
    field_location: "Location",
    location_placeholder: "Village or town, district",
    farmer_price_label: "Your price (₹ per kg)",
    buyer_price_label: "Price you will pay (₹ per kg)",
    mandi_rate_for: "Mandi rate for",
    average: "average",
    publishing: "Publishing…",
    publish_farmer_submit: "Publish lot",
    publish_buyer_submit: "Publish demand",
    lot_published: "Lot published",
    demand_published: "Demand published",

    // RangeBar
    at_mandi_avg: "At the mandi average",
    above_mandi_avg: "% above the mandi average",
    below_mandi_avg: "% below the mandi average",
    mandi_range_prefix: "Mandi",
    no_mandi_for_crop: "No mandi rate for this crop in your price data.",

    // Chat & Negotiations
    nav_chat: "Messages",
    chat_negotiate: "Chat & Negotiate",
    start_chat: "Message",
    chat_title: "Messages & Negotiations",
    search_chats: "Search conversations…",
    no_conversations: "No conversations yet",
    no_conversations_hint: "Browse lots or buyer demand and click 'Chat & Negotiate' to coordinate and negotiate directly.",
    select_conversation: "Select a conversation to start messaging",
    type_message: "Type a message…",
    send: "Send",
    make_offer: "Make Price Offer",
    counter_offer: "Offer Price",
    propose_price_title: "Propose Price per kg",
    propose_price_desc: "Send a formal price offer for direct negotiation.",
    your_offer_price: "Your Offer Price (₹/kg)",
    send_offer: "Send Offer",
    cancel: "Cancel",
    accept_offer: "Accept Offer",
    decline_offer: "Decline",
    offer_accepted: "Offer Accepted",
    offer_rejected: "Offer Declined",
    offer_withdrawn: "Offer Withdrawn",
    offer_pending: "Offer Pending",
    price_offer_banner: "Price Offer",
    discussing_item: "Discussing",
    quick_replies_label: "Quick responses",
    qr_available: "Is this still available?",
    qr_pickup: "Ready to pick up immediately.",
    qr_transport: "What is the transport arrangement?",
    qr_sample: "Can you share sample or photos?",
    qr_deal: "I agree to the deal!",
    call_now: "Call",
    unread: "unread",
    back_to_chats: "Back to conversations",

    // Deal Confirmation & Payment
    confirm_deal_title: "Confirm Deal & Payment",
    confirm_and_pay: "Confirm & Pay",
    deal_confirmed_badge: "Deal Confirmed",
    payment_successful: "Payment Successful",
    pay_now: "Pay Now",
    proceed_to_payment: "Proceed to Payment",
    view_receipt: "View Receipt",
    deal_receipt_title: "AgriConnect Deal & Payment Receipt",
    transaction_id: "Transaction Ref",
    agreed_rate: "Agreed Price",
    quantity_to_buy: "Quantity to Buy",
    quantity_kg_label: "Weight in Kilograms (kg)",
    total_deal_amount: "Total Deal Value",
    choose_payment_plan: "Payment Terms",
    plan_advance_title: "Advance Token (20%)",
    plan_advance_desc: "Locks the lot and confirms pickup. Pay balance upon vehicle weighment.",
    plan_full_title: "Full Payment (100%)",
    plan_full_desc: "Direct escrow payment to AgriConnect secure trade vault.",
    plan_cod_title: "Pay on Mandi Delivery (COD)",
    plan_cod_desc: "Confirm deal agreement now; full payment upon delivery.",
    amount_payable_now: "Amount to Pay Now",
    balance_on_delivery: "Balance on Delivery",
    payment_method_label: "Payment Method",
    method_upi: "UPI (Google Pay, PhonePe, Paytm)",
    method_netbanking: "Net Banking",
    method_card: "Debit / Credit Card",
    method_cod: "Cash / Direct Mandi Settlement",
    upi_id_placeholder: "Enter UPI ID (e.g. mobile@upi)",
    pay_securely: "Pay {amount} Securely",
    confirm_deal_btn: "Confirm Deal Agreement",
    payment_processing: "Processing payment securely…",
    deal_locked_success: "Deal locked successfully! Receipt generated.",
    waiting_buyer_payment: "Offer accepted! Waiting for buyer to confirm & pay.",
    print_receipt: "Print / Save Receipt",
    close: "Close",
    receipt_buyer: "Buyer Details",
    receipt_farmer: "Farmer Details",
    receipt_date: "Date & Time",
    receipt_status: "Payment Status",
    receipt_paid: "PAID / CONFIRMED",
    secured_by: "Protected by AgriConnect Mandi Assurance",
    confirm_lot_received: "Confirm Lot Received",
    confirm_lot_received_title: "Confirm Lot Delivery & Receipt",
    confirm_lot_received_desc: "Have you inspected and received the produce? Confirming will complete the trade, mark your demand and the farmer's lot as fulfilled, and close this deal.",
    confirm_lot_received_btn: "Yes, I Have Received the Lot",
    trade_completed_badge: "Trade Completed · Delivered",
    awaiting_delivery_badge: "In Transit · Awaiting Delivery",
    lot_fulfilled_closed: "Fulfilled & Closed",
    confirming_delivery: "Confirming delivery…",
    delivery_confirmed_success: "Delivery confirmed! Trade completed successfully.",
    receipt_delivered: "DELIVERED / TRADE COMPLETED",
  },

  hi: {
    // Brand / Common
    tagline: "AgriConnect · किसानों और खरीदारों को सीधे जोड़ता है",
    footer_text: "AgriConnect · सॉफ्टवेयर इंजीनियरिंग प्रोजेक्ट, थापर इंस्टीट्यूट (UCS503P)",
    login: "लॉग इन",
    create_account: "खाता बनाएं",
    logout: "लॉग आउट",
    try_again: "पुनः प्रयास करें",
    please_wait: "कृपया प्रतीक्षा करें…",
    search: "खोजें",
    keep: "रखें",
    unknown: "अज्ञात",
    welcome: "स्वागत है",
    welcome_back: "वापसी पर स्वागत है",
    session_expired: "आपका सत्र समाप्त हो गया। कृपया दोबारा लॉग इन करें।",
    switch_language: "भाषा",

    // Landing Page
    hero_title: "अपनी कीमत तय करने से पहले आज का मंडी भाव जानें।",
    hero_desc: "किसान अपनी उपज पोस्ट करते हैं। खरीदार अपनी जरूरत बताते हैं। हर लिस्टिंग में आज के सरकारी मंडी भाव के साथ प्रति किलो कीमत दिखाई जाती है, ताकि दोनों निष्पक्ष भाव से शुरुआत करें।",
    create_free_acc: "मुफ़्त खाता बनाएं",
    already_have_one: "मेरा पहले से खाता है",
    how_farmers_title: "किसान भाई",
    how_farmers_desc: "मात्रा, गुणवत्ता ग्रेड, स्थान और अपनी मांग कीमत के साथ फसल पोस्ट करें। देखें खरीदार क्या मांग रहे हैं।",
    how_buyers_title: "खरीदार",
    how_buyers_desc: "अपनी आवश्यक मांग और देय मूल्य पोस्ट करें। सभी किसानों की उपलब्ध फसलें देखें।",
    how_both_title: "दोनों के लिए पारदर्शी",
    how_both_desc: "प्रत्येक लिस्टिंग पर मूल्य बार दिखाता है कि तय कीमत सरकारी मंडी औसत से कितनी ऊपर या नीचे है।",

    // Auth
    login_title: "लॉग इन करें",
    register_title: "अपना खाता बनाएं",
    i_am_a: "मेरी भूमिका है",
    role_farmer: "किसान",
    role_buyer: "खरीदार",
    full_name: "पूरा नाम",
    phone_number: "फ़ोन नंबर",
    phone_placeholder: "10 अंकों का मोबाइल नंबर",
    password: "पासवर्ड",
    password_placeholder: "कम से कम 6 अक्षर",
    already_account_q: "क्या आपके पास पहले से खाता है?",
    new_to_agri_q: "AgriConnect पर नए हैं?",

    // Navigation & Shell
    nav_post_farmer: "फसल बेचें",
    nav_mine_farmer: "मेरी फसलें",
    nav_browse_farmer: "खरीदार की मांग",
    nav_post_buyer: "मांग पोस्ट करें",
    nav_mine_buyer: "मेरी मांग",
    nav_browse_buyer: "किसानों की फसलें",
    mandi_rates: "मंडी भाव",
    mandi_rates_today: "नवीनतम मंडी भाव",
    as_of: "{date} तक",
    mandi_rates_sub: "एगमार्कनेट (Agmarknet) से दैनिक सरकारी बाज़ार मूल्य, ₹ प्रति किग्रा में।",
    search_rates_placeholder: "फसल, मंडी या राज्य खोजें",
    rates_count_label: "भाव उपलब्ध",
    no_rates_loaded: "कोई मंडी भाव लोड नहीं हुआ। कृपया backend में prices.csv जांचें।",
    per_kg_source: "₹ प्रति किग्रा · स्रोत: एगमार्कनेट, data.gov.in",

    // Table Headers
    th_crop: "फसल",
    th_market: "मंडी / बाज़ार",
    th_low: "न्यूनतम",
    th_high: "अधिकतम",
    th_avg: "औसत भाव",

    // Listings / Cards
    search_crop_location: "फसल या स्थान से खोजें",
    nothing_matches: '"{q}" से मेल खाता कुछ नहीं मिला। कृपया कोई अन्य फसल या स्थान आज़माएं।',
    posted_on: "पोस्ट किया गया",
    grade_label: "ग्रेड",
    farmer_asks: "आपकी मांग",
    farmer_offers: "ऑफ़र",
    buyer_offers: "आपकी पेशकश",
    buyer_asks: "मांग",
    per_kg: "/किग्रा",
    yes_delete: "हाँ, फसल हटाएं",
    yes_cancel: "हाँ, मांग रद्द करें",
    delete_lot: "फसल हटाएं",
    cancel_demand: "मांग रद्द करें",
    lot_deleted: "फसल हटा दी गई",
    demand_cancelled: "मांग रद्द कर दी गई",

    // Empty States
    farmer_mine_empty: "आपने अभी तक कोई फसल पोस्ट नहीं की है। फसल जोड़ें ताकि खरीदार तुरंत देख सकें।",
    buyer_mine_empty: "आपने अभी तक कोई मांग पोस्ट नहीं की है। पोस्ट करें ताकि किसान तुरंत देख सकें।",
    farmer_browse_empty: "किसी खरीदार ने अभी तक मांग पोस्ट नहीं की है। कृपया थोड़ी देर बाद देखें।",
    buyer_browse_empty: "किसी किसान ने अभी तक फसल पोस्ट नहीं की है। कृपया थोड़ी देर बाद देखें।",
    farmer_lots_hint: "देखें कि अन्य किसान क्या फसलें पोस्ट कर रहे हैं, कीमतों की तुलना करें और बाज़ार का विश्लेषण करें।",
    buyer_demand_hint: "देखें कि खरीदार और व्यापारी क्या खरीदना चाहते हैं और वे क्या कीमत दे रहे हैं।",
    no_lots_yet: "अभी तक किसी किसान ने फसल पोस्ट नहीं की है।",
    no_demand_yet: "अभी तक किसी खरीदार ने मांग पोस्ट नहीं की है।",
    you: "आप",

    // Form: Post Listing
    post_farmer_title: "फसल बेचने के लिए लिस्ट करें",
    post_farmer_hint: "खरीदारों को बताएं आपके पास कौन सी फसल है और आप प्रति किलो क्या भाव चाहते हैं।",
    post_buyer_title: "खरीदने की मांग पोस्ट करें",
    post_buyer_hint: "किसानों को बताएं आपको क्या चाहिए और आप प्रति किलो क्या भाव देंगे।",
    field_crop: "फसल का नाम",
    crop_placeholder: "गेहूं, प्याज, टमाटर, धान…",
    field_quantity: "मात्रा",
    quantity_placeholder: "500 किग्रा या 10 क्विंटल",
    field_quality: "गुणवत्ता ग्रेड",
    grade_a: "A (सर्वोत्तम)",
    grade_b: "B (मध्यम)",
    grade_c: "C (सामान्य)",
    field_location: "स्थान (गाँव / ज़िला)",
    location_placeholder: "गाँव या कस्बा, ज़िला",
    farmer_price_label: "आपकी कीमत (₹ प्रति किग्रा)",
    buyer_price_label: "आप जो कीमत देंगे (₹ प्रति किग्रा)",
    mandi_rate_for: "मंडी भाव",
    average: "औसत",
    publishing: "पोस्ट हो रहा है…",
    publish_farmer_submit: "फसल प्रकाशित करें",
    publish_buyer_submit: "मांग प्रकाशित करें",
    lot_published: "फसल सफलतापूर्वक पोस्ट हो गई",
    demand_published: "मांग सफलतापूर्वक पोस्ट हो गई",

    // RangeBar
    at_mandi_avg: "सरकारी मंडी के औसत भाव पर",
    above_mandi_avg: "% मंडी औसत से अधिक",
    below_mandi_avg: "% मंडी औसत से कम",
    mandi_range_prefix: "मंडी दायरा",
    no_mandi_for_crop: "इस फसल के लिए आज का कोई मंडी भाव उपलब्ध नहीं है।",

    // Chat & Negotiations
    nav_chat: "बातचीत व सौदे",
    chat_negotiate: "बातचीत व मोलभाव",
    start_chat: "संदेश भेजें",
    chat_title: "संदेश और बातचीत",
    search_chats: "बातचीत खोजें…",
    no_conversations: "अभी तक कोई बातचीत नहीं",
    no_conversations_hint: "फसलें या खरीदार मांग देखें और सीधे बातचीत और मोलभाव शुरू करने के लिए 'बातचीत व मोलभाव' पर क्लिक करें।",
    select_conversation: "संदेश भेजने के लिए बातचीत चुनें",
    type_message: "संदेश लिखें…",
    send: "भेजें",
    make_offer: "मूल्य प्रस्ताव दें",
    counter_offer: "नया भाव दें",
    propose_price_title: "प्रति किग्रा नया भाव प्रस्तावित करें",
    propose_price_desc: "सीधे मोलभाव के लिए एक औपचारिक मूल्य प्रस्ताव भेजें।",
    your_offer_price: "आपका प्रस्तावित भाव (₹/किग्रा)",
    send_offer: "प्रस्ताव भेजें",
    cancel: "रद्द करें",
    accept_offer: "प्रस्ताव स्वीकार करें",
    decline_offer: "अस्वीकार करें",
    offer_accepted: "प्रस्ताव स्वीकृत",
    offer_rejected: "प्रस्ताव अस्वीकृत",
    offer_withdrawn: "प्रस्ताव वापस लिया",
    offer_pending: "उत्तर प्रतीक्षित",
    price_offer_banner: "मूल्य प्रस्ताव",
    discussing_item: "विषय",
    quick_replies_label: "त्वरित उत्तर",
    qr_available: "क्या यह अभी उपलब्ध है?",
    qr_pickup: "तुरंत माल उठाने के लिए तैयार हैं।",
    qr_transport: "ट्रांसपोर्ट की क्या व्यवस्था होगी?",
    qr_sample: "क्या आप सैंपल या तस्वीरें भेज सकते हैं?",
    qr_deal: "मुझे सौदा मंजूर है!",
    call_now: "कॉल करें",
    unread: "अपठित",
    back_to_chats: "सभी बातचीत पर वापस जाएं",

    // Deal Confirmation & Payment
    confirm_deal_title: "सौदा व भुगतान पक्का करें",
    confirm_and_pay: "सौदा पक्का करें व भुगतान करें",
    deal_confirmed_badge: "सौदा पक्का हो गया",
    payment_successful: "भुगतान सफल",
    pay_now: "अभी भुगतान करें",
    proceed_to_payment: "भुगतान की ओर बढ़ें",
    view_receipt: "रसीद देखें",
    deal_receipt_title: "एग्रीकनेक्ट सौदा व भुगतान रसीद",
    transaction_id: "लेनदेन संदर्भ संख्या",
    agreed_rate: "तय भाव (₹ प्रति किग्रा)",
    quantity_to_buy: "खरीदी जाने वाली मात्रा",
    quantity_kg_label: "वजन (किलोग्राम में)",
    total_deal_amount: "कुल सौदे का मूल्य",
    choose_payment_plan: "भुगतान की शर्तें",
    plan_advance_title: "अग्रिम बयाना टोकन (20%)",
    plan_advance_desc: "माल आरक्षित करें। शेष राशि गाड़ी तौल व माल उठान पर देय होगी।",
    plan_full_title: "पूर्ण अग्रिम भुगतान (100%)",
    plan_full_desc: "एग्रीकनेक्ट सुरक्षित मंडी एस्क्रो खाते में पूरा भुगतान जमा करें।",
    plan_cod_title: "मंडी डिलीवरी पर भुगतान (COD)",
    plan_cod_desc: "अभी सौदा पक्का करें, पूरा भुगतान माल प्राप्ति व तौल पर दें।",
    amount_payable_now: "अभी देय राशि",
    balance_on_delivery: "डिलीवरी पर शेष देय",
    payment_method_label: "भुगतान का माध्यम",
    method_upi: "यूपीआई (Google Pay, PhonePe, Paytm)",
    method_netbanking: "नेट बैंकिंग",
    method_card: "डेबिट / क्रेडिट कार्ड",
    method_cod: "नकद / सीधी मंडी अदायगी",
    upi_id_placeholder: "UPI ID दर्ज करें (उदा. mobile@upi)",
    pay_securely: "सुरक्षित भुगतान करें ({amount})",
    confirm_deal_btn: "सौदा पक्का करें",
    payment_processing: "सुरक्षित भुगतान प्रक्रिया में है…",
    deal_locked_success: "सौदा सफलतापूर्वक पक्का हो गया! रसीद तैयार है।",
    waiting_buyer_payment: "प्रस्ताव स्वीकृत! खरीदार द्वारा भुगतान व सौदा पक्का करने की प्रतीक्षा है।",
    print_receipt: "रसीद प्रिंट / डाउनलोड करें",
    close: "बंद करें",
    receipt_buyer: "खरीदार का विवरण",
    receipt_farmer: "किसान का विवरण",
    receipt_date: "दिनांक व समय",
    receipt_status: "भुगतान स्थिति",
    receipt_paid: "भुगतान संपन्न / सौदा पक्का",
    secured_by: "एग्रीकनेक्ट मंडी सुरक्षा द्वारा सुरक्षित",
    confirm_lot_received: "माल प्राप्ति की पुष्टि करें",
    confirm_lot_received_title: "फसल प्राप्ति व डिलीवरी पुष्टि",
    confirm_lot_received_desc: "क्या आपने माल प्राप्त कर गुणवत्ता की जांच कर ली है? पुष्टि करने पर यह सौदा पूर्ण माना जाएगा और किसान की फसल व आपकी मांग पूरी होकर डैशबोर्ड से हट जाएगी।",
    confirm_lot_received_btn: "हाँ, मुझे माल प्राप्त हो गया है",
    trade_completed_badge: "व्यापार पूर्ण · माल प्राप्त हुआ",
    awaiting_delivery_badge: "रास्ते में है · डिलीवरी प्रतीक्षित",
    lot_fulfilled_closed: "सौदा पूर्ण · समाप्त",
    confirming_delivery: "डिलीवरी की पुष्टि हो रही है…",
    delivery_confirmed_success: "डिलीवरी की पुष्टि हो गई! व्यापार सफलतापूर्वक संपन्न हुआ।",
    receipt_delivered: "डिलीवरी संपन्न / व्यापार पूर्ण",
  },

  pa: {
    // Brand / Common
    tagline: "AgriConnect · ਕਿਸਾਨਾਂ ਅਤੇ ਖ਼ਰੀਦਦਾਰਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜਦਾ ਹੈ",
    footer_text: "AgriConnect · ਸਾਫ਼ਟਵੇਅਰ ਇੰਜੀਨੀਅਰਿੰਗ ਪ੍ਰੋਜੈਕਟ, ਥਾਪਰ ਇੰਸਟੀਚਿਊਟ (UCS503P)",
    login: "ਲਾਗ ਇਨ",
    create_account: "ਖਾਤਾ ਬਣਾਓ",
    logout: "ਲਾਗ ਆਉਟ",
    try_again: "ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    please_wait: "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ…",
    search: "ਖੋਜੋ",
    keep: "ਰੱਖੋ",
    unknown: "ਅਣਜਾਣ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    welcome_back: "ਮੁੜ ਜੀ ਆਇਆਂ ਨੂੰ",
    session_expired: "ਤੁਹਾਡਾ ਸੈਸ਼ਨ ਖ਼ਤਮ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਲਾਗ ਇਨ ਕਰੋ।",
    switch_language: "ਭਾਸ਼ਾ",

    // Landing Page
    hero_title: "ਆਪਣੀ ਕੀਮਤ ਤੈਅ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਮੰਡੀ ਦਾ ਤਾਜ਼ਾ ਭਾਅ ਜਾਣੋ।",
    hero_desc: "ਕਿਸਾਨ ਆਪਣੀ ਫ਼ਸਲ ਪੋਸਟ ਕਰਦੇ ਹਨ। ਖ਼ਰੀਦਦਾਰ ਆਪਣੀ ਲੋੜ ਦੱਸਦੇ ਹਨ। ਹਰੇਕ ਲਿਸਟਿੰਗ ਵਿੱਚ ਸਰਕਾਰੀ ਮੰਡੀ ਭਾਅ ਦੇ ਨਾਲ ਪ੍ਰਤੀ ਕਿਲੋ ਕੀਮਤ ਦਿਖਾਈ ਜਾਂਦੀ ਹੈ, ਤਾਂ ਜੋ ਦੋਵੇਂ ਪਾਸਿਓਂ ਨਿਰਪੱਖ ਸ਼ੁਰੂਆਤ ਹੋ ਸਕੇ।",
    create_free_acc: "ਮੁਫ਼ਤ ਖਾਤਾ ਬਣਾਓ",
    already_have_one: "ਮੇਰਾ ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ",
    how_farmers_title: "ਕਿਸਾਨ ਵੀਰ",
    how_farmers_desc: "ਮਾਤਰਾ, ਗੁਣਵੱਤਾ ਗਰੇਡ, ਸਥਾਨ ਅਤੇ ਆਪਣੀ ਕੀਮਤ ਨਾਲ ਫ਼ਸਲ ਪੋਸਟ ਕਰੋ। ਦੇਖੋ ਖ਼ਰੀਦਦਾਰ ਕੀ ਮੰਗ ਰਹੇ ਹਨ।",
    how_buyers_title: "ਖ਼ਰੀਦਦਾਰ",
    how_buyers_desc: "ਲੋੜੀਂਦੀ ਫ਼ਸਲ ਅਤੇ ਦੇਣਯੋਗ ਮੁੱਲ ਪੋਸਟ ਕਰੋ। ਕਿਸਾਨਾਂ ਦੀਆਂ ਸਾਰੀਆਂ ਫ਼ਸਲਾਂ ਦੇਖੋ।",
    how_both_title: "ਦੋਵਾਂ ਲਈ ਪਾਰਦਰਸ਼ੀ",
    how_both_desc: "ਹਰੇਕ ਲਿਸਟਿੰਗ 'ਤੇ ਰੇਂਜ ਬਾਰ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ ਮੁੱਲ ਸਰਕਾਰੀ ਮੰਡੀ ਦੀ ਔਸਤ ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਖਰਾ ਹੈ।",

    // Auth
    login_title: "ਲਾਗ ਇਨ ਕਰੋ",
    register_title: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ",
    i_am_a: "ਮੇਰਾ ਰੋਲ ਹੈ",
    role_farmer: "ਕਿਸਾਨ",
    role_buyer: "ਖ਼ਰੀਦਦਾਰ",
    full_name: "ਪੂਰਾ ਨਾਮ",
    phone_number: "ਫ਼ੋਨ ਨੰਬਰ",
    phone_placeholder: "10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ",
    password: "ਪਾਸਵਰਡ",
    password_placeholder: "ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ",
    already_account_q: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    new_to_agri_q: "AgriConnect 'ਤੇ ਨਵੇਂ ਹੋ?",

    // Navigation & Shell
    nav_post_farmer: "ਫ਼ਸਲ ਵੇਚੋ",
    nav_mine_farmer: "ਮੇਰੀਆਂ ਫ਼ਸਲਾਂ",
    nav_browse_farmer: "ਖ਼ਰੀਦਦਾਰਾਂ ਦੀ ਮੰਗ",
    nav_post_buyer: "ਮੰਗ ਪੋਸਟ ਕਰੋ",
    nav_mine_buyer: "ਮੇਰੀ ਮੰਗ",
    nav_browse_buyer: "ਕਿਸਾਨਾਂ ਦੀਆਂ ਫ਼ਸਲਾਂ",
    mandi_rates: "ਮੰਡੀ ਦੇ ਭਾਅ",
    mandi_rates_today: "ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ",
    as_of: "{date} ਤੱਕ",
    mandi_rates_sub: "ਐਗਮਾਰਕਨੈੱਟ (Agmarknet) ਤੋਂ ਸਰਕਾਰੀ ਬਾਜ਼ਾਰ ਭਾਅ, ₹ ਪ੍ਰਤੀ ਕਿਲੋ ਵਿੱਚ।",
    search_rates_placeholder: "ਫ਼ਸਲ, ਮੰਡੀ ਜਾਂ ਸੂਬਾ ਖੋਜੋ",
    rates_count_label: "ਭਾਅ ਉਪਲਬਧ",
    no_rates_loaded: "ਕੋਈ ਮੰਡੀ ਭਾਅ ਲੋਡ ਨਹੀਂ ਹੋਇਆ। ਕਿਰਪਾ ਕਰਕੇ backend ਵਿੱਚ prices.csv ਚੈੱਕ ਕਰੋ।",
    per_kg_source: "₹ ਪ੍ਰਤੀ ਕਿਲੋ · ਸਰੋਤ: ਐਗਮਾਰਕਨੈੱਟ, data.gov.in",

    // Table Headers
    th_crop: "ਫ਼ਸਲ",
    th_market: "ਮੰਡੀ / ਬਾਜ਼ਾਰ",
    th_low: "ਘੱਟੋ-ਘੱਟ",
    th_high: "ਵੱਧ ਤੋਂ ਵੱਧ",
    th_avg: "ਔਸਤ ਭਾਅ",

    // Listings / Cards
    search_crop_location: "ਫ਼ਸਲ ਜਾਂ ਸਥਾਨ ਤੋਂ ਖੋਜੋ",
    nothing_matches: '"{q}" ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੁਝ ਨਹੀਂ ਮਿਲਿਆ। ਕੋਈ ਹੋਰ ਫ਼ਸਲ ਜਾਂ ਸਥਾਨ ਵੇਖੋ।',
    posted_on: "ਪੋਸਟ ਕੀਤਾ ਗਿਆ",
    grade_label: "ਗਰੇਡ",
    farmer_asks: "ਤੁਹਾਡੀ ਮੰਗ",
    farmer_offers: "ਪੇਸ਼ਕਸ਼",
    buyer_offers: "ਤੁਹਾਡੀ ਪੇਸ਼ਕਸ਼",
    buyer_asks: "ਮੰਗ",
    per_kg: "/ਕਿਲੋ",
    yes_delete: "ਹਾਂ, ਫ਼ਸਲ ਹਟਾਓ",
    yes_cancel: "ਹਾਂ, ਮੰਗ ਰੱਦ ਕਰੋ",
    delete_lot: "ਫ਼ਸਲ ਹਟਾਓ",
    cancel_demand: "ਮੰਗ ਰੱਦ ਕਰੋ",
    lot_deleted: "ਫ਼ਸਲ ਹਟਾ ਦਿੱਤੀ ਗਈ ਹੈ",
    demand_cancelled: "ਮੰਗ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ",

    // Empty States
    farmer_mine_empty: "ਤੁਸੀਂ ਅਜੇ ਕੋਈ ਫ਼ਸਲ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ ਹੈ। ਫ਼ਸਲ ਜੋੜੋ ਤਾਂ ਜੋ ਖ਼ਰੀਦਦਾਰ ਤੁਰੰਤ ਦੇਖ ਸਕਣ।",
    buyer_mine_empty: "ਤੁਸੀਂ ਅਜੇ ਕੋਈ ਮੰਗ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ ਹੈ। ਪੋਸਟ ਕਰੋ ਤਾਂ ਜੋ ਕਿਸਾਨ ਤੁਰੰਤ ਦੇਖ ਸਕਣ।",
    farmer_browse_empty: "ਕਿਸੇ ਖ਼ਰੀਦਦਾਰ ਨੇ ਅਜੇ ਮੰਗ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ। ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਵੇਖੋ।",
    buyer_browse_empty: "ਕਿਸੇ ਕਿਸਾਨ ਨੇ ਅਜੇ ਕੋਈ ਫ਼ਸਲ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ। ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਵੇਖੋ।",
    farmer_lots_hint: "ਦੇਖੋ ਕਿ ਦੂਜੇ ਕਿਸਾਨ ਕਿਹੜੀਆਂ ਫ਼ਸਲਾਂ ਪੋਸਟ ਕਰ ਰਹੇ ਹਨ, ਭਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ ਅਤੇ ਮੰਡੀ ਦਾ ਜਾਇਜ਼ਾ ਲਵੋ।",
    buyer_demand_hint: "ਦੇਖੋ ਕਿ ਖਰੀਦਦਾਰ ਅਤੇ ਵਪਾਰੀ ਕੀ ਖਰੀਦਣਾ ਚਾਹੁੰਦੇ ਹਨ ਅਤੇ ਉਹ ਕੀ ਭਾਅ ਦੇ ਰਹੇ ਹਨ।",
    no_lots_yet: "ਅਜੇ ਤੱਕ ਕਿਸੇ ਕਿਸਾਨ ਨੇ ਫ਼ਸਲ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ ਹੈ।",
    no_demand_yet: "ਅਜੇ ਤੱਕ ਕਿਸੇ ਖਰੀਦਦਾਰ ਨੇ ਮੰਗ ਪੋਸਟ ਨਹੀਂ ਕੀਤੀ ਹੈ।",
    you: "ਤੁਸੀਂ",

    // Form: Post Listing
    post_farmer_title: "ਫ਼ਸਲ ਵੇਚਣ ਲਈ ਲਿਸਟ ਕਰੋ",
    post_farmer_hint: "ਖ਼ਰੀਦਦਾਰਾਂ ਨੂੰ ਦੱਸੋ ਤੁਹਾਡੇ ਕੋਲ ਕਿਹੜੀ ਫ਼ਸਲ ਹੈ ਅਤੇ ਤੁਸੀਂ ਪ੍ਰਤੀ ਕਿਲੋ ਕੀ ਭਾਅ ਚਾਹੁੰਦੇ ਹੋ।",
    post_buyer_title: "ਖ਼ਰੀਦਣ ਦੀ ਮੰਗ ਪੋਸਟ ਕਰੋ",
    post_buyer_hint: "ਕਿਸਾਨਾਂ ਨੂੰ ਦੱਸੋ ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ ਅਤੇ ਤੁਸੀਂ ਪ੍ਰਤੀ ਕਿਲੋ ਕੀ ਭਾਅ ਦੇਵੋਗੇ।",
    field_crop: "ਫ਼ਸਲ ਦਾ ਨਾਮ",
    crop_placeholder: "ਕਣਕ, ਪਿਆਜ਼, ਟਮਾਟਰ, ਝੋਨਾ…",
    field_quantity: "ਮਾਤਰਾ",
    quantity_placeholder: "500 ਕਿਲੋ ਜਾਂ 10 ਕੁਇੰਟਲ",
    field_quality: "ਗੁਣਵੱਤਾ ਗਰੇਡ",
    grade_a: "A (ਸਭ ਤੋਂ ਵਧੀਆ)",
    grade_b: "B (ਦਰਮਿਆਨਾ)",
    grade_c: "C (ਸਧਾਰਨ)",
    field_location: "ਸਥਾਨ (ਪਿੰਡ / ਜ਼ਿਲ੍ਹਾ)",
    location_placeholder: "ਪਿੰਡ ਜਾਂ ਕਸਬਾ, ਜ਼ਿਲ੍ਹਾ",
    farmer_price_label: "ਤੁਹਾਡੀ ਕੀਮਤ (₹ ਪ੍ਰਤੀ ਕਿਲੋ)",
    buyer_price_label: "ਤੁਸੀਂ ਜੋ ਕੀਮਤ ਦੇਵੋਗੇ (₹ ਪ੍ਰਤੀ ਕਿਲੋ)",
    mandi_rate_for: "ਮੰਡੀ ਦਾ ਭਾਅ",
    average: "ਔਸਤ",
    publishing: "ਪੋਸਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ…",
    publish_farmer_submit: "ਫ਼ਸਲ ਪੋਸਟ ਕਰੋ",
    publish_buyer_submit: "ਮੰਗ ਪੋਸਟ ਕਰੋ",
    lot_published: "ਫ਼ਸਲ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪੋਸਟ ਹੋ ਗਈ ਹੈ",
    demand_published: "ਮੰਗ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪੋਸਟ ਹੋ ਗਈ ਹੈ",

    // RangeBar
    at_mandi_avg: "ਸਰਕਾਰੀ ਮੰਡੀ ਦੀ ਔਸਤ ਕੀਮਤ 'ਤੇ",
    above_mandi_avg: "% ਮੰਡੀ ਦੀ ਔਸਤ ਨਾਲੋਂ ਵੱਧ",
    below_mandi_avg: "% ਮੰਡੀ ਦੀ ਔਸਤ ਨਾਲੋਂ ਘੱਟ",
    mandi_range_prefix: "ਮੰਡੀ ਦਾ ਦਾਇਰਾ",
    no_mandi_for_crop: "ਇਸ ਫ਼ਸਲ ਦਾ ਅੱਜ ਦਾ ਕੋਈ ਮੰਡੀ ਭਾਅ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",

    // Chat & Negotiations
    nav_chat: "ਗੱਲਬਾਤ ਤੇ ਸੌਦੇ",
    chat_negotiate: "ਗੱਲਬਾਤ ਤੇ ਮੁੱਲ-ਤੋਲ",
    start_chat: "ਸੁਨੇਹਾ ਭੇਜੋ",
    chat_title: "ਸੁਨੇਹੇ ਅਤੇ ਗੱਲਬਾਤ",
    search_chats: "ਗੱਲਬਾਤ ਖੋਜੋ…",
    no_conversations: "ਅਜੇ ਕੋਈ ਗੱਲਬਾਤ ਨਹੀਂ",
    no_conversations_hint: "ਫ਼ਸਲਾਂ ਜਾਂ ਖ਼ਰੀਦਦਾਰ ਮੰਗ ਵੇਖੋ ਅਤੇ ਸਿੱਧੀ ਗੱਲਬਾਤ ਅਤੇ ਮੁੱਲ-ਤੋਲ ਸ਼ੁਰੂ ਕਰਨ ਲਈ 'ਗੱਲਬਾਤ ਤੇ ਮੁੱਲ-ਤੋਲ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    select_conversation: "ਸੁਨੇਹਾ ਭੇਜਣ ਲਈ ਗੱਲਬਾਤ ਚੁਣੋ",
    type_message: "ਸੁਨੇਹਾ ਲਿਖੋ…",
    send: "ਭੇਜੋ",
    make_offer: "ਕੀਮਤ ਪੇਸ਼ਕਸ਼ ਕਰੋ",
    counter_offer: "ਨਵੀਂ ਕੀਮਤ ਦਿਓ",
    propose_price_title: "ਪ੍ਰਤੀ ਕਿਲੋ ਨਵੀਂ ਕੀਮਤ ਪੇਸ਼ ਕਰੋ",
    propose_price_desc: "ਸਿੱਧੇ ਮੁੱਲ-ਤੋਲ ਲਈ ਰਸਮੀ ਕੀਮਤ ਪੇਸ਼ਕਸ਼ ਭੇਜੋ।",
    your_offer_price: "ਤੁਹਾਡੀ ਪੇਸ਼ਕਸ਼ ਕੀਮਤ (₹/ਕਿਲੋ)",
    send_offer: "ਪੇਸ਼ਕਸ਼ ਭੇਜੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    accept_offer: "ਪੇਸ਼ਕਸ਼ ਸਵੀਕਾਰ ਕਰੋ",
    decline_offer: "ਅਸਵੀਕਾਰ ਕਰੋ",
    offer_accepted: "ਪੇਸ਼ਕਸ਼ ਸਵੀਕਾਰ ਕੀਤੀ",
    offer_rejected: "ਪੇਸ਼ਕਸ਼ ਅਸਵੀਕਾਰ ਕੀਤੀ",
    offer_withdrawn: "ਪੇਸ਼ਕਸ਼ ਵਾਪਸ ਲਈ",
    offer_pending: "ਜਵਾਬ ਦੀ ਉਡੀਕ",
    price_offer_banner: "ਕੀਮਤ ਪੇਸ਼ਕਸ਼",
    discussing_item: "ਚਰਚਾ ਅਧੀਨ",
    quick_replies_label: "ਤੁਰੰਤ ਜਵਾਬ",
    qr_available: "ਕੀ ਇਹ ਅਜੇ ਉਪਲਬਧ ਹੈ?",
    qr_pickup: "ਤੁਰੰਤ ਮਾਲ ਚੁੱਕਣ ਲਈ ਤਿਆਰ ਹਾਂ।",
    qr_transport: "ਟਰਾਂਸਪੋਰਟ ਦਾ ਕੀ ਪ੍ਰਬੰਧ ਹੋਵੇਗਾ?",
    qr_sample: "ਕੀ ਤੁਸੀਂ ਸੈਂਪਲ ਜਾਂ ਤਸਵੀਰਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
    qr_deal: "ਮੈਨੂੰ ਸੌਦਾ ਮਨਜ਼ੂਰ ਹੈ!",
    call_now: "ਕਾਲ ਕਰੋ",
    unread: "ਅਣਪੜ੍ਹੇ",
    back_to_chats: "ਸਾਰੀਆਂ ਗੱਲਬਾਤਾਂ 'ਤੇ ਵਾਪਸ ਜਾਓ",

    // Deal Confirmation & Payment
    confirm_deal_title: "ਸੌਦਾ ਅਤੇ ਭੁਗਤਾਨ ਪੱਕਾ ਕਰੋ",
    confirm_and_pay: "ਸੌਦਾ ਪੱਕਾ ਕਰੋ ਤੇ ਭੁਗਤਾਨ ਕਰੋ",
    deal_confirmed_badge: "ਸੌਦਾ ਪੱਕਾ ਹੋ ਗਿਆ",
    payment_successful: "ਭੁਗਤਾਨ ਸਫ਼ਲ",
    pay_now: "ਹੁਣੇ ਭੁਗਤਾਨ ਕਰੋ",
    proceed_to_payment: "ਭੁਗਤਾਨ ਲਈ ਅੱਗੇ ਵਧੋ",
    view_receipt: "ਰਸੀਦ ਦੇਖੋ",
    deal_receipt_title: "ਐਗਰੀਕਨੈਕਟ ਸੌਦਾ ਅਤੇ ਭੁਗਤਾਨ ਰਸੀਦ",
    transaction_id: "ਲੈਣ-ਦੇਣ ਨੰਬਰ",
    agreed_rate: "ਤੈਅ ਭਾਅ (₹ ਪ੍ਰਤੀ ਕਿਲੋ)",
    quantity_to_buy: "ਖ਼ਰੀਦੀ ਜਾਣ ਵਾਲੀ ਮਾਤਰਾ",
    quantity_kg_label: "ਭਾਰ (ਕਿਲੋਗ੍ਰਾਮ ਵਿੱਚ)",
    total_deal_amount: "ਕੁੱਲ ਸੌਦੇ ਦਾ ਮੁੱਲ",
    choose_payment_plan: "ਭੁਗਤਾਨ ਦੀਆਂ ਸ਼ਰਤਾਂ",
    plan_advance_title: "ਪੇਸ਼ਗੀ ਬਿਆਨਾ ਟੋਕਨ (20%)",
    plan_advance_desc: "ਮਾਲ ਪੱਕਾ ਕਰੋ। ਬਾਕੀ ਰਕਮ ਗੱਡੀ ਤੋਲ ਅਤੇ ਮਾਲ ਚੁੱਕਣ ਵੇਲੇ ਦੇਣੀ ਹੋਵੇਗੀ।",
    plan_full_title: "ਪੂਰਾ ਭੁਗਤਾਨ (100%)",
    plan_full_desc: "ਐਗਰੀਕਨੈਕਟ ਸੁਰੱਖਿਅਤ ਮੰਡੀ ਖਾਤੇ ਵਿੱਚ ਪੂਰਾ ਭੁਗਤਾਨ ਜਮ੍ਹਾਂ ਕਰੋ।",
    plan_cod_title: "ਮੰਡੀ ਡਿਲੀਵਰੀ ਵੇਲੇ ਭੁਗਤਾਨ (COD)",
    plan_cod_desc: "ਹੁਣੇ ਸੌਦਾ ਪੱਕਾ ਕਰੋ, ਪੂਰਾ ਭੁਗਤਾਨ ਮਾਲ ਮਿਲਣ 'ਤੇ ਦਿਓ।",
    amount_payable_now: "ਹੁਣੇ ਦੇਣਯੋਗ ਰਕਮ",
    balance_on_delivery: "ਡਿਲੀਵਰੀ ਵੇਲੇ ਬਾਕੀ ਰਕਮ",
    payment_method_label: "ਭੁਗਤਾਨ ਦਾ ਤਰੀਕਾ",
    method_upi: "ਯੂ.ਪੀ.ਆਈ (Google Pay, PhonePe, Paytm)",
    method_netbanking: "ਨੈੱਟ ਬੈਂਕਿੰਗ",
    method_card: "ਡੈਬਿਟ / ਕ੍ਰੈਡਿਟ ਕਾਰਡ",
    method_cod: "ਨਕਦ / ਸਿੱਧੀ ਮੰਡੀ ਅਦਾਇਗੀ",
    upi_id_placeholder: "UPI ID ਦਰਜ ਕਰੋ (ਜਿਵੇਂ mobile@upi)",
    pay_securely: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਕਰੋ ({amount})",
    confirm_deal_btn: "ਸੌਦਾ ਪੱਕਾ ਕਰੋ",
    payment_processing: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਅਧੀਨ ਹੈ…",
    deal_locked_success: "ਸੌਦਾ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪੱਕਾ ਹੋ ਗਿਆ! ਰਸੀਦ ਤਿਆਰ ਹੈ।",
    waiting_buyer_payment: "ਪੇਸ਼ਕਸ਼ ਸਵੀਕਾਰ ਕੀਤੀ ਗਈ! ਖ਼ਰੀਦਦਾਰ ਵੱਲੋਂ ਭੁਗਤਾਨ ਅਤੇ ਸੌਦਾ ਪੱਕਾ ਕਰਨ ਦੀ ਉਡੀਕ ਹੈ।",
    print_receipt: "ਰਸੀਦ ਪ੍ਰਿੰਟ / ਡਾਊਨਲੋਡ ਕਰੋ",
    close: "ਬੰਦ ਕਰੋ",
    receipt_buyer: "ਖ਼ਰੀਦਦਾਰ ਦਾ ਵੇਰਵਾ",
    receipt_farmer: "ਕਿਸਾਨ ਦਾ ਵੇਰਵਾ",
    receipt_date: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ",
    receipt_status: "ਭੁਗਤਾਨ ਸਥਿਤੀ",
    receipt_paid: "ਭੁਗਤਾਨ ਸੰਪੰਨ / ਸੌਦਾ ਪੱਕਾ",
    secured_by: "ਐਗਰੀਕਨੈਕਟ ਮੰਡੀ ਸੁਰੱਖਿਆ ਦੁਆਰਾ ਸੁਰੱਖਿਅਤ",
    confirm_lot_received: "ਮਾਲ ਪ੍ਰਾਪਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    confirm_lot_received_title: "ਫ਼ਸਲ ਪ੍ਰਾਪਤੀ ਤੇ ਡਿਲੀਵਰੀ ਪੁਸ਼ਟੀ",
    confirm_lot_received_desc: "ਕੀ ਤੁਸੀਂ ਮਾਲ ਪ੍ਰਾਪਤ ਕਰਕੇ ਜਾਂਚ ਕਰ ਲਈ ਹੈ? ਪੁਸ਼ਟੀ ਕਰਨ 'ਤੇ ਇਹ ਵਪਾਰ ਪੂਰਾ ਮੰਨਿਆ ਜਾਵੇਗਾ ਅਤੇ ਕਿਸਾਨ ਦੀ ਫ਼ਸਲ ਤੇ ਤੁਹਾਡੀ ਮੰਗ ਪੂਰੀ ਹੋ ਕੇ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਹਟ ਜਾਵੇਗੀ।",
    confirm_lot_received_btn: "ਹਾਂ, ਮੈਨੂੰ ਮਾਲ ਪ੍ਰਾਪਤ ਹੋ ਗਿਆ ਹੈ",
    trade_completed_badge: "ਵਪਾਰ ਪੂਰਾ · ਮਾਲ ਪ੍ਰਾਪਤ ਹੋਇਆ",
    awaiting_delivery_badge: "ਰਸਤੇ ਵਿੱਚ ਹੈ · ਡਿਲੀਵਰੀ ਉਡੀਕੀ ਜਾ ਰਹੀ ਹੈ",
    lot_fulfilled_closed: "ਸੌਦਾ ਪੂਰਾ · ਸਮਾਪਤ",
    confirming_delivery: "ਡਿਲੀਵਰੀ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਰਹੀ ਹੈ…",
    delivery_confirmed_success: "ਡਿਲੀਵਰੀ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ! ਵਪਾਰ ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਹੋਇਆ।",
    receipt_delivered: "ਡਿਲੀਵਰੀ ਸੰਪੰਨ / ਵਪਾਰ ਪੂਰਾ",
  },
};

export const LANG_KEY = "agriconnect.lang";

export function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch {
    /* fallback to default */
  }
  return "en";
}

export function saveLanguage(code) {
  try {
    localStorage.setItem(LANG_KEY, code);
  } catch {
    /* storage blocked */
  }
}

/**
 * Translations for common agricultural commodities and mandi crops.
 */
export const CROP_TRANSLATIONS = {
  cabbage: { hi: "पत्ता गोभी", pa: "ਬੰਦ ਗੋਭੀ" },
  "bengal gram": { hi: "चना", pa: "ਛੋਲੇ" },
  "indian beans": { hi: "सेम फली", pa: "ਸੇਮ ਫ਼ਲੀਆਂ" },
  "banana - green": { hi: "कच्चा केला", pa: "ਹਰਾ ਕੇਲਾ" },
  banana: { hi: "केला", pa: "ਕੇਲਾ" },
  orange: { hi: "संतरा", pa: "ਸੰਤਰਾ" },
  snakeguard: { hi: "चिचिंडा", pa: "ਚਚਿੰਡਾ" },
  "snake gourd": { hi: "चिचिंडा", pa: "ਚਚਿੰਡਾ" },
  ginger: { hi: "अदरक", pa: "ਅਦਰਕ" },
  onion: { hi: "प्याज", pa: "ਪਿਆਜ਼" },
  cucumbar: { hi: "खीरा", pa: "ਖੀਰਾ" },
  cucumber: { hi: "खीरा", pa: "ਖੀਰਾ" },
  cowpea: { hi: "लोबिया", pa: "ਲੋਬੀਆ" },
  wheat: { hi: "गेहूं", pa: "ਕਣਕ" },
  rice: { hi: "चावल / धान", pa: "ਚੌਲ / ਝੋਨਾ" },
  paddy: { hi: "धान", pa: "ਝੋਨਾ" },
  tomato: { hi: "टमाटर", pa: "ਟਮਾਟਰ" },
  potato: { hi: "आलू", pa: "ਆਲੂ" },
  mustard: { hi: "सरसों", pa: "ਸਰ੍ਹੋਂ" },
  cotton: { hi: "कपास", pa: "ਕਪਾਹ" },
  maize: { hi: "मक्का", pa: "ਮੱਕੀ" },
  corn: { hi: "मक्का", pa: "ਮੱਕੀ" },
  apple: { hi: "सेब", pa: "ਸੇਬ" },
  garlic: { hi: "लहसुन", pa: "ਲਸਣ" },
  chilli: { hi: "मिर्च", pa: "ਮਿਰਚ" },
  "green chilli": { hi: "हरी मिर्च", pa: "ਹਰੀ ਮਿਰਚ" },
  cauliflower: { hi: "फूलगोभी", pa: "ਫੁੱਲ ਗੋਭੀ" },
  brinjal: { hi: "बैंगन", pa: "ਬੈਂਗਣ" },
  eggplant: { hi: "बैंगन", pa: "ਬੈਂਗਣ" },
  bhindi: { hi: "भिंडी", pa: "ਭਿੰਡੀ" },
  okra: { hi: "भिंडी", pa: "ਭਿੰਡੀ" },
  peas: { hi: "मटर", pa: "ਮਟਰ" },
  "green peas": { hi: "हरे मटर", pa: "ਹਰੇ ਮਟਰ" },
  carrot: { hi: "गाजर", pa: "ਗਾਜਰ" },
  spinach: { hi: "पालक", pa: "ਪਾਲਕ" },
  radish: { hi: "मूली", pa: "ਮੂਲੀ" },
  coriander: { hi: "धनिया", pa: "ਧਨੀਆ" },
  mango: { hi: "आम", pa: "ਅੰਬ" },
  guava: { hi: "अमरूद", pa: "ਅਮਰੂਦ" },
  papaya: { hi: "पपीता", pa: "ਪਪੀਤਾ" },
  sugarcane: { hi: "गन्ना", pa: "ਗੰਨਾ" },
  barley: { hi: "जौ", pa: "ਜੌਂ" },
  bajra: { hi: "बाजरा", pa: "ਬਾਜਰਾ" },
  jowar: { hi: "ज्वार", pa: "ਜੁਆਰ" },
  moong: { hi: "मूंग", pa: "ਮੂੰਗ" },
  urad: { hi: "उड़द", pa: "ਮਾਂਹ (ਉੜਦ)" },
  arhar: { hi: "अरहर", pa: "ਅਰਹਰ" },
  soyabean: { hi: "सोयाबीन", pa: "ਸੋਇਆਬੀਨ" },
  groundnut: { hi: "मूंगफली", pa: "ਮੂੰਗਫਲੀ" },
};

/**
 * Translations for Indian States.
 */
export const STATE_TRANSLATIONS = {
  odisha: { hi: "ओडिशा", pa: "ਓਡੀਸ਼ਾ" },
  chattisgarh: { hi: "छत्तीसगढ़", pa: "ਛੱਤੀਸਗੜ੍ਹ" },
  chhattisgarh: { hi: "छत्तीसगढ़", pa: "ਛੱਤੀਸਗੜ੍ਹ" },
  tripura: { hi: "त्रिपुरा", pa: "ਤ੍ਰਿਪੁਰਾ" },
  keralam: { hi: "केरल", pa: "ਕੇਰਲ" },
  kerala: { hi: "केरल", pa: "ਕੇਰਲ" },
  punjab: { hi: "पंजाब", pa: "ਪੰਜਾਬ" },
  haryana: { hi: "हरियाणा", pa: "ਹਰਿਆਣਾ" },
  rajasthan: { hi: "राजस्थान", pa: "ਰਾਜਸਥਾਨ" },
  "uttar pradesh": { hi: "उत्तर प्रदेश", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼" },
  "madhya pradesh": { hi: "मध्य प्रदेश", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼" },
  gujarat: { hi: "गुजरात", pa: "ਗੁਜਰਾਤ" },
  maharashtra: { hi: "महाराष्ट्र", pa: "ਮਹਾਰਾਸ਼ਟਰ" },
  "himachal pradesh": { hi: "हिमाचल प्रदेश", pa: "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼" },
  "west bengal": { hi: "पश्चिम बंगाल", pa: "ਪੱਛਮੀ ਬੰਗਾਲ" },
  bihar: { hi: "बिहार", pa: "ਬਿਹਾਰ" },
  jharkhand: { hi: "झारखंड", pa: "ਝਾਰਖੰਡ" },
  uttarakhand: { hi: "उत्तराखंड", pa: "ਉੱਤਰਾਖੰਡ" },
  karnataka: { hi: "कर्नाटक", pa: "ਕਰਨਾਟਕ" },
  "tamil nadu": { hi: "तमिलनाडु", pa: "ਤਮਿਲਨਾਡੂ" },
  "andhra pradesh": { hi: "आंध्र प्रदेश", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼" },
  telangana: { hi: "तेलंगाना", pa: "ਤੇਲੰਗਾਨਾ" },
  assam: { hi: "असम", pa: "ਅਸਾਮ" },
};

/**
 * Translations for Mandi Markets.
 */
export const MARKET_TRANSLATIONS = {
  baripada: { hi: "बारीपदा", pa: "ਬਾਰੀਪਦਾ" },
  "baripada apmc": { hi: "बारीपदा मंडी", pa: "ਬਾਰੀਪਦਾ ਮੰਡੀ" },
  kheragarh: { hi: "खेरागढ़", pa: "ਖੇਰਾਗੜ੍ਹ" },
  "kheragarh apmc": { hi: "खेरागढ़ मंडी", pa: "ਖੇਰਾਗੜ੍ਹ ਮੰਡੀ" },
  kulai: { hi: "कुलाई", pa: "ਕੁਲਾਈ" },
  "kulai apmc": { hi: "कुलाई मंडी", pa: "ਕੁਲਾਈ ਮੰਡੀ" },
  "mukkom market": { hi: "मुक्कम बाज़ार", pa: "ਮੁੱਕਮ ਬਾਜ਼ਾਰ" },
  mukkom: { hi: "मुक्कम", pa: "ਮੁੱਕਮ" },
  khanna: { hi: "ਖੰਨਾ", pa: "ਖੰਨਾ" },
  ludhiana: { hi: "लुधियाना", pa: "ਲੁਧਿਆਣਾ" },
  patiala: { hi: "पटियाला", pa: "ਪਟਿਆਲਾ" },
  jalandhar: { hi: "जालंधर", pa: "ਜਲੰਧਰ" },
  amritsar: { hi: "अमृतसर", pa: "ਅੰਮ੍ਰਿਤਸਰ" },
  bathinda: { hi: "बठिंडा", pa: "ਬਠਿੰਡਾ" },
};

/**
 * Translates a crop name according to the active language.
 */
export function translateCrop(crop, lang = "en") {
  if (!crop) return "";
  const clean = crop.replace(/\(.*?\)/g, "").trim();
  if (lang === "en") return clean;

  const key = clean.toLowerCase();
  if (CROP_TRANSLATIONS[key]?.[lang]) {
    return CROP_TRANSLATIONS[key][lang];
  }

  // Substring check for compound names like "Bengal Gram(Gram)(Whole)" or "Ginger(Green)"
  for (const [k, v] of Object.entries(CROP_TRANSLATIONS)) {
    if (key.includes(k) && v[lang]) {
      return v[lang];
    }
  }

  return clean;
}

/**
 * Translates a market name according to the active language.
 */
export function translateMarket(market, lang = "en") {
  if (!market) return "";
  const clean = market.replace(/ APMC$/i, "").trim();
  if (lang === "en") return clean;

  const key = clean.toLowerCase();
  if (MARKET_TRANSLATIONS[key]?.[lang]) {
    return MARKET_TRANSLATIONS[key][lang];
  }

  return clean;
}

/**
 * Translates an Indian state name according to the active language.
 */
export function translateState(state, lang = "en") {
  if (!state) return "";
  const clean = state.trim();
  if (lang === "en") return clean;

  const key = clean.toLowerCase();
  if (STATE_TRANSLATIONS[key]?.[lang]) {
    return STATE_TRANSLATIONS[key][lang];
  }

  return clean;
}

// -------------------------------------------------------------
// Indic Numerals & Unit Normalization
// -------------------------------------------------------------
export const INDIC_DIGITS = {
  // Devanagari numerals ०-९
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  // Gurmukhi numerals ੦-੯
  "੦": "0", "੧": "1", "੨": "2", "੩": "3", "੪": "4",
  "੫": "5", "੬": "6", "੭": "7", "੮": "8", "੯": "9",
};

export function normalizeDigits(str) {
  if (!str) return "";
  return String(str).replace(/[०-९੦-੯]/g, (ch) => INDIC_DIGITS[ch] || ch);
}

export const UNIT_CATALOG = [
  {
    en: "Quintal",
    enPlural: "Quintal",
    hi: "क्विंटल",
    pa: "ਕੁਇੰਟਲ",
    aliases: ["quintal", "quintals", "qtl", "qtls", "क्विंटल", "कुंतल", "ਕੁਇੰਟਲ", "ਕੁਇੰਟਲ਼"],
  },
  {
    en: "kg",
    enPlural: "kg",
    hi: "किग्रा",
    pa: "ਕਿਲੋ",
    aliases: ["kg", "kgs", "kilo", "kilos", "kilogram", "kilograms", "किग्रा", "कि.ग्रा.", "किलो", "ਕਿਲੋ", "ਕਿਗ੍ਰਾ", "ਕਿਲੋਗ੍ਰਾਮ"],
  },
  {
    en: "Bags",
    enSingular: "Bag",
    hi: "बोरी",
    pa: "ਬੋਰੀਆਂ",
    aliases: ["bag", "bags", "बोरी", "बोरीयां", "बोरीयाँ", "बोरीयों", "बोरे", "ਬੋਰੀ", "ਬੋਰੀਆਂ", "ਬੋਰੇ"],
  },
  {
    en: "Crates",
    enSingular: "Crate",
    hi: "क्रेट",
    pa: "ਕ੍ਰੇਟ",
    aliases: ["crate", "crates", "क्रेट", "क्रे़ट", "क्रेट्स", "ਕ੍ਰੇਟ", "ਕਰੇਟ"],
  },
  {
    en: "Tons",
    enSingular: "Ton",
    hi: "टन",
    pa: "ਟਨ",
    aliases: ["ton", "tons", "tonne", "tonnes", "टन", "ਟਨ"],
  },
  {
    en: "Trolley",
    enSingular: "Trolley",
    hi: "ट्रॉली",
    pa: "ਟਰਾਲੀ",
    aliases: ["trolley", "trollies", "ट्रॉली", "ट्राली", "ਟਰਾਲੀ"],
  },
  {
    en: "Maund",
    enSingular: "Maund",
    hi: "मन",
    pa: "ਮਣ",
    aliases: ["maund", "maunds", "mon", "mann", "मन", "ਮਣ"],
  },
];

/**
 * Translates and normalizes quantity strings (e.g. '80 ਕੁਇੰਟਲ', '50 ਬੋਰੀਆਂ', '1000 किग्रा')
 * according to the active language.
 */
export function translateQuantity(quantityStr, lang = "en") {
  if (!quantityStr) return "";
  const raw = String(quantityStr).trim();
  if (!raw) return "";

  const withAsciiDigits = normalizeDigits(raw);

  const match = withAsciiDigits.match(/^([\d.,]+)\s*(.*)$/);
  if (match) {
    const num = match[1];
    const unitPart = match[2].trim().toLowerCase();
    if (!unitPart) {
      return num;
    }

    for (const entry of UNIT_CATALOG) {
      if (entry.aliases.some((alias) => unitPart === alias || unitPart.startsWith(alias) || alias.startsWith(unitPart))) {
        if (lang === "en") {
          const unit = Number(num) === 1 ? (entry.enSingular || entry.en) : (entry.enPlural || entry.en);
          return `${num} ${unit}`;
        }
        return `${num} ${entry[lang] || entry.en}`;
      }
    }

    return `${num} ${match[2].trim()}`;
  }

  for (const entry of UNIT_CATALOG) {
    for (const alias of entry.aliases) {
      if (withAsciiDigits.toLowerCase().includes(alias)) {
        const replacement = entry[lang] || entry.en;
        return withAsciiDigits.replace(new RegExp(alias, "gi"), replacement);
      }
    }
  }

  return withAsciiDigits;
}

// -------------------------------------------------------------
// Location Normalization & Translation
// -------------------------------------------------------------
export const LOCATION_CATALOG = [
  // Punjab
  { en: "Jalandhar", hi: "जालंधर", pa: "ਜਲੰਧਰ", aliases: ["jalandhar", "जालंधर", "ਜਲੰਧਰ"] },
  { en: "Ludhiana", hi: "लुधियाना", pa: "ਲੁਧਿਆਣਾ", aliases: ["ludhiana", "लुधियाना", "ਲੁਧਿਆਣਾ"] },
  { en: "Amritsar", hi: "अमृतसर", pa: "ਅੰਮ੍ਰਿਤਸਰ", aliases: ["amritsar", "अमृतसर", "ਅੰਮ੍ਰਿਤਸਰ"] },
  { en: "Patiala", hi: "पटियाला", pa: "ਪਟਿਆਲਾ", aliases: ["patiala", "पटियाला", "ਪਟਿਆਲਾ"] },
  { en: "Bathinda", hi: "बठिंडा", pa: "ਬਠਿੰਡਾ", aliases: ["bathinda", "बठिंडा", "ਬਠਿੰਡਾ", "ਭਟਿੰਡਾ"] },
  { en: "Khanna", hi: "खन्ना", pa: "ਖੰਨਾ", aliases: ["khanna", "ਖੰਨਾ", "खन्ना"] },
  { en: "Moga", hi: "मोगा", pa: "ਮੋਗਾ", aliases: ["moga", "मोगा", "ਮੋਗਾ"] },
  { en: "Hoshiarpur", hi: "होशियारपुर", pa: "ਹੁਸ਼ਿਆਰਪੁਰ", aliases: ["hoshiarpur", "होशियारपुर", "ਹੁਸ਼ਿਆਰਪੁਰ"] },
  { en: "Mohali", hi: "मोहाली", pa: "ਮੋਹਾਲੀ", aliases: ["mohali", "मोहाली", "ਮੋਹਾਲੀ", "sas nagar"] },
  { en: "Firozpur", hi: "फ़िरोज़पुर", pa: "ਫ਼ਿਰੋਜ਼ਪੁਰ", aliases: ["firozpur", "ferozepur", "फ़िरोज़पुर", "ਫ਼ਿਰੋਜ਼ਪੁਰ"] },
  { en: "Sangrur", hi: "संगरूर", pa: "ਸੰਗਰੂਰ", aliases: ["sangrur", "संगरूर", "ਸੰਗਰੂਰ"] },
  { en: "Gurdaspur", hi: "गुरदासपुर", pa: "ਗੁਰਦਾਸਪੁਰ", aliases: ["gurdaspur", "गुरदासपुर", "ਗੁਰਦਾਸਪੁਰ"] },
  { en: "Kapurthala", hi: "कपूरथला", pa: "ਕਪੂਰਥਲਾ", aliases: ["kapurthala", "कपूरथला", "ਕਪੂਰਥਲਾ"] },
  { en: "Pathankot", hi: "पठानकोट", pa: "ਪਠਾਨਕੋਟ", aliases: ["pathankot", "पठानकोट", "ਪਠਾਨਕੋਟ"] },
  { en: "Muktsar", hi: "मुक्तसर", pa: "ਮੁਕਤਸਰ", aliases: ["muktsar", "मुक्तसर", "ਮੁਕਤਸਰ"] },
  { en: "Faridkot", hi: "फरीदकोट", pa: "ਫ਼ਰੀਦਕੋਟ", aliases: ["faridkot", "फरीदकोट", "ਫ਼ਰੀਦਕੋਟ"] },
  { en: "Barnala", hi: "बरनाला", pa: "ਬਰਨਾਲਾ", aliases: ["barnala", "बरनाला", "ਬਰਨਾਲਾ"] },
  { en: "Rupnagar", hi: "रूपनगर", pa: "ਰੂਪਨਗਰ", aliases: ["rupnagar", "ropar", "रूपनगर", "ਰੂਪਨਗਰ"] },
  { en: "Fazilka", hi: "फ़ाज़िल्का", pa: "ਫ਼ਾਜ਼ਿਲਕਾ", aliases: ["fazilka", "फ़ाज़िल्का", "ਫ਼ਾਜ਼ਿਲਕਾ"] },
  { en: "Tarn Taran", hi: "तरनतारन", pa: "ਤਰਨ ਤਾਰਨ", aliases: ["tarn taran", "tarntaran", "तरनतारन", "ਤਰਨ ਤਾਰਨ"] },
  { en: "Mansa", hi: "मानसा", pa: "ਮਾਨਸਾ", aliases: ["mansa", "मानसा", "ਮਾਨਸਾ"] },

  // Haryana
  { en: "Karnal", hi: "करनाल", pa: "ਕਰਨਾਲ", aliases: ["karnal", "करनाल", "ਕਰਨਾਲ"] },
  { en: "Ambala", hi: "अंबाला", pa: "ਅੰਬਾਲਾ", aliases: ["ambala", "अंबाला", "ਅੰਬਾਲਾ"] },
  { en: "Hisar", hi: "हिसार", pa: "ਹਿਸਾਰ", aliases: ["hisar", "हिसार", "ਹਿਸਾਰ"] },
  { en: "Panipat", hi: "पानीपत", pa: "ਪਾਨੀਪਤ", aliases: ["panipat", "पानीपत", "ਪਾਨੀਪਤ"] },
  { en: "Sonipat", hi: "सोनीपत", pa: "ਸੋਨੀਪਤ", aliases: ["sonipat", "सोनीपत", "ਸੋਨੀਪਤ"] },
  { en: "Rohtak", hi: "रोहतक", pa: "ਰੋਹਤਕ", aliases: ["rohtak", "रोहतक", "ਰੋਹਤਕ"] },
  { en: "Kurukshetra", hi: "कुरुक्षेत्र", pa: "ਕੁਰੂਕਸ਼ੇਤਰ", aliases: ["kurukshetra", "कुरुक्षेत्र", "ਕੁਰੂਕਸ਼ੇਤਰ"] },
  { en: "Sirsa", hi: "सिरसा", pa: "ਸਿਰਸਾ", aliases: ["sirsa", "सिरसा", "ਸਿਰਸਾ"] },
  { en: "Gurugram", hi: "गुरुग्राम", pa: "ਗੁਰੂਗ੍ਰਾਮ", aliases: ["gurugram", "gurgaon", "गुरुग्राम", "ਗੁਰੂਗ੍ਰਾਮ"] },
  { en: "Faridabad", hi: "फरीदाबाद", pa: "ਫ਼ਰੀਦਾਬਾਦ", aliases: ["faridabad", "फरीदाबाद", "ਫ਼ਰੀਦਾਬਾਦ"] },
  { en: "Yamunanagar", hi: "यमुनानगर", pa: "ਯਮੁਨਾਨਗਰ", aliases: ["yamunanagar", "यमुनानगर", "ਯਮੁਨਾਨਗਰ"] },

  // Maharashtra
  { en: "Nashik", hi: "नासिक", pa: "ਨਾਸਿਕ", aliases: ["nashik", "nasik", "नासिक", "ਨਾਸਿਕ"] },
  { en: "Pune", hi: "पुणे", pa: "ਪੁਣੇ", aliases: ["pune", "पुणे", "ਪੁਣੇ"] },
  { en: "Nagpur", hi: "नागपुर", pa: "ਨਾਗਪੁਰ", aliases: ["nagpur", "नागपुर", "ਨਾਗਪੁਰ"] },
  { en: "Mumbai", hi: "मुंबई", pa: "ਮੁੰਬਈ", aliases: ["mumbai", "bombay", "मुंबई", "ਮੁੰਬਈ"] },
  { en: "Solapur", hi: "सोलापुर", pa: "ਸੋਲਾਪੁਰ", aliases: ["solapur", "सोलापुर", "ਸੋਲਾਪੁਰ"] },
  { en: "Kolhapur", hi: "कोल्हापुर", pa: "ਕੋਲ੍ਹਾਪੁਰ", aliases: ["kolhapur", "कोल्हापुर", "ਕੋਲ੍ਹਾਪੁਰ"] },
  { en: "Ahmednagar", hi: "अहमदनगर", pa: "ਅਹਿਮਦਨਗਰ", aliases: ["ahmednagar", "ahmadnagar", "अहमदनगर", "ਅਹਿਮਦਨਗਰ"] },
  { en: "Aurangabad", hi: "औरंगाबाद", pa: "ਔਰੰਗਾਬਾਦ", aliases: ["aurangabad", "chhatrapati sambhajinagar", "औरंगाबाद", "ਔਰੰਗਾਬਾਦ"] },
  { en: "Jalgaon", hi: "जलगांव", pa: "ਜਲਗਾਂਵ", aliases: ["jalgaon", "जलगांव", "ਜਲਗਾਂਵ"] },

  // Madhya Pradesh
  { en: "Indore", hi: "इंदौर", pa: "ਇੰਦੌਰ", aliases: ["indore", "इंदौर", "इन्दौर", "ਇੰਦੌਰ"] },
  { en: "Bhopal", hi: "भोपाल", pa: "ਭੋਪਾਲ", aliases: ["bhopal", "भोपाल", "ਭੋਪਾਲ"] },
  { en: "Ujjain", hi: "उज्जैन", pa: "ਉਜੈਨ", aliases: ["ujjain", "उज्जैन", "ਉਜੈਨ"] },
  { en: "Gwalior", hi: "ग्वालियर", pa: "ਗਵਾਲੀਅਰ", aliases: ["gwalior", "ग्वालियर", "ਗਵਾਲੀਅਰ"] },
  { en: "Jabalpur", hi: "जबलपुर", pa: "ਜਬਲਪੁਰ", aliases: ["jabalpur", "जबलपुर", "ਜਬਲਪੁਰ"] },

  // Odisha
  { en: "Bhubaneswar", hi: "भुवनेश्वर", pa: "ਭੁਵਨੇਸ਼ਵਰ", aliases: ["bhubaneswar", "bhubneswar", "भुवनेश्वर", "ਭੁਵਨੇਸ਼ਵਰ"] },
  { en: "Baripada", hi: "बारीपदा", pa: "ਬਾਰੀਪਦਾ", aliases: ["baripada", "बारीपदा", "ਬਾਰੀਪਦਾ"] },
  { en: "Cuttack", hi: "कटक", pa: "ਕਟਕ", aliases: ["cuttack", "कटक", "ਕਟਕ"] },

  // Rajasthan
  { en: "Jaipur", hi: "जयपुर", pa: "ਜੈਪੁਰ", aliases: ["jaipur", "जयपुर", "ਜੈਪੁਰ"] },
  { en: "Jodhpur", hi: "जोधपुर", pa: "ਜੋਧਪੁਰ", aliases: ["jodhpur", "जोधपुर", "ਜੋਧਪੁਰ"] },
  { en: "Kota", hi: "कोटा", pa: "ਕੋਟਾ", aliases: ["kota", "कोटा", "ਕੋਟਾ"] },
  { en: "Bikaner", hi: "बीकानेर", pa: "ਬੀਕਾਨੇਰ", aliases: ["bikaner", "बीकानेर", "ਬੀਕਾਨੇਰ"] },

  // Uttar Pradesh
  { en: "Lucknow", hi: "लखनऊ", pa: "ਲਖਨਊ", aliases: ["lucknow", "लखनऊ", "ਲਖਨਊ"] },
  { en: "Kanpur", hi: "कानपुर", pa: "ਕਾਨਪੁਰ", aliases: ["kanpur", "कानपुर", "ਕਾਨਪੁਰ"] },
  { en: "Varanasi", hi: "वाराणसी", pa: "ਵਾਰਾਣਸੀ", aliases: ["varanasi", "banaras", "वाराणसी", "ਵਾਰਾਣਸੀ"] },
  { en: "Agra", hi: "आगरा", pa: "ਆਗਰਾ", aliases: ["agra", "आगरा", "ਆਗਰਾ"] },
  { en: "Kheragarh", hi: "खेरागढ़", pa: "ਖੇਰਾਗੜ੍ਹ", aliases: ["kheragarh", "खेरागढ़", "ਖੇਰਾਗੜ੍ਹ"] },

  // Delhi & Chandigarh
  { en: "Delhi", hi: "दिल्ली", pa: "ਦਿੱਲੀ", aliases: ["delhi", "new delhi", "दिल्ली", "नई दिल्ली", "ਦਿੱਲੀ", "ਨਵੀਂ ਦਿੱਲੀ"] },
  { en: "Chandigarh", hi: "चंडीगढ़", pa: "ਚੰਡੀਗੜ੍ਹ", aliases: ["chandigarh", "चंडीगढ़", "ਚੰਡੀਗੜ੍ਹ"] },

  // States
  { en: "Punjab", hi: "पंजाब", pa: "ਪੰਜਾਬ", aliases: ["punjab", "पंजाब", "ਪੰਜਾਬ"] },
  { en: "Haryana", hi: "हरियाणा", pa: "ਹਰਿਆਣਾ", aliases: ["haryana", "हरियाणा", "ਹਰਿਆਣਾ"] },
  { en: "Madhya Pradesh", hi: "मध्य प्रदेश", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼", aliases: ["madhya pradesh", "mp", "मध्य प्रदेश", "ਮੱਧ ਪ੍ਰਦੇਸ਼"] },
  { en: "Maharashtra", hi: "महाराष्ट्र", pa: "ਮਹਾਰਾਸ਼ਟਰ", aliases: ["maharashtra", "महाराष्ट्र", "ਮਹਾਰਾਸ਼ਟਰ"] },
  { en: "Rajasthan", hi: "राजस्थान", pa: "ਰਾਜਸਥਾਨ", aliases: ["rajasthan", "राजस्थान", "ਰਾਜਸਥਾਨ"] },
  { en: "Uttar Pradesh", hi: "उत्तर प्रदेश", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", aliases: ["uttar pradesh", "up", "उत्तर प्रदेश", "ਉੱਤਰ ਪ੍ਰਦੇਸ਼"] },
  { en: "Odisha", hi: "ओडिशा", pa: "ਓਡੀਸ਼ਾ", aliases: ["odisha", "orissa", "ओडिशा", "ਉੜੀਸਾ", "ਓਡੀਸ਼ਾ"] },
  { en: "Gujarat", hi: "गुजरात", pa: "ਗੁਜਰਾਤ", aliases: ["gujarat", "गुजरात", "ਗੁਜਰਾਤ"] },
  { en: "Bihar", hi: "बिहार", pa: "ਬਿਹਾਰ", aliases: ["bihar", "बिहार", "ਬਿਹਾਰ"] },
  { en: "West Bengal", hi: "पश्चिम बंगाल", pa: "ਪੱਛਮੀ ਬੰਗਾਲ", aliases: ["west bengal", "पश्चिम बंगाल", "ਪੱਛਮੀ ਬੰਗਾਲ"] },
  { en: "Himachal Pradesh", hi: "हिमाचल प्रदेश", pa: "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼", aliases: ["himachal pradesh", "himachal", "हिमाचल प्रदेश", "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼"] },
  { en: "Karnataka", hi: "कर्नाटक", pa: "ਕਰਨਾਟਕ", aliases: ["karnataka", "कर्नाटक", "ਕਰਨਾਟਕ"] },
  { en: "Tamil Nadu", hi: "तमिलनाडु", pa: "ਤਮਿਲਨਾਡੂ", aliases: ["tamil nadu", "तमिलनाडु", "ਤਮਿਲਨਾਡੂ"] },
  { en: "Andhra Pradesh", hi: "आंध्र प्रदेश", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", aliases: ["andhra pradesh", "आंध्र प्रदेश", "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼"] },
  { en: "Telangana", hi: "तेलंगाना", pa: "ਤੇਲੰਗਾਨਾ", aliases: ["telangana", "तेलंगाना", "ਤੇਲੰਗਾਨਾ"] },
  { en: "Kerala", hi: "केरल", pa: "ਕੇਰਲ", aliases: ["kerala", "keralam", "केरल", "ਕੇਰਲ"] },
  { en: "Uttarakhand", hi: "उत्तराखंड", pa: "ਉੱਤਰਾਖੰਡ", aliases: ["uttarakhand", "उत्तराखंड", "ਉੱਤਰਾਖੰਡ"] },
  { en: "Assam", hi: "असम", pa: "ਅਸਾਮ", aliases: ["assam", "असम", "ਅਸਾਮ"] },
  { en: "Jharkhand", hi: "झारखंड", pa: "ਝਾਰਖੰਡ", aliases: ["jharkhand", "झारखंड", "ਝਾਰਖੰਡ"] },
  { en: "Chhattisgarh", hi: "छत्तीसगढ़", pa: "ਛੱਤੀਸਗੜ੍ਹ", aliases: ["chhattisgarh", "chattisgarh", "छत्तीसगढ़", "ਛੱਤੀਸਗੜ੍ਹ"] },
];

export const LOCATION_INDEX = {};
for (const entry of LOCATION_CATALOG) {
  for (const alias of entry.aliases) {
    LOCATION_INDEX[alias.toLowerCase().trim()] = entry;
  }
}

/**
 * Translates and formats Indian locations (e.g. 'ਜਲੰਧਰ', 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ', 'इंदौर, मध्य प्रदेश')
 * according to the active language.
 */
export function translateLocation(locationStr, lang = "en") {
  if (!locationStr) return "";
  const raw = String(locationStr).trim();
  if (!raw) return "";

  const direct = LOCATION_INDEX[raw.toLowerCase()];
  if (direct) {
    return direct[lang] || direct.en;
  }

  // Split by comma, slash, hyphen, or dot
  const parts = raw.split(/([,/·\-])/);
  const translated = parts.map((part) => {
    const trimmed = part.trim();
    if (!trimmed || /^[,/·\-]$/.test(trimmed)) {
      return part;
    }
    const match = LOCATION_INDEX[trimmed.toLowerCase()];
    if (match) {
      return match[lang] || match.en;
    }
    return trimmed;
  });

  return translated.join("").replace(/\s*,\s*/g, ", ").trim();
}

// -------------------------------------------------------------
// Person Name Normalization & Translation
// -------------------------------------------------------------
export const NAME_WORD_MAP = {
  // Roles / Titles
  "ਕਿਸਾਨ": { en: "Farmer", hi: "किसान", pa: "ਕਿਸਾਨ" },
  "किसान": { en: "Farmer", hi: "किसान", pa: "ਕਿਸਾਨ" },
  "farmer": { en: "Farmer", hi: "किसान", pa: "ਕਿਸਾਨ" },
  "ਖ਼ਰੀਦਦਾਰ": { en: "Buyer", hi: "खरीदार", pa: "ਖ਼ਰੀਦਦਾਰ" },
  "ਖਰੀਦਦਾਰ": { en: "Buyer", hi: "खरीदार", pa: "ਖ਼ਰੀਦਦਾਰ" },
  "खरीदार": { en: "Buyer", hi: "खरीदार", pa: "ਖ਼ਰੀਦਦਾਰ" },
  "buyer": { en: "Buyer", hi: "खरीदार", pa: "ਖ਼ਰੀਦਦਾਰ" },
  "ਟ੍ਰੇਡਰ": { en: "Trader", hi: "ट्रेडर", pa: "ਟ੍ਰੇਡਰ" },
  "ट्रेडर": { en: "Trader", hi: "ट्रेडर", pa: "ਟ੍ਰੇਡਰ" },
  "trader": { en: "Trader", hi: "ट्रेडर", pa: "ਟ੍ਰੇਡਰ" },
  "agro": { en: "Agro", hi: "एग्रो", pa: "ਐਗਰੋ" },
  "एग्रो": { en: "Agro", hi: "एग्रो", pa: "ਐਗਰੋ" },
  "ਐਗਰੋ": { en: "Agro", hi: "एग्रो", pa: "ਐਗਰੋ" },

  // Names / Surnames
  "ਗੁਰਦੀਪ": { en: "Gurdeep", hi: "गुरदीप", pa: "ਗੁਰਦੀਪ" },
  "गुरदीप": { en: "Gurdeep", hi: "गुरदीप", pa: "ਗੁਰਦੀਪ" },
  "gurdeep": { en: "Gurdeep", hi: "गुरदीप", pa: "ਗੁਰਦੀਪ" },
  "ਰਾਮੇਸ਼": { en: "Ramesh", hi: "रमेश", pa: "ਰਾਮੇਸ਼" },
  "रामेश": { en: "Ramesh", hi: "रामेश", pa: "ਰਾਮੇਸ਼" },
  "रमेश": { en: "Ramesh", hi: "रमेश", pa: "ਰਮੇਸ਼" },
  "ramesh": { en: "Ramesh", hi: "रमेश", pa: "ਰਮੇਸ਼" },
  "ਹਰਪ੍ਰੀਤ": { en: "Harpreet", hi: "हरप्रीत", pa: "ਹਰਪ੍ਰੀਤ" },
  "हरप्रीत": { en: "Harpreet", hi: "हरप्रीत", pa: "ਹਰਪ੍ਰੀਤ" },
  "harpreet": { en: "Harpreet", hi: "हरप्रीत", pa: "ਹਰਪ੍ਰੀਤ" },
  "ਸੁਰੇਸ਼": { en: "Suresh", hi: "सुरेश", pa: "ਸੁਰੇਸ਼" },
  "सुरेश": { en: "Suresh", hi: "सुरेश", pa: "ਸੁਰੇਸ਼" },
  "suresh": { en: "Suresh", hi: "सुरेश", pa: "ਸੁਰੇਸ਼" },
  "ਸਿੰਘ": { en: "Singh", hi: "सिंह", pa: "ਸਿੰਘ" },
  "सिंह": { en: "Singh", hi: "सिंह", pa: "ਸਿੰਘ" },
  "singh": { en: "Singh", hi: "सिंह", pa: "ਸਿੰਘ" },
  "ਕੁਮਾਰ": { en: "Kumar", hi: "कुमार", pa: "ਕੁਮਾਰ" },
  "कुमार": { en: "Kumar", hi: "कुमार", pa: "ਕੁਮਾਰ" },
  "kumar": { en: "Kumar", hi: "कुमार", pa: "ਕੁਮਾਰ" },
  "ਪ੍ਰਿਆ": { en: "Priya", hi: "प्रिया", pa: "ਪ੍ਰਿਆ" },
  "प्रिया": { en: "Priya", hi: "प्रिया", pa: "ਪ੍ਰਿਆ" },
  "priya": { en: "Priya", hi: "प्रिया", pa: "ਪ੍ਰਿਆ" },
  "ਕਾਰਤਿਕ": { en: "Kartik", hi: "कार्तिक", pa: "ਕਾਰਤਿਕ" },
  "कार्तिक": { en: "Kartik", hi: "कार्तिक", pa: "ਕਾਰਤਿਕ" },
  "kartik": { en: "Kartik", hi: "कार्तिक", pa: "ਕਾਰਤਿਕ" },
  "ਜੈਨ": { en: "Jain", hi: "जैन", pa: "ਜੈਨ" },
  "जैन": { en: "Jain", hi: "जैन", pa: "ਜੈਨ" },
  "jain": { en: "Jain", hi: "जैन", pa: "ਜੈਨ" },
  "ਜੌਨ": { en: "John", hi: "जॉन", pa: "ਜੌਨ" },
  "जॉन": { en: "John", hi: "जॉन", pa: "ਜੌਨ" },
  "john": { en: "John", hi: "जॉन", pa: "ਜੌਨ" },
};

/**
 * Translates person/business names across languages (e.g. 'ਗੁਰਦੀਪ ਕਿਸਾਨ' -> 'Gurdeep Farmer').
 */
export function translatePersonName(nameStr, lang = "en") {
  if (!nameStr) return "";
  const raw = String(nameStr).trim();
  if (!raw) return "";

  const words = raw.split(/\s+/);
  const translatedWords = words.map((w) => {
    const key = w.toLowerCase();
    const entry = NAME_WORD_MAP[w] || NAME_WORD_MAP[key];
    if (entry) {
      return entry[lang] || entry.en;
    }
    return w;
  });

  return translatedWords.join(" ");
}

