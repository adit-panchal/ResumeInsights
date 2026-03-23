import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem("userPlan");
    if (storedPlan) setPurchasedPlan(storedPlan);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form State

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  const navigate = useNavigate();

  const handleOpenModal = (e, plan) => {
    e.preventDefault();
    setSelectedPlan(plan);
    setShowModal(true);
    setPaymentSuccess(false);

    // Reset form

    setNameOnCard("");
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Store the purchased plan in local storage
      localStorage.setItem("userPlan", selectedPlan.title);
      localStorage.setItem("isPremium", "true");

      // Simulate redirects after success
      setTimeout(() => {
        setShowModal(false);
        navigate("/upload");
      }, 2000);
    }, 2000);
  };

  // Payment Form Input Handlers for formatting
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    let formatted = value;
    if (value.length >= 3) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Add slash
    }
    setExpiryDate(formatted);
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setCvc(value);
  };

  const plans = [
    {
      title: "Free Plan",
      price: "$0",
      features: [
        "Basic Resume Formatting Check",
        "Grammar and Spelling Review",
        "Keyword Presence Check",
        "Compatibility Score",
        "Email Support",
        "Basic Guidance",
      ],
      buttonText: "Get Started",
      buttonClass: "btn-free",
      link: "/upload",
      isPremium: false,
    },
    {
      title: "Pro Plan",
      price: "$10",
      features: [
        "Detailed ATS Analysis",
        "Custom Recommendations",
        "Skill Match Assessment",
        "PDF Report Download",
        "Priority Email Support",
        "Personalized Keyword Insights",
      ],
      buttonText: "Upgrade Now",
      buttonClass: "btn-pro-plan",
      link: "#",
      popular: true,
      isPremium: true,
    },
    {
      title: "Premium Plan",
      price: "$30",
      features: [
        "AI-Powered Resume Optimization",
        "Job-Specific Tailoring",
        "Competitor Analysis",
        "Dedicated Expert Support",
        "Unlimited Edits & Downloads",
        "Profile Building Assistance",
      ],
      buttonText: "Get Premium",
      buttonClass: "btn-premium",
      link: "#",
      isPremium: true,
    },
  ];

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2>
          Choose Your <span>Plan</span>
        </h2>
        <p>
          Unlock the full potential of your resume with our advanced tools
          securely.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
            key={index}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}

            <div className="card-header">
              <h3>{plan.title}</h3>
              <div className="price">
                {plan.price}
                <span>/ Forever</span>
              </div>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="card-footer">
              {plan.isPremium ? (
                purchasedPlan === plan.title ? (
                  <button
                    className={`btn plan-btn btn-upgraded`}
                    disabled
                  >
                    ✓ Plan Upgraded
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleOpenModal(e, plan)}
                    className={`btn plan-btn ${plan.buttonClass}`}
                  >
                    {plan.buttonText}
                  </button>
                )
              ) : (
                <Link
                  to={plan.link}
                  className={`btn plan-btn ${plan.buttonClass}`}
                  style={{ display: "block", textAlign: "center" }}
                >
                  {plan.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="payment-modal-overlay" onClick={handleCloseModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Complete Purchase: <span>{selectedPlan?.title}</span>
              </h3>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            {paymentSuccess ? (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h3>Payment Successful!</h3>
                <p>
                  Welcome to {selectedPlan?.title}. Redirecting you to the
                  dashboard...
                </p>
              </div>
            ) : (
              <form className="payment-form" onSubmit={handlePaymentSubmit}>
                <div className="form-group-payment">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>

                <div className="form-group-payment">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9101 1121"
                    required
                    maxLength="19"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group-payment half">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required
                      maxLength="5"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                    />
                  </div>
                  <div className="form-group-payment half">
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      required
                      maxLength="4"
                      value={cvc}
                      onChange={handleCvcChange}
                    />
                  </div>
                </div>

                <div className="payment-summary">
                  <div>
                    <span>Total amount:</span>{" "}
                    <strong>{selectedPlan?.price}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary submit-payment-btn"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing securely..."
                    : `Pay ${selectedPlan?.price}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
