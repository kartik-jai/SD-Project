import { useEffect, useState } from "react";
import { rupee } from "../api";
import { translateCrop, translatePersonName } from "../i18n";

export default function RazorpayModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  totalAmount,
  plan, // 'full' | 'advance' | 'cod'
  dealInfo,
  lang = "en",
  initialTab = "upi",
  t,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "upi"); // 'upi' | 'card' | 'netbanking' | 'wallet'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [upiMode, setUpiMode] = useState("qr"); // 'qr' | 'id'
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [selectedBank, setSelectedBank] = useState("SBI");
  const [selectedWallet, setSelectedWallet] = useState("paytm");
  const [timerSeconds, setTimerSeconds] = useState(299); // 5 min countdown
  const [processingStep, setProcessingStep] = useState(0); // 0 = idle, 1 = verifying, 2 = 2fa, 3 = success

  // Expiry countdown timer for QR
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Card brand detection
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "Visa";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^6(011|5|4[4-9]|22)/.test(clean) || /^60|65|81|82/.test(clean)) return "RuPay";
    if (/^3[47]/.test(clean)) return "Amex";
    return null;
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Trigger payment execution flow
  const handlePay = async (methodName) => {
    setProcessingStep(1); // Verifying
    await new Promise((r) => setTimeout(r, 700));

    setProcessingStep(2); // Bank 2FA
    await new Promise((r) => setTimeout(r, 900));

    setProcessingStep(3); // Success
    await new Promise((r) => setTimeout(r, 600));

    const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
    const paymentId = `pay_Rzp${randomSuffix}`;
    const rrn = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    onSuccess({
      payment_id: paymentId,
      payment_method: methodName,
      rrn,
      paid_amount: amount,
    });
  };

  const popularBanks = [
    { code: "SBI", name: "State Bank of India", color: "#1b4d89", short: "SBI" },
    { code: "HDFC", name: "HDFC Bank", color: "#004c8f", short: "HDFC" },
    { code: "ICICI", name: "ICICI Bank", color: "#b02a30", short: "ICICI" },
    { code: "AXIS", name: "Axis Bank", color: "#97144d", short: "Axis" },
    { code: "PNB", name: "Punjab National Bank", color: "#a20032", short: "PNB" },
    { code: "BOB", name: "Bank of Baroda", color: "#f26522", short: "BOB" },
  ];

  const cardBrand = getCardBrand(cardNumber);

  return (
    <div className="rzp-overlay">
      <div className="rzp-modal">
        {/* Processing Gateway Overlay */}
        {processingStep > 0 && (
          <div className="rzp-processing-overlay">
            {processingStep === 3 ? (
              <div className="rzp-success-state">
                <div className="rzp-success-circle">✓</div>
                <h3>{t("payment_successful")}</h3>
                <p>{rupee(amount)} authorized & escrow locked</p>
                <span className="rzp-sub-hint">Generating official deal receipt…</span>
              </div>
            ) : (
              <div className="rzp-spinner-state">
                <div className="rzp-spinner"></div>
                <div className="rzp-steps-list">
                  <div className={`rzp-step ${processingStep >= 1 ? "active" : ""}`}>
                    <span className="step-dot"></span>
                    <span>1. Securing connection with bank gateway…</span>
                  </div>
                  <div className={`rzp-step ${processingStep >= 2 ? "active" : ""}`}>
                    <span className="step-dot"></span>
                    <span>2. Authorizing trade escrow transaction…</span>
                  </div>
                </div>
                <p className="rzp-security-note">🔒 256-bit SSL Bank Encrypted. Please do not refresh.</p>
              </div>
            )}
          </div>
        )}

        {/* Razorpay Brand Header */}
        <header className="rzp-header">
          <div className="rzp-brand">
            <div className="rzp-logo-badge">
              <span className="rzp-icon-slash">//</span>
              <span className="rzp-brand-text">Razorpay</span>
            </div>
            <div className="rzp-merchant-meta">
              <h2>AgriConnect Mandi Escrow</h2>
              <p>Trade with <strong>{translatePersonName(dealInfo?.farmerName, lang)}</strong></p>
            </div>
          </div>

          <div className="rzp-amount-badge">
            <span className="amt-label">{plan === "advance" ? "Advance (20%)" : "Total Pay"}</span>
            <strong>{rupee(amount)}</strong>
            <button className="rzp-close-btn" onClick={onClose} title="Cancel">✕</button>
          </div>
        </header>

        {/* Modal Container */}
        <div className="rzp-content-grid">
          {/* Left Method Tabs */}
          <aside className="rzp-sidebar">
            <span className="rzp-sidebar-title">Payment Options</span>

            <button
              className={`rzp-tab-btn ${activeTab === "upi" ? "active" : ""}`}
              onClick={() => setActiveTab("upi")}
            >
              <span className="tab-icon">⚡</span>
              <div className="tab-texts">
                <strong>UPI / QR Code</strong>
                <small>Google Pay, PhonePe, Paytm, BHIM</small>
              </div>
              <span className="tab-arrow">›</span>
            </button>

            <button
              className={`rzp-tab-btn ${activeTab === "card" ? "active" : ""}`}
              onClick={() => setActiveTab("card")}
            >
              <span className="tab-icon">💳</span>
              <div className="tab-texts">
                <strong>Cards</strong>
                <small>Visa, Mastercard, RuPay</small>
              </div>
              <span className="tab-arrow">›</span>
            </button>

            <button
              className={`rzp-tab-btn ${activeTab === "netbanking" ? "active" : ""}`}
              onClick={() => setActiveTab("netbanking")}
            >
              <span className="tab-icon">🏛️</span>
              <div className="tab-texts">
                <strong>Net Banking</strong>
                <small>SBI, HDFC, ICICI & 50+ Banks</small>
              </div>
              <span className="tab-arrow">›</span>
            </button>

            <button
              className={`rzp-tab-btn ${activeTab === "wallet" ? "active" : ""}`}
              onClick={() => setActiveTab("wallet")}
            >
              <span className="tab-icon">👛</span>
              <div className="tab-texts">
                <strong>Wallets</strong>
                <small>Paytm, Amazon Pay, PhonePe</small>
              </div>
              <span className="tab-arrow">›</span>
            </button>

            <div className="rzp-security-badge">
              <span>🔒 100% RBI & Escrow Compliant</span>
            </div>
          </aside>

          {/* Right Method Screen */}
          <main className="rzp-main-panel">
            {/* UPI View */}
            {activeTab === "upi" && (
              <div className="rzp-tab-view upi-view">
                <div className="upi-sub-switch">
                  <button
                    className={`sub-pill ${upiMode === "qr" ? "active" : ""}`}
                    onClick={() => setUpiMode("qr")}
                  >
                    📷 Scan Dynamic QR Code
                  </button>
                  <button
                    className={`sub-pill ${upiMode === "id" ? "active" : ""}`}
                    onClick={() => setUpiMode("id")}
                  >
                    📱 Enter UPI ID / VPA
                  </button>
                </div>

                {upiMode === "qr" ? (
                  <div className="qr-wrapper">
                    <div className="qr-box">
                      {/* Dynamic SVG UPI QR Code */}
                      <svg className="rzp-qr-svg" viewBox="0 0 200 200" width="160" height="160">
                        {/* Background */}
                        <rect width="200" height="200" fill="#ffffff" rx="8" />
                        {/* Corner Targets */}
                        <rect x="15" y="15" width="45" height="45" fill="#0c2340" rx="4" />
                        <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="2" />
                        <rect x="29" y="29" width="17" height="17" fill="#0c2340" rx="2" />

                        <rect x="140" y="15" width="45" height="45" fill="#0c2340" rx="4" />
                        <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="2" />
                        <rect x="154" y="29" width="17" height="17" fill="#0c2340" rx="2" />

                        <rect x="15" y="140" width="45" height="45" fill="#0c2340" rx="4" />
                        <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="2" />
                        <rect x="29" y="154" width="17" height="17" fill="#0c2340" rx="2" />

                        {/* QR Data Grid Pattern */}
                        <rect x="70" y="18" width="12" height="12" fill="#0c2340" />
                        <rect x="90" y="18" width="12" height="24" fill="#0c2340" />
                        <rect x="110" y="18" width="18" height="12" fill="#0c2340" />
                        <rect x="70" y="38" width="15" height="12" fill="#0c2340" />
                        <rect x="112" y="38" width="12" height="18" fill="#0c2340" />

                        <rect x="18" y="70" width="12" height="18" fill="#0c2340" />
                        <rect x="38" y="75" width="20" height="12" fill="#0c2340" />
                        <rect x="18" y="98" width="24" height="14" fill="#0c2340" />
                        <rect x="48" y="98" width="12" height="24" fill="#0c2340" />

                        {/* Center UPI Badge */}
                        <rect x="80" y="80" width="40" height="40" fill="#0066f5" rx="8" />
                        <text x="100" y="104" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">UPI</text>

                        {/* Lower grid */}
                        <rect x="70" y="130" width="18" height="12" fill="#0c2340" />
                        <rect x="98" y="125" width="12" height="24" fill="#0c2340" />
                        <rect x="120" y="130" width="24" height="12" fill="#0c2340" />
                        <rect x="70" y="152" width="24" height="12" fill="#0c2340" />
                        <rect x="102" y="158" width="15" height="18" fill="#0c2340" />
                        <rect x="125" y="152" width="12" height="24" fill="#0c2340" />
                        <rect x="145" y="145" width="20" height="12" fill="#0c2340" />
                        <rect x="152" y="165" width="24" height="14" fill="#0c2340" />

                        {/* Animated Laser Scanner Line */}
                        <line x1="0" y1="0" x2="200" y2="0" stroke="#00c853" strokeWidth="3" opacity="0.8">
                          <animate attributeName="y1" values="0;200;0" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="y2" values="0;200;0" dur="2.5s" repeatCount="indefinite" />
                        </line>
                      </svg>
                      <span className="qr-timer">⏳ Valid for {timeDisplay}</span>
                    </div>

                    <div className="qr-instructions">
                      <p className="qr-title">Scan & Pay using any UPI app</p>
                      <div className="upi-apps-icons">
                        <span className="app-pill gpay">GPay</span>
                        <span className="app-pill phonepe">PhonePe</span>
                        <span className="app-pill paytm">Paytm</span>
                        <span className="app-pill bhim">BHIM</span>
                      </div>
                      <p className="qr-escrow-text">Funds held in AgriConnect Escrow until goods inspection</p>

                      <button
                        className="btn rzp-pay-action-btn"
                        onClick={() => handlePay("UPI (Google Pay / QR)")}
                      >
                        ⚡ Simulate Scan & Pay {rupee(amount)}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upi-id-form">
                    <label>Virtual Payment Address (UPI ID)</label>
                    <div className="upi-input-group">
                      <input
                        type="text"
                        placeholder="username@bank (e.g. 9876543210@upi)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="upi-quick-handles">
                      <span onClick={() => setUpiId("trader@okhdfcbank")}>@okhdfcbank</span>
                      <span onClick={() => setUpiId("agro@okaxis")}>@okaxis</span>
                      <span onClick={() => setUpiId("buyer@paytm")}>@paytm</span>
                      <span onClick={() => setUpiId("trade@ybl")}>@ybl</span>
                    </div>

                    <button
                      className="btn rzp-pay-action-btn"
                      disabled={!upiId || upiId.length < 5}
                      onClick={() => handlePay(`UPI (${upiId})`)}
                    >
                      🔒 Verify & Pay {rupee(amount)}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cards View */}
            {activeTab === "card" && (
              <div className="rzp-tab-view card-view">
                {/* Visual Card Preview */}
                <div className="card-mockup">
                  <div className="card-top">
                    <span className="card-chip">💳</span>
                    <span className="card-network-badge">{cardBrand || "Card"}</span>
                  </div>
                  <div className="card-number-display">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-bottom">
                    <div>
                      <small>CARDHOLDER</small>
                      <span>{cardName.toUpperCase() || "BUYER NAME"}</span>
                    </div>
                    <div>
                      <small>EXPIRES</small>
                      <span>{cardExpiry || "MM/YY"}</span>
                    </div>
                  </div>
                </div>

                <div className="card-form-grid">
                  <div className="field-block full">
                    <label>Card Number</label>
                    <div className="input-with-badge">
                      <input
                        type="text"
                        placeholder="4532 0123 4567 8910"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                      {cardBrand && <span className="brand-detected">{cardBrand}</span>}
                    </div>
                  </div>

                  <div className="field-block">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      maxLength={5}
                    />
                  </div>

                  <div className="field-block">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                      maxLength={4}
                    />
                  </div>

                  <div className="field-block full">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name printed on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <label className="save-card-checkbox full">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                    />
                    <span>Save card securely as per RBI guidelines</span>
                  </label>

                  <button
                    className="btn rzp-pay-action-btn full"
                    onClick={() => handlePay(`Card (${cardBrand || "Debit"} ending in ${cardNumber.slice(-4) || "4242"})`)}
                  >
                    🔒 Pay {rupee(amount)}
                  </button>
                </div>
              </div>
            )}

            {/* Net Banking View */}
            {activeTab === "netbanking" && (
              <div className="rzp-tab-view netbanking-view">
                <label className="nb-title">Popular Indian Banks</label>
                <div className="bank-grid">
                  {popularBanks.map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      className={`bank-card ${selectedBank === b.code ? "active" : ""}`}
                      onClick={() => setSelectedBank(b.code)}
                    >
                      <div className="bank-logo-box" style={{ background: b.color }}>
                        {b.short}
                      </div>
                      <span className="bank-name">{b.name}</span>
                    </button>
                  ))}
                </div>

                <div className="all-banks-row">
                  <label>All Other Indian Banks (50+ available)</label>
                  <select
                    className="all-banks-select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="CANARA">Canara Bank</option>
                    <option value="UNION">Union Bank of India</option>
                    <option value="INDUS">IndusInd Bank</option>
                    <option value="IDBI">IDBI Bank</option>
                    <option value="YES">Yes Bank</option>
                    <option value="FEDERAL">Federal Bank</option>
                    <option value="CENTRAL">Central Bank of India</option>
                    <option value="RBL">RBL Bank</option>
                  </select>
                </div>

                <button
                  className="btn rzp-pay-action-btn"
                  onClick={() => handlePay(`Netbanking (${selectedBank})`)}
                >
                  🔒 Pay {rupee(amount)} via {selectedBank}
                </button>
              </div>
            )}

            {/* Wallets View */}
            {activeTab === "wallet" && (
              <div className="rzp-tab-view wallet-view">
                <label className="wallet-title">Select Wallet</label>
                <div className="wallet-list">
                  <label className={`wallet-item ${selectedWallet === "paytm" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="walletOption"
                      checked={selectedWallet === "paytm"}
                      onChange={() => setSelectedWallet("paytm")}
                    />
                    <div className="wallet-icon paytm-icon">Paytm</div>
                    <div className="wallet-info">
                      <strong>Paytm Wallet / Postpaid</strong>
                      <small>Instant checkout</small>
                    </div>
                  </label>

                  <label className={`wallet-item ${selectedWallet === "amazon" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="walletOption"
                      checked={selectedWallet === "amazon"}
                      onChange={() => setSelectedWallet("amazon")}
                    />
                    <div className="wallet-icon amazon-icon">Amazon</div>
                    <div className="wallet-info">
                      <strong>Amazon Pay</strong>
                      <small>Fast 1-click OTP</small>
                    </div>
                  </label>

                  <label className={`wallet-item ${selectedWallet === "phonepe" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="walletOption"
                      checked={selectedWallet === "phonepe"}
                      onChange={() => setSelectedWallet("phonepe")}
                    />
                    <div className="wallet-icon phonepe-icon">PhonePe</div>
                    <div className="wallet-info">
                      <strong>PhonePe Wallet</strong>
                      <small>Linked bank / wallet balance</small>
                    </div>
                  </label>
                </div>

                <button
                  className="btn rzp-pay-action-btn"
                  onClick={() => handlePay(`Wallet (${selectedWallet.toUpperCase()})`)}
                >
                  🔒 Pay {rupee(amount)} via {selectedWallet.toUpperCase()}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

