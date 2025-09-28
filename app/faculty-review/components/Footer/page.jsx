import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Heart, Info, HelpCircle, Users, Mail, Bug, MessageCircle, Calendar, Megaphone, BookOpen, UserPlus } from 'lucide-react';
import './styles.css';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['Platform', 'Support', 'Community']));
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'About', href: '#', icon: <Info size={16} /> },
        { name: 'How it Works', href: '#', icon: <HelpCircle size={16} /> },
        { name: 'Guidelines', href: '#', icon: <BookOpen size={16} /> },
        { name: 'Privacy Policy', href: '#', icon: <Info size={16} /> },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#', icon: <HelpCircle size={16} /> },
        { name: 'Contact Us', href: '#', icon: <Mail size={16} /> },
        { name: 'Report Issue', href: '#', icon: <Bug size={16} /> },
        { name: 'Feedback', href: '#', icon: <MessageCircle size={16} /> },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Student Forum', href: '#', icon: <Users size={16} /> },
        { name: 'Study Groups', href: '#', icon: <UserPlus size={16} /> },
        { name: 'Events', href: '#', icon: <Calendar size={16} /> },
        { name: 'Announcements', href: '#', icon: <Megaphone size={16} /> },
      ],
    },
  ];

  const toggleSection = (sectionTitle) => {
    const newExpandedSections = new Set(expandedSections);
    if (expandedSections.has(sectionTitle)) {
      newExpandedSections.delete(sectionTitle);
    } else {
      newExpandedSections.add(sectionTitle);
    }
    setExpandedSections(newExpandedSections);
  };

  const isSectionExpanded = (sectionTitle) => {
    return expandedSections.has(sectionTitle);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <span>FR</span>
              </div>
              <div className="footer-logo-text">
                <h3>Faculty Review</h3>
                <p className="footer-logo-subtitle">Student Feedback Platform</p>
              </div>
            </div>
            <p className="footer-description">
              Empowering students to make informed decisions about their education through transparent faculty reviews
              and ratings. Built by students, for students.
            </p>
            <div className="footer-made-with">
              <span>Made with</span>
              <Heart size={16} className="heart-icon" />
              <span>for KIIT Students</span>
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="footer-section">
              <button
                className="footer-section-header"
                onClick={() => toggleSection(section.title)}
                aria-expanded={isSectionExpanded(section.title)}
              >
                <h4>{section.title}</h4>
                <div className="footer-section-toggle">
                  {isSectionExpanded(section.title) ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>
              <div className={`footer-links-wrapper ${isSectionExpanded(section.title) ? 'expanded' : 'collapsed'}`}>
                <ul className="footer-links">
                  {section.links.map((link, index) => (
                    <li key={link.name} style={{ animationDelay: `${index * 0.1}s` }}>
                      <a href={link.href} className="footer-link">
                        <span className="footer-link-icon">{link.icon}</span>
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <span>© {currentYear} Faculty Review Platform. All rights reserved.</span>
            </div>
            <div className="footer-meta">
              <div className="footer-status">
                <div className="status-dot"></div>
                <span>All systems operational</span>
              </div>
              <div className="footer-version">v2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;