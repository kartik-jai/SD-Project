import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, rupee, shortDate } from "../api";
import { useApp } from "../state.jsx";
import { translateCrop, translateLocation, translatePersonName, translateQuantity } from "../i18n";
import RazorpayModal from "../components/RazorpayModal.jsx";

function parseQuantityKg(str) {
  if (!str) return 100;
  const s = String(str).toLowerCase();
  const match = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  const num = match ? parseFloat(match[1]) : 100;
  if (s.includes("quintal") || s.includes("क्विंटल") || s.includes("ਕੁਇੰਟਲ")) {
    return Math.round(num * 100);
  }
  if (s.includes("ton") || s.includes("टन") || s.includes("ਟਨ")) {
    return Math.round(num * 1000);
  }
  return Math.round(num);
}

export default function Chat() {
  const { user, lang, t, refreshUnreadCount, toast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("id");
  const recipientParam = searchParams.get("recipient");
  const itemTypeParam = searchParams.get("item_type");
  const itemIdParam = searchParams.get("item_id");

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [text, setText] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Payment & Deal confirmation state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [onlineMethod, setOnlineMethod] = useState("upi"); // 'upi' | 'razorpay'
  const [targetOffer, setTargetOffer] = useState(null);
  const [dealQuantityKg, setDealQuantityKg] = useState(100);
  const [dealQuantityStr, setDealQuantityStr] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("advance"); // 'advance' | 'full' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'netbanking' | 'card' | 'cod'
  const [upiId, setUpiId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptDeal, setReceiptDeal] = useState(null);
  const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const messagesStreamRef = useRef(null);
  const isPollingRef = useRef(false);
  const prevMessagesLenRef = useRef(0);

  const isNearBottom = useCallback(() => {
    if (!messagesStreamRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesStreamRef.current;
    return scrollHeight - scrollTop - clientHeight < 150;
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messagesStreamRef.current) {
      messagesStreamRef.current.scrollTo({
        top: messagesStreamRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Load conversations list
  const loadConversations = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const list = await api("/conversations");
      setConversations(list);
    } catch {
      /* ignore polling error */
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Handle URL param to open or create conversation directly
  useEffect(() => {
    if (recipientParam) {
      api("/conversations", {
        method: "POST",
        body: {
          recipient_id: Number(recipientParam),
          item_type: itemTypeParam || null,
          item_id: itemIdParam ? Number(itemIdParam) : null,
        },
      })
        .then((conv) => {
          setSearchParams({ id: conv.id });
          loadConversations(true);
        })
        .catch((err) => {
          toast(err.message, "error");
          setSearchParams({});
        });
    }
  }, [recipientParam, itemTypeParam, itemIdParam, setSearchParams, loadConversations, toast]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Reset window position and scroll tracker on activeId switch
  useEffect(() => {
    window.scrollTo(0, 0);
    prevMessagesLenRef.current = 0;
  }, [activeId]);

  // Load active conversation & messages
  const loadActiveConversation = useCallback(
    async (silent = false) => {
      if (!activeId) {
        setActiveConv(null);
        setMessages([]);
        setDeals([]);
        return;
      }
      try {
        const data = await api(`/conversations/${activeId}`);
        setActiveConv(data.conversation);
        setMessages((prev) => {
          const next = data.messages || [];
          if (prev.length === next.length) {
            const isSame = prev.every(
              (m, i) => m.id === next[i]?.id && m.offer_status === next[i]?.offer_status
            );
            if (isSame) return prev;
          }
          return next;
        });
        setDeals(data.deals || []);
        refreshUnreadCount();
      } catch (err) {
        if (!silent) {
          toast(err.message, "error");
          setSearchParams({});
        }
      }
    },
    [activeId, refreshUnreadCount, toast, setSearchParams]
  );

  useEffect(() => {
    loadActiveConversation();
  }, [loadActiveConversation]);

  // Intelligent scroll: follow only when near bottom or first loading
  useEffect(() => {
    if (messages.length > 0) {
      if (prevMessagesLenRef.current === 0) {
        scrollToBottom("auto");
      } else if (isNearBottom()) {
        scrollToBottom("smooth");
      }
      prevMessagesLenRef.current = messages.length;
    }
  }, [messages, isNearBottom, scrollToBottom]);

  // Polling for active conversation and conversation list
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPollingRef.current) {
        isPollingRef.current = true;
        Promise.all([
          activeId ? loadActiveConversation(true) : Promise.resolve(),
          loadConversations(true),
        ]).finally(() => {
          isPollingRef.current = false;
        });
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [activeId, loadActiveConversation, loadConversations]);

  // Send message
  const handleSend = async (customText, customOffer) => {
    const msgText = customText !== undefined ? customText : text.trim();
    const offer = customOffer !== undefined ? customOffer : (showOfferBox ? offerPrice : null);

    if (!msgText && !offer) return;
    if (!activeId) return;

    setSending(true);
    try {
      const payload = { text: msgText };
      if (offer && Number(offer) > 0) {
        payload.offer_price = Number(offer);
      }
      const newMsg = await api(`/conversations/${activeId}/messages`, {
        method: "POST",
        body: payload,
      });

      setMessages((prev) => [...prev, newMsg]);
      setText("");
      setOfferPrice("");
      setShowOfferBox(false);
      loadConversations(true);
      refreshUnreadCount();
      setTimeout(scrollToBottom, 50);
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  };

  // Update negotiation offer (accept / decline)
  const handleOfferStatus = async (msgId, status) => {
    try {
      const updated = await api(`/messages/${msgId}/offer`, {
        method: "POST",
        body: { status },
      });
      setMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
      loadConversations(true);

      // If buyer accepts, automatically prompt to confirm deal and pay
      if (status === "accepted" && user?.role === "Buyer") {
        openPaymentModal(updated);
      }
    } catch {
      /* ignore */
    }
  };

  // Open Payment Modal for an accepted offer
  const openPaymentModal = (offerMsg) => {
    setTargetOffer(offerMsg);
    const rawQty = activeConv?.item?.quantity || "100 kg";
    const kg = parseQuantityKg(rawQty);
    setDealQuantityKg(kg);
    setDealQuantityStr(rawQty);
    setPaymentPlan("advance");
    setPaymentMethod("upi");
    setShowPaymentModal(true);
  };

  // Triggered when buyer proceeds from the terms modal
  const handleProceedToPayment = async () => {
    if (paymentPlan === "cod") {
      handleConfirmCodDeal();
      return;
    }

    if (onlineMethod === "upi") {
      // Launch dedicated interactive UPI (QR & UPI ID) modal
      setShowPaymentModal(false);
      setShowRazorpayModal(true);
      return;
    }

    setProcessingPayment(true);
    try {
      // Step 1: Create live Razorpay order
      const orderData = await api("/razorpay/create-order", {
        method: "POST",
        body: {
          conversation_id: Number(activeId),
          message_id: targetOffer?.id,
          agreed_price_per_kg: targetOffer?.offer_price,
          quantity: dealQuantityStr || `${dealQuantityKg} kg`,
          quantity_kg: dealQuantityKg,
          payment_type: paymentPlan,
        },
      });

      // Step 2: Open official Razorpay Checkout popup
      if (typeof window !== "undefined" && window.Razorpay) {
        setShowPaymentModal(false);
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "AgriConnect Mandi Escrow",
          description: `${orderData.crop} (${orderData.quantity}) · Trade Escrow`,
          order_id: orderData.order_id,
          prefill: {
            name: user?.name || "Buyer",
            contact: user?.phone || "9876543210",
          },
          theme: {
            color: "#166534",
          },
          handler: async function (response) {
            await handleRazorpaySuccess({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          toast(`Payment failed: ${resp.error?.description || "Gateway error"}`, "error");
          setProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Fallback to embedded interactive modal
        setShowPaymentModal(false);
        setShowRazorpayModal(true);
      }
    } catch (err) {
      toast(err.message || "Failed to create Razorpay order", "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Complete COD Deal
  const handleConfirmCodDeal = async () => {
    if (!activeId || !targetOffer) return;
    setProcessingPayment(true);

    try {
      const res = await api(`/conversations/${activeId}/pay`, {
        method: "POST",
        body: {
          message_id: targetOffer.id,
          agreed_price_per_kg: targetOffer.offer_price,
          quantity: dealQuantityStr || `${dealQuantityKg} kg`,
          quantity_kg: dealQuantityKg,
          payment_type: "cod",
          payment_method: "Cash on Mandi Delivery (COD)",
        },
      });

      setShowPaymentModal(false);
      setDeals((prev) => [res.deal, ...prev]);
      setReceiptDeal(res.deal);
      setShowReceiptModal(true);
      toast(t("deal_locked_success"), "ok");

      loadActiveConversation(true);
      loadConversations(true);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Razorpay Gateway Success Callback
  const handleRazorpaySuccess = async (paymentData) => {
    if (!activeId || !targetOffer) return;
    setProcessingPayment(true);

    try {
      const res = await api("/razorpay/verify-payment", {
        method: "POST",
        body: {
          conversation_id: Number(activeId),
          message_id: targetOffer.id,
          razorpay_order_id: paymentData.razorpay_order_id || "",
          razorpay_payment_id: paymentData.razorpay_payment_id || paymentData.payment_id,
          razorpay_signature: paymentData.razorpay_signature || "simulated_success",
          agreed_price_per_kg: targetOffer.offer_price,
          quantity: dealQuantityStr || `${dealQuantityKg} kg`,
          quantity_kg: dealQuantityKg,
          payment_type: paymentPlan,
          payment_method: paymentData.payment_method || "",
        },
      });

      setShowRazorpayModal(false);
      const enhancedDeal = {
        ...res.deal,
        rrn: paymentData.rrn,
      };
      setDeals((prev) => [enhancedDeal, ...prev]);
      setReceiptDeal(enhancedDeal);
      setShowReceiptModal(true);
      toast(t("deal_locked_success"), "ok");

      loadActiveConversation(true);
      loadConversations(true);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Confirm Lot Received & Complete Trade
  const handleConfirmDelivery = async () => {
    if (!activeId) return;
    setConfirmingDelivery(true);
    try {
      const res = await api(`/conversations/${activeId}/confirm-delivery`, {
        method: "POST",
      });
      setShowConfirmDeliveryModal(false);
      setDeals((prev) => [res.deal, ...prev.filter((d) => d.id !== res.deal.id)]);
      toast(t("delivery_confirmed_success"), "ok");
      loadActiveConversation(true);
      loadConversations(true);
    } catch (err) {
      toast(err.message || "Failed to confirm delivery", "error");
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const handleSelectConv = (id) => {
    setSearchParams({ id });
    setShowOfferBox(false);
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  // Quick replies
  const quickReplies = [
    t("qr_available"),
    t("qr_pickup"),
    t("qr_transport"),
    t("qr_sample"),
    t("qr_deal"),
  ];

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    const otherName = c.other_user?.name?.toLowerCase() || "";
    const cropName = c.item?.crop?.toLowerCase() || "";
    return otherName.includes(q) || cropName.includes(q);
  });

  const otherUser = activeConv?.other_user;
  const item = activeConv?.item;
  const otherRole = otherUser?.role === "Farmer" ? t("role_farmer") : t("role_buyer");
  const latestDeal = useMemo(() => {
    if (!deals || deals.length === 0) return null;
    const fullDeal = deals.find((d) => d.payment_type === "full");
    if (fullDeal) return fullDeal;
    return [...deals].sort((a, b) => (b.paid_amount || 0) - (a.paid_amount || 0))[0];
  }, [deals]);

  // Price calculations for Payment Modal
  const currentAgreedRate = targetOffer?.offer_price || item?.price_per_kg || 0;
  const totalDealVal = Math.round(currentAgreedRate * (dealQuantityKg || 0));
  const advanceAmount = Math.round(totalDealVal * 0.20);
  const payableNow = paymentPlan === "full" ? totalDealVal : paymentPlan === "cod" ? 0 : advanceAmount;
  const balanceOnDelivery = totalDealVal - payableNow;

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Left pane: Conversations List */}
        <aside className={`chat-sidebar ${activeId ? "hidden-on-mobile" : ""}`}>
          <div className="chat-sidebar-header">
            <h2>{t("chat_title")}</h2>
            <input
              type="text"
              className="chat-search"
              placeholder={t("search_chats")}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

          <div className="chat-conv-list">
            {loading && conversations.length === 0 ? (
              <div className="chat-empty-state">{t("please_wait")}</div>
            ) : filteredConversations.length === 0 ? (
              <div className="chat-empty-state">
                <p><strong>{t("no_conversations")}</strong></p>
                <p className="hint">{t("no_conversations_hint")}</p>
                <div className="empty-chat-actions">
                  <Link to="/app/lots" className="btn ghost">{t("nav_browse_buyer")}</Link>
                  <Link to="/app/demand" className="btn ghost">{t("nav_browse_farmer")}</Link>
                </div>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = Number(activeId) === c.id;
                const contact = c.other_user;
                const cItem = c.item;
                const cRole = contact?.role === "Farmer" ? t("role_farmer") : t("role_buyer");
                const contactDisplayName = contact ? translatePersonName(contact.name, lang) : t("unknown");
                const initial = contactDisplayName ? contactDisplayName.charAt(0).toUpperCase() : "?";

                return (
                  <button
                    key={c.id}
                    className={`chat-conv-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectConv(c.id)}
                  >
                    <div className="chat-avatar">{initial}</div>
                    <div className="chat-conv-info">
                      <div className="chat-conv-top">
                        <span className="chat-conv-name">{contactDisplayName}</span>
                        <span className="chat-conv-role">{cRole}</span>
                        {c.last_message && (
                          <span className="chat-conv-time">
                            {shortDate(c.last_message.created_at)}
                          </span>
                        )}
                      </div>

                      {cItem && (
                        <div className="chat-conv-item-tag">
                          🌾 {translateCrop(cItem.crop, lang)} · {rupee(cItem.price_per_kg)}
                          <small>{t("per_kg")}</small>
                        </div>
                      )}

                      <div className="chat-conv-snippet">
                        {c.last_message ? (
                          c.last_message.offer_price ? (
                            <span className="snippet-offer">
                              🤝 {t("price_offer_banner")}: {rupee(c.last_message.offer_price)}/kg
                            </span>
                          ) : (
                            c.last_message.text
                          )
                        ) : (
                          <span className="snippet-new">{t("start_chat")}</span>
                        )}
                      </div>
                    </div>

                    {c.unread_count > 0 && (
                      <span className="chat-unread-badge">{c.unread_count}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right pane: Active Conversation */}
        <section className={`chat-main ${!activeId ? "hidden-on-mobile" : ""}`}>
          {activeConv ? (
            <div className="chat-active-view">
              {/* Header */}
              <header className="chat-header">
                <button
                  className="chat-back-btn"
                  onClick={handleBackToList}
                  title={t("back_to_chats")}
                >
                  ←
                </button>
                <div className="chat-avatar large">
                  {otherUser ? translatePersonName(otherUser.name, lang).charAt(0).toUpperCase() : "?"}
                </div>
                <div className="chat-header-info">
                  <h3>{otherUser ? translatePersonName(otherUser.name, lang) : t("unknown")}</h3>
                  <div className="chat-header-meta">
                    <span className="role-tag">{otherRole}</span>
                    {otherUser?.phone && (
                      <a href={`tel:${otherUser.phone}`} className="phone-link">
                        📞 {otherUser.phone} ({t("call_now")})
                      </a>
                    )}
                  </div>
                </div>

                {latestDeal && (
                  <div className="header-deal-status">
                    {latestDeal.status === "delivered" ? (
                      <span className="badge-delivered">
                        ✓ {t("trade_completed_badge")}
                      </span>
                    ) : user?.role === "Buyer" ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-confirm-delivery"
                        onClick={() => setShowConfirmDeliveryModal(true)}
                        title={t("confirm_lot_received_title")}
                      >
                        📦 {t("confirm_lot_received")}
                      </button>
                    ) : (
                      <span className="badge-in-transit">
                        🚚 {t("awaiting_delivery_badge")}
                      </span>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-deal-confirmed"
                      onClick={() => {
                        setReceiptDeal(latestDeal);
                        setShowReceiptModal(true);
                      }}
                    >
                      📄 {t("view_receipt")} ({rupee(latestDeal.paid_amount)})
                    </button>
                  </div>
                )}
              </header>

              {/* Listing Context Banner */}
              {item && (
                <div className="chat-item-banner">
                  <div className="item-banner-left">
                    <div className="banner-top-row">
                      <span className="banner-tag">{t("discussing_item")}</span>
                      {latestDeal && (
                        <span className={`deal-locked-chip ${latestDeal.status === "delivered" ? "fulfilled" : ""}`}>
                          ✓ {latestDeal.status === "delivered" ? t("trade_completed_badge") : t("deal_confirmed_badge")}
                        </span>
                      )}
                    </div>
                    <h4>{translateCrop(item.crop, lang)}</h4>
                    <p>
                      {translateQuantity(item.quantity, lang)} · {translateLocation(item.location, lang)} · {t("grade_label")} {item.quality}
                    </p>
                  </div>
                  <div className="item-banner-price">
                    <span>{t("original_price")}</span>
                    <strong>{rupee(item.price_per_kg)}<small>{t("per_kg")}</small></strong>
                    {latestDeal && (
                      <button
                        className="btn quiet receipt-quick-link"
                        onClick={() => {
                          setReceiptDeal(latestDeal);
                          setShowReceiptModal(true);
                        }}
                      >
                        📄 {t("view_receipt")}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Stream */}
              <div className="chat-messages-stream" ref={messagesStreamRef}>
                {messages.length === 0 ? (
                  <div className="messages-empty">
                    <p>👋 {t("start_chat")}</p>
                    <p className="hint">{t("propose_price_desc")}</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === user?.id;
                    const isDealMessage = m.text && m.text.includes("Deal Confirmed");

                    return (
                      <div
                        key={m.id}
                        className={`chat-bubble-wrap ${isDealMessage ? "deal-announce" : isMe ? "outgoing" : "incoming"}`}
                      >
                        <div
                          className={`chat-bubble ${isDealMessage ? "bubble-deal" : isMe ? "bubble-mine" : "bubble-theirs"}`}
                        >
                          {/* Formal Price Offer Card */}
                          {m.offer_price != null && (
                            <div className="negotiation-card">
                              <div className="neg-header">
                                <span className="neg-icon">🤝</span>
                                <strong>{t("price_offer_banner")}</strong>
                              </div>
                              <div className="neg-price">
                                <span>{t("proposed_price")}</span>
                                <span className="price-num">
                                  {rupee(m.offer_price)}
                                  <small>{t("per_kg")}</small>
                                </span>
                              </div>

                              {item && item.price_per_kg > 0 && (
                                <div className="neg-comparison">
                                  {m.offer_price < item.price_per_kg ? (
                                    <span className="disc">
                                      -{rupee(item.price_per_kg - m.offer_price)}/kg vs listed
                                    </span>
                                  ) : m.offer_price > item.price_per_kg ? (
                                    <span className="prem">
                                      +{rupee(m.offer_price - item.price_per_kg)}/kg vs listed
                                    </span>
                                  ) : (
                                    <span>Same as listed</span>
                                  )}
                                </div>
                              )}

                              {/* Status pill & actions */}
                              <div className="neg-status-area">
                                {m.offer_status === "accepted" ? (
                                  <div className="offer-accepted-box">
                                    <span className="status-pill accepted">✓ {t("offer_accepted")}</span>
                                    {(() => {
                                      const dealForThisOffer =
                                        deals.find((d) => d.message_id === m.id) ||
                                        (latestDeal && latestDeal.conversation_id === activeConv?.id ? latestDeal : null);

                                      if (dealForThisOffer) {
                                        const planText =
                                          dealForThisOffer.payment_type === "full"
                                            ? "Paid in Full (100%)"
                                            : dealForThisOffer.payment_type === "cod"
                                            ? "COD Deal Confirmed"
                                            : "Advance Paid (20%)";

                                        return (
                                          <div className="offer-already-paid-area">
                                            <span className="status-pill paid-locked">
                                              ✓ {planText} ({rupee(dealForThisOffer.paid_amount)})
                                            </span>
                                            <button
                                              type="button"
                                              className="btn btn-receipt-view"
                                              onClick={() => {
                                                setReceiptDeal(dealForThisOffer);
                                                setShowReceiptModal(true);
                                              }}
                                            >
                                              📄 {t("view_receipt")}
                                            </button>
                                          </div>
                                        );
                                      }

                                      if (user?.role === "Buyer") {
                                        return (
                                          <button
                                            className="btn btn-pay-now"
                                            onClick={() => openPaymentModal(m)}
                                          >
                                            💳 {t("confirm_and_pay")}
                                          </button>
                                        );
                                      }

                                      return (
                                        <span className="farmer-wait-text">
                                          ⏳ {t("waiting_buyer_payment")}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                ) : m.offer_status === "rejected" ? (
                                  <span className="status-pill rejected">✕ {t("offer_rejected")}</span>
                                ) : (
                                  <>
                                    <span className="status-pill pending">⏳ {t("offer_pending")}</span>
                                    {!isMe && (
                                      <div className="neg-action-buttons">
                                        <button
                                          className="btn btn-sm btn-accept"
                                          onClick={() => handleOfferStatus(m.id, "accepted")}
                                        >
                                          ✓ {t("accept_offer")}
                                        </button>
                                        <button
                                          className="btn btn-sm btn-decline"
                                          onClick={() => handleOfferStatus(m.id, "rejected")}
                                        >
                                          ✕ {t("decline_offer")}
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {m.text && <p className="bubble-text">{m.text}</p>}

                          <span className="bubble-time">
                            {shortDate(m.created_at)}
                            {isMe && !isDealMessage && (
                              <span className="read-status">{m.is_read ? " ✓✓" : " ✓"}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Replies Carousel */}
              <div className="quick-replies-bar">
                <span className="quick-label">{t("quick_replies_label")}:</span>
                <div className="quick-replies-list">
                  {quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      className="quick-chip"
                      onClick={() => handleSend(qr)}
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer Drawer / Popover */}
              {showOfferBox && (
                <div className="offer-composer-drawer">
                  <div className="offer-drawer-content">
                    <div className="offer-drawer-header">
                      <strong>🤝 {t("propose_price_title")}</strong>
                      <button
                        className="btn quiet"
                        onClick={() => setShowOfferBox(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="offer-hint">{t("propose_price_desc")}</p>
                    <div className="offer-input-row">
                      <div className="field-group">
                        <label>{t("your_offer_price")}</label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          placeholder="e.g. 28.50"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <button
                        className="btn primary"
                        disabled={!offerPrice || Number(offerPrice) <= 0 || sending}
                        onClick={() => handleSend(text.trim(), offerPrice)}
                      >
                        {t("send_offer")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Composer */}
              <footer className="chat-composer">
                {!latestDeal && (
                  <button
                    type="button"
                    className={`btn make-offer-btn ${showOfferBox ? "active" : ""}`}
                    onClick={() => setShowOfferBox(!showOfferBox)}
                    title={t("make_offer")}
                  >
                    🤝 {t("counter_offer")}
                  </button>
                )}

                <form
                  className="chat-input-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <input
                    type="text"
                    className="chat-text-input"
                    placeholder={t("type_message")}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn primary send-btn"
                    disabled={(!text.trim() && !offerPrice) || sending}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>{t("send")}</span>
                  </button>
                </form>
              </footer>
            </div>
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">💬</div>
                <h3>{t("chat_title")}</h3>
                <p>{t("select_conversation")}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Payment & Deal Confirmation Modal */}
      {showPaymentModal && (
        <div className="payment-modal-backdrop">
          <div className="payment-modal-card">
            <header className="payment-modal-header">
              <div>
                <h2>{t("confirm_deal_title")}</h2>
                <span className="sub">{t("secured_by")}</span>
              </div>
              <button
                className="btn quiet close-modal-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </header>

            <div className="payment-modal-body">
              {/* Deal Summary Box */}
              <div className="deal-summary-box">
                <div className="summary-item-main">
                  <div>
                    <span className="summary-label">{t("field_crop")}</span>
                    <h3>{translateCrop(activeConv?.item?.crop, lang)}</h3>
                    <p className="farmer-credit">
                      {t("role_farmer")}: <strong>{translatePersonName(otherUser?.name, lang)}</strong>
                      {otherUser?.phone && <span> · 📞 {otherUser.phone}</span>}
                    </p>
                  </div>
                  <div className="agreed-rate-badge">
                    <span>{t("agreed_rate")}</span>
                    <strong>{rupee(currentAgreedRate)}<small>{t("per_kg")}</small></strong>
                  </div>
                </div>

                <div className="quantity-calc-row">
                  <div className="field-group">
                    <label>{t("quantity_kg_label")}</label>
                    <div className="kg-input-wrap">
                      <input
                        type="number"
                        min="1"
                        step="10"
                        value={dealQuantityKg}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 0);
                          setDealQuantityKg(val);
                          setDealQuantityStr(`${val} kg`);
                        }}
                      />
                      <span className="unit-label">kg ({Math.round(dealQuantityKg / 100 * 10) / 10} Qtl)</span>
                    </div>
                  </div>

                  <div className="total-deal-calc">
                    <span>{t("total_deal_amount")}</span>
                    <strong>{rupee(totalDealVal)}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Plan Selector */}
              <div className="payment-section">
                <h4>{t("choose_payment_plan")}</h4>
                <div className="plan-options">
                  <label className={`plan-card ${paymentPlan === "advance" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="paymentPlan"
                      value="advance"
                      checked={paymentPlan === "advance"}
                      onChange={() => setPaymentPlan("advance")}
                    />
                    <div className="plan-info">
                      <div className="plan-title-row">
                        <strong>{t("plan_advance_title")}</strong>
                        <span className="plan-price">{rupee(advanceAmount)}</span>
                      </div>
                      <p>{t("plan_advance_desc")}</p>
                    </div>
                  </label>

                  <label className={`plan-card ${paymentPlan === "full" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="paymentPlan"
                      value="full"
                      checked={paymentPlan === "full"}
                      onChange={() => setPaymentPlan("full")}
                    />
                    <div className="plan-info">
                      <div className="plan-title-row">
                        <strong>{t("plan_full_title")}</strong>
                        <span className="plan-price">{rupee(totalDealVal)}</span>
                      </div>
                      <p>{t("plan_full_desc")}</p>
                    </div>
                  </label>

                  <label className={`plan-card ${paymentPlan === "cod" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="paymentPlan"
                      value="cod"
                      checked={paymentPlan === "cod"}
                      onChange={() => setPaymentPlan("cod")}
                    />
                    <div className="plan-info">
                      <div className="plan-title-row">
                        <strong>{t("plan_cod_title")}</strong>
                        <span className="plan-price">{rupee(0)}</span>
                      </div>
                      <p>{t("plan_cod_desc")}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Mode Selection */}
              {paymentPlan !== "cod" ? (
                <div className="payment-channel-section">
                  <h4>Choose Payment Mode</h4>
                  <div className="channel-cards-grid">
                    <label className={`channel-card ${onlineMethod === "upi" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="onlineMethod"
                        value="upi"
                        checked={onlineMethod === "upi"}
                        onChange={() => setOnlineMethod("upi")}
                      />
                      <div className="channel-card-content">
                        <div className="channel-top">
                          <span className="channel-icon">⚡</span>
                          <strong>UPI (Instant / QR)</strong>
                          <span className="channel-badge recommended">Zero Fee</span>
                        </div>
                        <p className="channel-sub">Scan Dynamic QR or pay via GPay, PhonePe, Paytm, BHIM</p>
                        <div className="channel-logos">
                          <span className="mini-logo gpay">GPay</span>
                          <span className="mini-logo phonepe">PhonePe</span>
                          <span className="mini-logo paytm">Paytm</span>
                          <span className="mini-logo bhim">BHIM</span>
                        </div>
                      </div>
                    </label>

                    <label className={`channel-card ${onlineMethod === "razorpay" ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="onlineMethod"
                        value="razorpay"
                        checked={onlineMethod === "razorpay"}
                        onChange={() => setOnlineMethod("razorpay")}
                      />
                      <div className="channel-card-content">
                        <div className="channel-top">
                          <span className="channel-icon">💳</span>
                          <strong>Cards & Netbanking</strong>
                          <span className="channel-badge rzp-blue">Razorpay</span>
                        </div>
                        <p className="channel-sub">Debit / Credit Cards, Netbanking (All Banks), Wallets</p>
                        <div className="channel-logos">
                          <span className="mini-logo">Visa</span>
                          <span className="mini-logo">Mastercard</span>
                          <span className="mini-logo">RuPay</span>
                          <span className="mini-logo">50+ Banks</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="payment-gateway-notice cod">
                  <strong>🤝 Pay upon Mandi Delivery (COD)</strong>
                  <p className="gateway-desc">
                    Deal is locked in chat. Settle directly with farmer upon physical grain arrival.
                  </p>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="payment-breakdown-box">
                <div className="breakdown-row">
                  <span>{t("amount_payable_now")}:</span>
                  <strong className="payable-highlight">{rupee(payableNow)}</strong>
                </div>
                {balanceOnDelivery > 0 && (
                  <div className="breakdown-row sub">
                    <span>{t("balance_on_delivery")}:</span>
                    <span>{rupee(balanceOnDelivery)}</span>
                  </div>
                )}
              </div>
            </div>

            <footer className="payment-modal-footer">
              <button
                className="btn quiet"
                disabled={processingPayment}
                onClick={() => setShowPaymentModal(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="btn primary big pay-submit-btn"
                disabled={processingPayment || totalDealVal <= 0}
                onClick={handleProceedToPayment}
              >
                {processingPayment ? (
                  <span>⏳ {t("payment_processing")}</span>
                ) : paymentPlan === "cod" ? (
                  <span>🤝 {t("confirm_deal_btn")}</span>
                ) : onlineMethod === "upi" ? (
                  <span>⚡ Pay with UPI ({rupee(payableNow)})</span>
                ) : (
                  <span>🔒 Pay via Razorpay ({rupee(payableNow)})</span>
                )}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Razorpay Complete Payment Gateway */}
      <RazorpayModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        onSuccess={handleRazorpaySuccess}
        amount={payableNow}
        totalAmount={totalDealVal}
        plan={paymentPlan}
        initialTab={onlineMethod === "upi" ? "upi" : "card"}
        dealInfo={{
          crop: activeConv?.item?.crop,
          quantity: dealQuantityStr || `${dealQuantityKg} kg`,
          quantityKg: dealQuantityKg,
          farmerName: otherUser?.name,
          buyerName: user?.name,
          pricePerKg: currentAgreedRate,
        }}
        lang={lang}
        t={t}
      />

      {/* Confirm Delivery / Lot Received Modal */}
      {showConfirmDeliveryModal && latestDeal && (
        <div className="payment-modal-backdrop" onClick={() => !confirmingDelivery && setShowConfirmDeliveryModal(false)}>
          <div className="payment-modal-card delivery-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div className="payment-title-row">
                <span className="escrow-lock-icon">📦</span>
                <div>
                  <h3>{t("confirm_lot_received_title")}</h3>
                  <p className="escrow-subtitle">
                    {translateCrop(latestDeal.crop, lang)} · {latestDeal.quantity}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => !confirmingDelivery && setShowConfirmDeliveryModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="delivery-confirm-body">
              <div className="deal-summary-box">
                <div className="deal-summary-row">
                  <span>{t("th_crop")}:</span>
                  <strong>{translateCrop(latestDeal.crop, lang)}</strong>
                </div>
                <div className="deal-summary-row">
                  <span>{t("field_quantity")}:</span>
                  <strong>{latestDeal.quantity} ({latestDeal.quantity_kg} kg)</strong>
                </div>
                <div className="deal-summary-row">
                  <span>{t("agreed_rate")}:</span>
                  <strong>{rupee(latestDeal.agreed_price_per_kg)}/kg</strong>
                </div>
                <div className="deal-summary-row total-highlight">
                  <span>{t("total_deal_amount")}:</span>
                  <strong className="text-forest">{rupee(latestDeal.total_amount)}</strong>
                </div>
              </div>

              <div className="delivery-notice-callout">
                <div className="notice-icon">ℹ️</div>
                <p>{t("confirm_lot_received_desc")}</p>
              </div>
            </div>

            <div className="payment-actions">
              <button
                type="button"
                className="btn primary btn-complete-delivery"
                disabled={confirmingDelivery}
                onClick={handleConfirmDelivery}
              >
                {confirmingDelivery ? t("confirming_delivery") : `✓ ${t("confirm_lot_received_btn")}`}
              </button>
              <button
                type="button"
                className="btn ghost"
                disabled={confirmingDelivery}
                onClick={() => setShowConfirmDeliveryModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Deal Receipt Modal */}
      {showReceiptModal && receiptDeal && (
        <div className="payment-modal-backdrop">
          <div className="receipt-modal-card">
            <div className="receipt-sheet" id="printable-deal-receipt">
              <div className="receipt-top-banner">
                <div className="receipt-brand">
                  <h2>AgriConnect</h2>
                  <span>{t("deal_receipt_title")}</span>
                </div>
                <div className="receipt-stamp">
                  <span className="stamp-verified">✓ {t("receipt_paid")}</span>
                </div>
              </div>

              <div className="receipt-ref-grid">
                <div>
                  <span className="ref-label">{t("transaction_id")}</span>
                  <strong className="code-font">{receiptDeal.payment_id}</strong>
                </div>
                <div>
                  <span className="ref-label">{t("receipt_date")}</span>
                  <span>{shortDate(receiptDeal.created_at)}</span>
                </div>
                <div>
                  <span className="ref-label">{t("receipt_status")}</span>
                  <strong className={receiptDeal.status === "delivered" ? "status-delivered-badge" : "status-confirmed"}>
                    {receiptDeal.status === "delivered"
                      ? t("receipt_delivered")
                      : `${receiptDeal.status.toUpperCase()} (ESCROW)`}
                  </strong>
                </div>
                {receiptDeal.rrn && (
                  <div>
                    <span className="ref-label">Bank Ref (RRN)</span>
                    <strong className="code-font">{receiptDeal.rrn}</strong>
                  </div>
                )}
              </div>

              <div className="receipt-parties">
                <div className="party-col">
                  <span className="col-head">{t("receipt_farmer")}</span>
                  <strong>{translatePersonName(otherUser?.name || "Farmer", lang)}</strong>
                  <span>{otherUser?.phone ? `📞 ${otherUser.phone}` : ""}</span>
                </div>
                <div className="party-col">
                  <span className="col-head">{t("receipt_buyer")}</span>
                  <strong>{translatePersonName(user?.name, lang)} ({t("you")})</strong>
                  <span>{user?.phone ? `📞 ${user.phone}` : ""}</span>
                </div>
              </div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>{t("th_crop")}</th>
                    <th>{t("field_quantity")}</th>
                    <th>{t("agreed_rate")}</th>
                    <th className="num">{t("total_deal_amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>{translateCrop(receiptDeal.crop, lang)}</strong></td>
                    <td>{receiptDeal.quantity} ({receiptDeal.quantity_kg} kg)</td>
                    <td>{rupee(receiptDeal.agreed_price_per_kg)}/kg</td>
                    <td className="num"><strong>{rupee(receiptDeal.total_amount)}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div className="receipt-totals">
                <div className="tot-row">
                  <span>{t("amount_paid")} ({receiptDeal.payment_type?.toUpperCase()} via {receiptDeal.payment_method}):</span>
                  <strong className="paid-bold">{rupee(receiptDeal.paid_amount)}</strong>
                </div>
                {receiptDeal.total_amount > receiptDeal.paid_amount && (
                  <div className="tot-row sub">
                    <span>{t("balance_on_delivery")}:</span>
                    <span>{rupee(receiptDeal.total_amount - receiptDeal.paid_amount)}</span>
                  </div>
                )}
              </div>

              <div className="receipt-footer-assurance">
                <p>🔒 {t("secured_by")}</p>
                <small>{t("footer_text")}</small>
              </div>
            </div>

            <div className="receipt-modal-actions">
              <button
                className="btn primary"
                onClick={() => window.print()}
              >
                🖨️ {t("print_receipt")}
              </button>
              <button
                className="btn ghost"
                onClick={() => setShowReceiptModal(false)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
