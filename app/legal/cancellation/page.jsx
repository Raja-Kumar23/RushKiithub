"use client"
import "./cancellation.css"

const CancellationPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <div className="logo">📚 KIITHub</div>
          <h1>🔄 Cancellation & Refund Policy</h1>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h3>Cancellation Policy</h3>
            <p>
              You may cancel your KIITHUB premium subscription at any time from your account settings or by contacting
              us through the feedback or support form.
            </p>
            <ul className="policy-list">
              <li>
                If you cancel within <strong>7 days</strong> of purchase, you are eligible for a{" "}
                <strong>half refund</strong>.
              </li>
              <li>
                After 7 days, your subscription will remain active until the end of the current billing cycle, but{" "}
                <strong>no refunds</strong> will be issued.
              </li>
              <li>Auto-renewal can be turned off anytime before the next billing date to avoid future charges.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>Refund Policy</h3>
            <p>
              We offer a <strong>7-day money-back guarantee</strong> for all new premium plan purchases. To request a
              refund within this period, please contact us through the feedback form with your payment details.
            </p>
            <p>Refunds will be processed within 5–7 business days after approval. Refunds are not applicable for:</p>
            <ul className="policy-list">
              <li>Renewals beyond the 7-day window</li>
              <li>Violations of our terms of service</li>
              <li>Accounts flagged for abuse or misuse of premium services</li>
            </ul>
          </section>

          

          <section className="policy-section note">
            <h3>Important Note</h3>
            <p>
              KIITHUB premium services are designed to enhance your academic experience. We recommend exploring all
              available free features before subscribing.
            </p>
            <p>
              If you're experiencing issues with premium features, please contact our support team first - we're here to
              help resolve any problems you might encounter.
            </p>
          </section>

          <section className="policy-section contact">
            <h3>Need Help?</h3>
            <p>
              For cancellation requests, refund inquiries, or any questions about your subscription, please use the
              feedback form on our platform or contact us directly.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Response Time:</strong> Within 24 hours
              </div>
              <div className="contact-item">
                <strong>Refund Processing:</strong> 5-7 business days
              </div>
            </div>
          </section>
        </div>

        <div className="back-to-home">
          <button onClick={() => window.history.back()} className="back-btn">
            ← Back to KIITHub
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancellationPage
