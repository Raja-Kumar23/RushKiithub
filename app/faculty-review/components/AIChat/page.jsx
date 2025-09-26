"use client";

import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const AIChat = ({ 
  onClose, 
  isDarkMode, 
  teachers, 
  allReviews, 
  getTeacherReviewStats, 
  teacherMapping 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI assistant for KIITHub Faculty Reviews. I can help you find information about teachers, compare ratings, and answer questions about faculty performance. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when chat opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Teacher search queries
    if (message.includes('teacher') || message.includes('faculty') || message.includes('professor')) {
      if (message.includes('best') || message.includes('top') || message.includes('highest rated')) {
        const topTeachers = teachers
          .map(teacher => ({
            ...teacher,
            stats: getTeacherReviewStats(teacher.id, teacher.name)
          }))
          .filter(teacher => teacher.stats.totalReviews > 0)
          .sort((a, b) => parseFloat(b.stats.overallAverage) - parseFloat(a.stats.overallAverage))
          .slice(0, 5);

        if (topTeachers.length > 0) {
          let response = "Here are the top-rated teachers based on student reviews:\n\n";
          topTeachers.forEach((teacher, index) => {
            response += `${index + 1}. **${teacher.name}** - ${teacher.stats.overallAverage}/4.0 (${teacher.stats.totalReviews} reviews)\n`;
          });
          response += "\nWould you like more details about any of these teachers?";
          return response;
        }
      }
      
      if (message.includes('worst') || message.includes('lowest') || message.includes('bad')) {
        return "I focus on helping you find the best teachers! Instead, let me show you our top-rated faculty members. Would you like to see the highest-rated teachers?";
      }
    }

    // Subject-specific queries
    if (message.includes('subject') || message.includes('course')) {
      const subjects = new Set();
      teachers.forEach(teacher => {
        if (teacher.subjects) {
          teacher.subjects.forEach(subject => subjects.add(subject));
        }
      });
      
      if (subjects.size > 0) {
        const subjectList = Array.from(subjects).slice(0, 10).join(', ');
        return `Here are some subjects taught by our faculty: ${subjectList}. You can search for teachers by subject name. Which subject are you interested in?`;
      }
    }

    // Section queries
    if (message.includes('section')) {
      const sections = new Set();
      teachers.forEach(teacher => {
        if (teacher.sections) {
          teacher.sections.forEach(section => sections.add(section));
        }
      });
      
      if (sections.size > 0) {
        const sectionList = Array.from(sections).sort((a, b) => a - b).slice(0, 15).join(', ');
        return `Available sections: ${sectionList}. You can filter teachers by section number. Which section are you looking for?`;
      }
    }

    // Rating queries
    if (message.includes('rating') || message.includes('review')) {
      const totalReviews = Object.values(allReviews).reduce((sum, yearReviews) => sum + yearReviews.length, 0);
      const avgRating = teachers
        .map(teacher => parseFloat(getTeacherReviewStats(teacher.id, teacher.name).overallAverage))
        .filter(rating => rating > 0)
        .reduce((sum, rating, _, arr) => sum + rating / arr.length, 0);

      return `Our platform has ${totalReviews} student reviews with an average rating of ${avgRating.toFixed(1)}/4.0. Reviews cover teaching style, marking fairness, student friendliness, and attendance approach. What specific rating information are you looking for?`;
    }

    // Help queries
    if (message.includes('help') || message.includes('how')) {
      return `I can help you with:
      
• **Find Teachers**: Search by name, subject, or section
• **Compare Ratings**: Get detailed rating breakdowns
• **Top Recommendations**: Find highest-rated faculty
• **Subject Info**: Discover teachers for specific courses
• **Section Details**: View teachers by section number

Just ask me something like "Who are the best teachers?" or "Show me teachers for section 5"`;
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you navigate faculty reviews and find the best teachers. What would you like to know about our faculty?";
    }

    // Default response with suggestions
    return `I'd be happy to help you find information about teachers and reviews! Here are some things you can ask me:

• "Who are the top-rated teachers?"
• "Show me teachers for [subject name]"
• "Which teachers teach section [number]?"
• "How many reviews do we have?"
• "Help me find a good teacher"

What would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: generateResponse(userMessage.content),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    "Top rated teachers",
    "Teachers by section",
    "Subject search",
    "How to use reviews"
  ];

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-container" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="ai-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                <circle cx="9" cy="10" r="1" />
                <circle cx="15" cy="10" r="1" />
                <path d="M9.5 14.5c1.5 1.5 3.5 1.5 5 0" />
              </svg>
            </div>
            <div className="chat-title">
              <h3>AI Assistant</h3>
              <span className="chat-status">Online</span>
            </div>
          </div>
          
          <button className="chat-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                    <circle cx="9" cy="10" r="1" />
                    <circle cx="15" cy="10" r="1" />
                    <path d="M9.5 14.5c1.5 1.5 3.5 1.5 5 0" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              
              <div className="message-content">
                <div 
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                  <circle cx="9" cy="10" r="1" />
                  <circle cx="15" cy="10" r="1" />
                  <path d="M9.5 14.5c1.5 1.5 3.5 1.5 5 0" />
                </svg>
              </div>
              
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => {
                setInputValue(action);
                setTimeout(() => handleSendMessage(), 100);
              }}
            >
              {action}
            </button>
          ))}
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask me about teachers, ratings, or anything else..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            
            <button 
              className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;