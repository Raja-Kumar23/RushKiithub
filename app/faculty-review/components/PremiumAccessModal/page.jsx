import React, { useState } from 'react';
import { Crown, Star, Shield, Zap, Users, MessageCircle, X } from 'lucide-react';
import PaymentModal from '../PaymentModal/page';
import './styles.css';

const PremiumAccessModal = ({
  countdown,
  onCountdownComplete,
  userRollNumber,
  userEmail = '',
  onPaymentSuccess,
  isDarkMode = false,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const features = [
    {
      icon: MessageCircle,
      title: 'Unlimited Reviews',
      description: 'Submit unlimited reviews for all teachers and sections',
    },
    {
      icon: Users,
      title: 'All Sections Access',
      description: 'View reviews and data from all sections and years',
    },
    {
      icon: Zap,
      title: 'AI Chat Assistant',
      description: 'Get personalized teacher recommendations using AI',
    },
    {
      icon: Shield,
      title: 'Premium Support',
      description: 'Priority customer support and faster response times',
    },
    {
      icon: Star,
      title: 'Advanced Analytics',
      description: 'Detailed teacher statistics and trend analysis',
    },
  ];

  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    // Refresh the page to update premium status
    window.location.reload();
  };

  const handlePaymentFailure = (error) => {
    setPaymentError(error);
    setShowPaymentModal(false);
  };

  return (
    <>
      <div className="premium-modal-overlay">
        <div className={`premium-modal ${isDarkMode ? 'dark' : ''}`}>
          
          {/* Header */}
          <div className="premium-modal-header">
            <button className="close-button" onClick={onCountdownComplete}>
              <X size={20} />
            </button>
            
            <div className="header-icon">
              <Crown size={48} />
            </div>
            
            <h1>Upgrade to Premium</h1>
            <p>Unlock unlimited access to all features</p>
            
            {/* Countdown */}
            <div className="countdown-section">
              <p>Redirecting to homepage in:</p>
              <div className="countdown-timer">{countdown}s</div>
            </div>
          </div>

          <div className="premium-modal-body">
            {/* Error Message */}
            {paymentError && (
              <div className="error-message">
                <strong>Payment Error:</strong> {paymentError}
              </div>
            )}

            {/* Features Grid */}
            <div className="features-grid">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why Premium Section */}
            <div className="why-premium">
              <h2>Why Choose Premium?</h2>
              <div className="premium-benefits">
                <div className="benefit-item">
                  <div className="benefit-number">1</div>
                  <div>
                    <strong>Complete Access</strong>
                    <p>Access all teacher reviews, sections, and years without any restrictions</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">2</div>
                  <div>
                    <strong>Unlimited Reviews</strong>
                    <p>Share your experiences and help fellow students make informed decisions</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">3</div>
                  <div>
                    <strong>AI-Powered Insights</strong>
                    <p>Get personalized recommendations based on your preferences and academic goals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="premium-actions">
              <button className="upgrade-button" onClick={handleUpgradeClick}>
                <Crown size={20} />
                Upgrade to Premium Now
              </button>
              
              <div className="action-links">
                <button className="link-button" onClick={onCountdownComplete}>
                  Maybe Later
                </button>
                <span className="divider">•</span>
                <button className="link-button" onClick={() => window.open('mailto:support@kiithub.in', '_blank')}>
                  Contact Support
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="trust-section">
              <div className="trust-item">
                <Shield size={16} />
                <span>Secure Payment</span>
              </div>
              <div className="trust-item">
                <Star size={16} />
                <span>Trusted by 1000+ Students</span>
              </div>
              <div className="trust-item">
                <Zap size={16} />
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userEmail={userEmail}
          userRollNumber={userRollNumber}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default PremiumAccessModal;