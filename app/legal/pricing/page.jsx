"use client"
import "./pricing.css"

export default function PricingPage() {
  const plans = [
    {
      name: "🆓 Free Plan",
      price: "₹0",
      period: "/month",
      features: ["Study materials access", "CGPA Calculator", "Basic announcements", "To-Do List", "Community access"],
      buttonText: "Current Plan",
      isFree: true,
    },
    {
      name: "⭐ Premium Plan",
      price: "₹25",
      period: "/semester",
      features: [
        "All Free features",
        "Section swapping",
        "Live Dashboard",
        "Faculty reviews",
        "Priority support",
        "Advanced analytics",
      ],
      buttonText: "Will be available next sem",
      isFree: false,
      popular: true,
    },
  ]

  const faqs = [
    {
      question: "Why premium?",
      answer: "Premium helps maintain live features like section swapping and faculty reviews.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! Cancel anytime with our flexible cancellation policy.",
    },
    {
      question: "Is payment secure?",
      answer: "Absolutely. We use industry-standard encryption for all payments.",
    },
  ]

  return (
    <div className="pricing-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo">📚 KIITHub</div>
          <h1>💰 Pricing</h1>
          <p className="subtitle">Choose the plan that works best for you</p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`card ${plan.popular ? "popular" : ""}`}>
             

              <div className="card-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price}
                  <span>{plan.period}</span>
                </div>
              </div>

              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>✅ {feature}</li>
                ))}
              </ul>

              <button className={`btn ${plan.isFree ? "btn-free" : "btn-premium"}`} disabled={plan.isFree}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>FAQ</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="back-section">
          <button className="back-btn" onClick={() => window.history.back()}>
            ← Back to KIITHub
          </button>
        </div>
      </div>
    </div>
  )
}