"use client" // This is needed for useRouter
import { Star, Quote, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter
import "./TestimonialsSection.css"

const TestimonialsSection = ({ theme }) => {
  const router = useRouter() // Initialize useRouter

  const testimonials = [
    {
      name: "Mahesh Kumar Yadav",
      year: "22054320",
      avatar: "👨‍💻",
      rating: 5,
      text: '"KIITHub.in is an excellent platform—well-designed, easy to navigate, and truly helpful for students; keep up the great work!"',
      highlight: "game-changer",
    },
    {
      name: "Niraj Kumar Sah",
      year: "23053716",
      avatar: "👨‍💻",
      rating: 5,
      text: "This platform is awesome for the students to secure a good marks. The note provided here is very helpful and easy to understand.",
      highlight: "incredibly accurate",
    },
    {
      name: "PRAGYA NATH",
      year: "23053328",
      avatar: "⚡",
      rating: 5,
      text: "Very well done. Good work. Very helpful during exams. ",
      highlight: "made by students for students",
    },
  ]
const handleShareFeedbackClick = () => {
  window.open("/feedback", "_blank"); // Open /feedback in new tab
}


  return (
    <div className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title" style={{ color: theme.textPrimary }}>
          What Students Say
        </h2>
        <p className="testimonials-subtitle" style={{ color: theme.textMuted }}>
          Real feedback from KIIT students who use KIITHub daily
        </p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card"
            style={{
              background: theme.glassBg,
              borderColor: theme.border,
              boxShadow: theme.shadow,
            }}
          >
            <div className="testimonial-header">
              <div className="testimonial-quote">
                <Quote size={24} color={theme.primary} />
              </div>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill={theme.warning} color={theme.warning} />
                ))}
              </div>
            </div>
            <div className="testimonial-content">
              <p className="testimonial-text" style={{ color: theme.textPrimary }}>
                {'"'}
                {testimonial.text}
                {'"'}
              </p>
            </div>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">
                <div className="avatar-icon" style={{ background: `${theme.primary}20` }}>
                  {testimonial.avatar}
                </div>
              </div>
              <div className="testimonial-author">
                <h4 className="author-name" style={{ color: theme.textPrimary }}>
                  {testimonial.name}
                </h4>
                <p className="author-year" style={{ color: theme.textMuted }}>
                  {testimonial.year}
                </p>
              </div>
            </div>
            <div className="testimonial-decoration" style={{ background: theme.primary }}></div>
          </div>
        ))}
      </div>
      <div className="testimonials-cta">
        <div
          className="cta-card"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
            borderColor: `${theme.primary}30`,
          }}
          onClick={handleShareFeedbackClick} // This is the only functional change
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <MessageSquare size={24} color={theme.primary} />
            <h3 style={{ color: theme.primary, margin: 0 }}>Share Your Feedback</h3>
          </div>
          <p style={{ color: theme.textMuted }}>Help us improve KIITHub by sharing your experience and suggestions</p>
        </div>
      </div>
    </div>
  )
}

export default TestimonialsSection
