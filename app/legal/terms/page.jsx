"use client"
import "./terms.css"

const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <div className="logo">📚 KIITHub</div>
          <h1>📋 Terms and Conditions</h1>
        </div>

        <div className="policy-content">
          <div className="last-updated">
            <strong>Last updated:</strong> January 8, 2025
          </div>

          <section className="policy-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using KIITHUB ("the Platform"), you agree to be legally bound by these Terms and
              Conditions, our Privacy Policy, and any future updates. If you do not agree to these terms, please refrain
              from using the platform.
            </p>
          </section>

          <section className="policy-section">
            <h3>2. Eligibility</h3>
            <p>
              KIITHUB is exclusively intended for students, faculty, and authorized members of KIIT University. Access
              is restricted to individuals with a valid <strong>@kiit.ac.in</strong> email address. By using this
              platform, you confirm that you are affiliated with KIIT University.
            </p>
          </section>

          <section className="policy-section responsibilities">
            <h3>3. User Responsibilities</h3>
            <p>As a user of KIITHUB, you agree to:</p>
            <ul className="responsibilities-list">
              <li>
                Provide accurate, complete, and up-to-date information during registration and while using the platform
              </li>
              <li>Use the platform solely for academic, informational, and university-related purposes</li>
              <li>Comply with all applicable laws and university policies</li>
              <li>Respect the intellectual property rights of the platform and its users</li>
              <li>Maintain the confidentiality of your account and login credentials</li>
              <li>Promptly report any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="policy-section prohibited">
            <h3>4. Prohibited Activities</h3>
            <p>Users must not engage in any of the following:</p>
            <ul className="prohibited-list">
              <li>Sharing copyrighted or unauthorized materials without proper consent</li>
              <li>Posting offensive, abusive, defamatory, or discriminatory content</li>
              <li>Attempting to breach, hack, or exploit vulnerabilities in the platform or its services</li>
             
              <li>Interfering with or disrupting the platform's functionality or security</li>
            </ul>
          </section>

          
          <section className="policy-section changes">
            <h3>6. Changes to Terms</h3>
            <p>
              KIITHUB reserves the right to modify these Terms and Conditions at any time. Updates will be communicated
              via the platform, and continued use after changes indicates acceptance of the new terms.
            </p>
            <div className="changes-notice">
              <div className="notice-icon">📢</div>
              <div>
                <h4>How We Notify You</h4>
                <p>We'll send notifications through the platform and via email for major changes to these terms.</p>
              </div>
            </div>
          </section>

          <section className="policy-section contact">
            <h3>7. Contact</h3>
            <p>
              For questions or concerns regarding these Terms, please contact us via the feedback form available on the
              platform.
            </p>
            <div className="contact-info">
              <div className="contact-method">
                <div className="method-icon">📝</div>
                <div>
                  <h4>Feedback Form</h4>
                  <p>Available on the main platform</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">⚡</div>
                <div>
                  <h4>Quick Response</h4>
                  <p>We respond within 24 hours</p>
                </div>
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

export default TermsPage
