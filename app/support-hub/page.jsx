import './styles.css'
import { FaWhatsapp } from 'react-icons/fa'

export default function SupportPage() {
  return (
    <div className="support-container">
      <div className="support-card">
        <div className="support-icon">💬</div>
        <h1 className="support-title">Live Support Hub</h1>
        <div className="support-divider" />
        <p className="support-description">
          We are in the final stage of launching our <strong>Live Support Hub</strong>.
          It will be available within a week for trial access.
        </p>
        <p className="support-subtitle">
          Join our WhatsApp group to get early updates!
        </p>
        <div className="support-buttons">
          <a
            className="whatsapp-btn"
            href="https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} />
            Join WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
