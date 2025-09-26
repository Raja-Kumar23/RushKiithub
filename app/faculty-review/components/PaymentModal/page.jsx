"use client";

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Check, AlertCircle, Star, Zap } from 'lucide-react';
import './styles.css';

const PaymentModal = ({
  isOpen,
  onClose,
  userEmail,
  userRollNumber,
  onPaymentSuccess,
  onPaymentFailure,
  isDarkMode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'processing', 'success', 'error'

  const plans = {
    premium: {
      name: 'Premium Access',
      price: 99,
      originalPrice: 199,
      duration: '1 Year',
      popular: true,
      features: [
        'Unlimited teacher reviews',
        'Access to all sections and years', 
        'Advanced AI chat assistant',
        'Priority customer support',
        'No ads experience',
        'Export review data'
      ]
    },
    lifetime: {
      name: 'Lifetime Access',
      price: 299,
      originalPrice: 599,
      duration: 'Lifetime',
      popular: false,
      features: [
        'All Premium features',
        'Lifetime access guarantee',
        'Future feature updates',
        'Priority support forever',
        'One-time payment',
        'Early access to new features'
      ]
    }
  };

  useEffect(() => {
    if (isOpen && !razorpayLoaded) {
      loadRazorpayScript();
    }
  }, [isOpen, razorpayLoaded]);

  const loadRazorpayScript = () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(false);
      };
      document.head.appendChild(script);
    });
  };

  const savePaymentToFirebase = async (paymentData) => {
    try {
      // Import Firebase functions
      const { getDatabase, ref, set } = await import('firebase/database');
      const { getFirestore, doc, setDoc } = await import('firebase/firestore');
      
      const db = getDatabase();
      const firestore = getFirestore();
      
      // Save to Realtime Database
      const paymentRef = ref(db, `payments/${userRollNumber}/${paymentData.razorpay_payment_id}`);
      await set(paymentRef, {
        ...paymentData,
        email: userEmail,
        rollNumber: userRollNumber,
        plan: selectedPlan,
        amount: plans[selectedPlan].price,
        timestamp: Date.now(),
        status: 'completed'
      });

      // Save to Firestore for premium access
      const premiumAccessRef = doc(firestore, 'accesscontrol', 'paiduser');
      await setDoc(premiumAccessRef, {
        [userEmail]: true,
        [userRollNumber]: true
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Error saving payment to Firebase:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      onPaymentFailure('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);
    setPaymentStep('processing');

    try {
      const plan = plans[selectedPlan];
      
      const options = {
        key: 'rzp_live_RCCjxLeJsvFwJ5', // Replace with your actual Razorpay key ID
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        name: 'KIITHub Premium',
        description: `${plan.name} - ${plan.duration}`,
        image: 'https://kiithub.in/logo.png',
        prefill: {
          name: userEmail.split('@')[0].replace('.', ' '),
          email: userEmail,
          contact: '', // Add contact if available
        },
        theme: {
          color: isDarkMode ? '#3B82F6' : '#2563EB',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setPaymentStep('select');
          }
        },
        handler: async (response) => {
          try {
            // Save payment details to Firebase
            const saved = await savePaymentToFirebase(response);
            
            if (saved) {
              setPaymentStep('success');
              setTimeout(() => {
                onPaymentSuccess();
                onClose();
              }, 2000);
            } else {
              throw new Error('Failed to save payment details');
            }
          } catch (error) {
            console.error('Payment handler error:', error);
            setPaymentStep('error');
            onPaymentFailure('Payment completed but failed to activate premium access. Please contact support.');
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', (response) => {
        setPaymentStep('error');
        onPaymentFailure(response.error.description || 'Payment failed. Please try again.');
        setIsLoading(false);
      });

      razorpayInstance.open();
      setIsLoading(false);

    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStep('error');
      setIsLoading(false);
      onPaymentFailure('Failed to initialize payment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className={`payment-modal ${isDarkMode ? 'dark' : ''}`}>
        
        {/* Header */}
        <div className="payment-modal-header">
          <div className="header-content">
            <div>
              <h2>Upgrade to Premium</h2>
              <p>Unlock unlimited access to all features</p>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {paymentStep === 'select' && (
          <div className="payment-modal-body">
            {/* Plans */}
            <div className="plans-grid">
              {Object.entries(plans).map(([planKey, plan]) => (
                <div
                  key={planKey}
                  className={`plan-card ${selectedPlan === planKey ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  {plan.popular && (
                    <div className="popular-badge">
                      <Star size={14} />
                      Most Popular
                    </div>
                  )}

                  <div className="plan-header">
                    <div>
                      <h3>{plan.name}</h3>
                      <p className="plan-duration">{plan.duration}</p>
                    </div>
                    <div className="plan-pricing">
                      <div className="price-row">
                        <span className="current-price">₹{plan.price}</span>
                        <span className="original-price">₹{plan.originalPrice}</span>
                      </div>
                      <div className="savings">
                        Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="plan-features">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-icon">
                          <Check size={12} />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {selectedPlan === planKey && (
                    <div className="selected-indicator">
                      <Shield size={16} />
                      <span>Selected Plan</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Security Info */}
            <div className="security-info">
              <div className="security-header">
                <Shield size={20} />
                <span>Secure Payment</span>
              </div>
              <div className="security-details">
                <p>• 256-bit SSL encryption for all transactions</p>
                <p>• Powered by Razorpay - India's most trusted payment gateway</p>
                <p>• Your payment information is never stored on our servers</p>
                <p>• Instant activation after successful payment</p>
              </div>
            </div>

            {/* Payment Button */}
            <div className="payment-actions">
              <button
                onClick={handlePayment}
                disabled={isLoading || !razorpayLoaded}
                className="payment-button"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay ₹{plans[selectedPlan].price} - Upgrade Now
                  </>
                )}
              </button>

              <div className="terms-text">
                <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="payment-status">
            <div className="loading-spinner large"></div>
            <h3>Processing Payment...</h3>
            <p>Please don't close this window</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="payment-status">
            <div className="status-icon success">
              <Check size={32} />
            </div>
            <h3 className="success-text">Payment Successful!</h3>
            <p>Welcome to KIITHub Premium! Your access has been activated.</p>
            <div className="redirect-info">
              <Zap size={16} />
              <span>Redirecting you back...</span>
            </div>
          </div>
        )}

        {paymentStep === 'error' && (
          <div className="payment-status">
            <div className="status-icon error">
              <AlertCircle size={32} />
            </div>
            <h3 className="error-text">Payment Failed</h3>
            <p>There was an issue processing your payment. Please try again.</p>
            <button
              onClick={() => setPaymentStep('select')}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;