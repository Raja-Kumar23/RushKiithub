'use client'
import React, { useState, useEffect } from 'react';
import { FileText, Upload, Star, AlertCircle, CheckCircle, Phone, User, Hash, Link, Type, Crown, MessageCircle, Award, Target } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import './styles.css';

const PDFUploadHub = () => {
  // Mock points data
  const mockPointsData = {
    "23053769": 45,
    "2106002": 25,
    "2106003": 60,
    "2106004": 15,
    "2106005": 0
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    kiitRoll: '',
    pdfLinks: [
      { link: '', name: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const submitPDFUpload = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'pdf-uploads'), {
        ...data,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      return docRef;
    } catch (error) {
      console.error('Error submitting PDF upload:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && (currentUser.email.endsWith('@kiit.ac.in') || currentUser.email === 'davidtomdon@gmail.com')) {
        const userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL || '/default-profile.png',
        };
        setUser(userData);
        
        // Auto-fetch name and roll number
        const rollMatch = currentUser.email.match(/(\d+)@kiit\.ac\.in/);
        const rollNumber = rollMatch ? rollMatch[1] : '';
        
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || '',
          kiitRoll: rollNumber
        }));

        // Load user points from mock data
        if (rollNumber && mockPointsData[rollNumber] !== undefined) {
          setUserPoints(mockPointsData[rollNumber]);
        } else {
          setUserPoints(0);
        }
      } else {
        setUser(null);
        setUserPoints(0);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-circle')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const addPDFField = () => {
    setFormData(prev => ({
      ...prev,
      pdfLinks: [...prev.pdfLinks, { link: '', name: '' }]
    }));
  };

  const removePDFField = (index) => {
    if (formData.pdfLinks.length > 1) {
      setFormData(prev => ({
        ...prev,
        pdfLinks: prev.pdfLinks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePDFLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pdfLinks: prev.pdfLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }
    
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setMessage({ type: 'error', text: 'Valid 10-digit phone number is required' });
      return false;
    }
    
    if (!formData.kiitRoll.trim()) {
      setMessage({ type: 'error', text: 'KIIT Roll number is required' });
      return false;
    }

    const validPDFs = formData.pdfLinks.filter(pdf => 
      pdf.link.trim() && pdf.name.trim()
    );

    if (validPDFs.length === 0) {
      setMessage({ type: 'error', text: 'At least one PDF link with name is required' });
      return false;
    }

    // Validate Google Drive links
    const invalidLinks = formData.pdfLinks.filter(pdf => 
      pdf.link.trim() && !pdf.link.includes('drive.google.com')
    );

    if (invalidLinks.length > 0) {
      setMessage({ type: 'error', text: 'All links must be Google Drive sharing links' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Filter out empty PDF links
      const validPDFs = formData.pdfLinks.filter(pdf => 
        pdf.link.trim() && pdf.name.trim()
      );

      const pointsEarned = validPDFs.length * 5;

      await submitPDFUpload({
        ...formData,
        pdfLinks: validPDFs,
        userId: user?.uid || 'anonymous',
        pointsEarned: pointsEarned
      });

      setMessage({ 
        type: 'success', 
        text: `PDF links submitted successfully! You earned ${pointsEarned} points. We will review and process your submission within 24 hours.` 
      });

      // Reset form (keep name and roll)
      setFormData(prev => ({
        ...prev,
        phone: '',
        pdfLinks: [{ link: '', name: '' }]
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-required">
        <FileText size={64} />
        <h2>Authentication Required</h2>
        <p>Please sign in with your KIIT account to access the PDF Upload Hub</p>
        <button onClick={signInWithGoogle} className="auth-btn">
          Sign in with Google
        </button>
      </div>
    );
  }

  const isPremium = userPoints >= 50;
  const validPDFCount = formData.pdfLinks.filter(pdf => 
    pdf.link.trim() && pdf.name.trim()
  ).length;

  return (
    <div className="pdf-upload-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="logo">
          <FileText size={28} />
          KIITHUB - PDF Upload
        </div>
        
        <div className="profile-circle">
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-avatar"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          
          <div className={`profile-dropdown ${showProfileDropdown ? '' : 'hidden'}`}>
            <div className="profile-info">
              <h3>{user.displayName}</h3>
              <p>{user.email}</p>
            </div>
            
            <div className="points-info">
              <Star size={16} />
              <span>{userPoints} Points</span>
            </div>
            
            <div className={`premium-status ${isPremium ? 'active' : 'progress'}`}>
              {isPremium ? (
                <>
                  <Crown size={12} /> Premium Active
                </>
              ) : (
                `${50 - userPoints} points to Premium`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="header-icon">
          <FileText size={40} />
        </div>
        <h1>PDF Upload Hub</h1>
        <p>Share unavailable PDFs and earn points for premium benefits</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon">
              <Star size={20} />
            </div>
            <h3>Points Per PDF</h3>
          </div>
          <div className="stat-value">5</div>
          <div className="stat-description">Earn points for each valid PDF</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon">
              <Target size={20} />
            </div>
            <h3>Premium Target</h3>
          </div>
          <div className="stat-value">50</div>
          <div className="stat-description">Points needed for premium access</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon">
              <Award size={20} />
            </div>
            <h3>Current Submission</h3>
          </div>
          <div className="stat-value">+{validPDFCount * 5}</div>
          <div className="stat-description">Points you'll earn from this upload</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="instructions">
        <h4>
          <Upload size={20} />
          How to Upload PDFs
        </h4>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <span>Upload PDF to Google Drive</span>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <span>Right-click → Share → Copy link</span>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <span>Set to "Anyone with link can view"</span>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <span>Paste link in form below</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="upload-form">
        {/* Personal Info */}
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                placeholder="Auto-fetched from account"
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>
                <Hash size={16} />
                KIIT Roll Number
              </label>
              <input
                type="text"
                value={formData.kiitRoll}
                placeholder="Auto-fetched from email"
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Phone size={16} />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              pattern="[0-9]{10}"
              required
            />
            <small>Enter correctly for points processing</small>
          </div>
        </div>

        {/* PDF Links */}
        <div className="form-section">
          <div className="section-header">
            <h3>PDF Links (Minimum 1 Required)</h3>
            <button 
              type="button" 
              onClick={addPDFField}
              className="add-pdf-btn"
            >
              + Add PDF
            </button>
          </div>
          
          <div className="pdf-grid">
            {formData.pdfLinks.map((pdfLink, index) => (
              <div key={index} className="pdf-card">
                <div className="pdf-header">
                  <span className="pdf-number">PDF {index + 1}</span>
                  {formData.pdfLinks.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removePDFField(index)}
                      className="remove-pdf-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <div className="form-group">
                  <label>
                    <Link size={14} />
                    Google Drive Link
                  </label>
                  <input
                    type="url"
                    value={pdfLink.link}
                    onChange={(e) => handlePDFLinkChange(index, 'link', e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Type size={14} />
                    PDF Name
                  </label>
                  <input
                    type="text"
                    value={pdfLink.name}
                    onChange={(e) => handlePDFLinkChange(index, 'name', e.target.value)}
                    placeholder="e.g., Advanced Java Notes"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="important-note">
          <AlertCircle size={18} />
          <div>
            <h4>Important Guidelines:</h4>
            <ul>
              <li>Each valid PDF earns you 5 points</li>
              <li>50 points = Free premium subscription next semester</li>
              <li>PDFs must not be available in KIIT Hub</li>
              <li>All links must be Google Drive sharing links</li>
              <li>Verification within 24 hours</li>
              <li>Valid for KIIT University students only</li>
            </ul>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              Submitting...
            </>
          ) : (
            `Submit PDF Links (+${validPDFCount * 5} Points)`
          )}
        </button>
      </form>

      {/* Contact Information */}
      <div className="contact-info">
        <h4>Need Help?</h4>
        <div className="contact-options">
          <a href="mailto:kiithub025@gmail.com" className="contact-link">
            <span>📧</span>
            kiithub025@gmail.com
          </a>
          <a href="https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax" className="contact-link" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} />
            Join WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadHub;
