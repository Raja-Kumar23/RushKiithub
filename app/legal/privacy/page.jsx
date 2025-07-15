"use client"
import "./privacy.css"

const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <div className="logo">📚 KIITHub</div>
          <h1>🔒 Privacy Policy</h1>
        </div>

        <div className="policy-content">
          <div className="last-updated">
            <strong>Last updated:</strong> January 8, 2025
          </div>

          <section className="policy-section">
            <h3>Information We Collect</h3>
            <p>
              KIITHUB is exclusively designed for KIIT University students and requires sign-in using your KIIT Gmail ID
              (e.g., *@kiit.ac.in). We collect limited personal information to provide essential features such as
              section swapping, faculty reviews, and academic tools.
            </p>
            <p>The information we collect includes:</p>
            <ul className="info-list">
              <li>Your KIIT Gmail address (used for authentication and verification)</li>
              <li>Basic profile information provided by your Google account (name, email, profile picture)</li>
              <li>
                Information you voluntarily share during interactions — e.g., section preferences, faculty feedback, or
                messages through the feedback form
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h3>How We Use Your Information</h3>
            <ul className="usage-list">
              <li>To verify that you are a KIIT University student</li>
              <li>To allow access to platform features like section swapping and faculty reviews</li>
              <li>To improve the platform based on usage and feedback</li>
              <li>To notify you about important updates or features</li>
            </ul>
          </section>

          <section className="policy-section security">
            <h3>Data Security</h3>
            <p>
              We use modern authentication and encryption techniques (such as Firebase Authentication) to ensure your
              data is secure. Your information is not shared with any third-party services or individuals without your
              consent.
            </p>
            <div className="security-features">
              <div className="security-item">
                <div className="security-icon">🔐</div>
                <div>
                  <h4>Encryption</h4>
                  <p>All data is encrypted in transit and at rest</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-icon">🛡️</div>
                <div>
                  <h4>Firebase Auth</h4>
                  <p>Industry-standard authentication system</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <div>
                  <h4>No Third-Party Sharing</h4>
                  <p>Your data stays within our secure system</p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section control">
            <h3>Your Control</h3>
            <p>
              You can request deletion of your data or stop using the platform anytime. Just reach out to us through the
              feedback form and we'll assist you.
            </p>
            <div className="control-options">
              <div className="control-item">
                <h4>Data Access</h4>
                <p>Request a copy of all your data</p>
              </div>
              <div className="control-item">
                <h4>Data Correction</h4>
                <p>Update or correct your information</p>
              </div>
              <div className="control-item">
                <h4>Data Deletion</h4>
                <p>Permanently delete your account and data</p>
              </div>
            </div>
          </section>

          <section className="policy-section contact">
            <h3>Contact Us</h3>
            <p>
              Have questions, suggestions, or privacy concerns? Please contact us via the feedback form on our platform.
              We're here to help and continuously improve your experience.
            </p>
            <div className="contact-promise">
              <div className="promise-item">
                <strong>Quick Response:</strong> We respond to privacy inquiries within 24 hours
              </div>
              <div className="promise-item">
                <strong>Transparency:</strong> We'll clearly explain how your data is used
              </div>
              <div className="promise-item">
                <strong>Action:</strong> We'll promptly address any privacy concerns
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

export default PrivacyPage
