"use client"
import {
  Heart,
  Github,
  Mail,
  ExternalLink,
  Calculator,
  CheckSquare,
  MessageSquare,
  Star,
  ArrowRightLeft,
  HeadphonesIcon,
  Map,
  Bell,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import "./Footer.css"

const Footer = ({ theme }) => {
  const router = useRouter()
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  const links = [
    {
      tittle: "Quick Links",
      items: [
        { name: "Updates", href: "/updates", icon: Bell }, // Added Updates section
        { name: "Todo List", href: "/to-do-list", icon: CheckSquare },
        { name: "CGPA Calculator", href: "/cgpa", icon: Calculator },
        { name: "WhatsApp Group", href: "https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax", icon: MessageSquare },
      ],
    },
    {
      tittle: "Resources",
      items: [
        { name: "Faculty Reviews", href: "/faculty-review", icon: Star },
        { name: "Section Swapping", href: "/section-swapping", icon: ArrowRightLeft },
        { name: "Support Hub", href: "/support-hub", icon: HeadphonesIcon },
        { name: "Roadmap", href: "/roadmap", icon: Map },
      ],
    },
    {
      tittle: "Legal",
      items: [
        { name: "Pricing", href: "/legal/pricing", icon: ExternalLink },
        { name: "Cancellation Policy", href: "/legal/cancellation", icon: ExternalLink },
        { name: "Privacy Policy", href: "/legal/privacy", icon: ExternalLink },
        { name: "Terms & Conditions", href: "/legal/terms", icon: ExternalLink },
        { name: "About Us", href: "/legal/about", icon: ExternalLink },
      ],
    },
  ]

  const handleLinkClick = (href) => {
    if (href.startsWith("http")) {
      // Open external links in new tab
      window.open(href, "_blank", "noopener noreferrer")
    } else if (href.startsWith("/")) {
      // Navigate to internal routes
      router.push(href)
    } else if (href.startsWith("#")) {
      // Scroll to section within the same page
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const stats = [
    { number: "5K+", label: "Students", color: theme.primary },
    { number: "500+", label: "Resources", color: theme.secondary },
    { number: "50+", label: "Subjects", color: theme.accent },
    { number: "1300+", label: "Community", color: theme.warning },
  ]

  return (
    <footer
      className="footer"
      style={{
        background: theme.cardBg,
        borderColor: theme.border,
      }}
    >
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <div
                className="logo-icon"
                style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}
              >
                📚
              </div>
              <h3
                className="brand-name"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                KIITHub
              </h3>
            </div>
            <p className="brand-description" style={{ color: theme.textMuted }}>
              Your ultimate academic companion for KIIT University. Empowering students with resources, tools, and
              community support.
            </p>
            <div className="social-links">
              <a
                href="https://github.com/Raja-Kumar23"
                className="social-link"
                style={{
                  background: theme.glassBg,
                  borderColor: theme.border,
                  color: theme.textMuted,
                }}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:kiithub025@gmail.com"
                className="social-link"
                style={{
                  background: theme.glassBg,
                  borderColor: theme.border,
                  color: theme.textMuted,
                }}
                aria-label="Email Support"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div className="footer-links">
            {links.map((section, index) => (
              <div key={index} className="link-section">
                <h4 className="section-tittle" style={{ color: theme.textPrimary }}>
                  {section.tittle}
                </h4>
                <ul className="link-list">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    return (
                      <li key={itemIndex}>
                        <button
                          onClick={() => handleLinkClick(item.href)}
                          className="footer-link"
                          style={{
                            color: theme.textMuted,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 0",
                            fontSize: "0.9rem",
                            transition: "all 0.3s ease",
                            width: "100%",
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = theme.primary
                            e.target.style.transform = "translateX(4px)"
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = theme.textMuted
                            e.target.style.transform = "translateX(0)"
                          }}
                        >
                          <Icon size={14} />
                          {item.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-stats" style={{ borderColor: theme.border }}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-number" style={{ color: stat.color }}>
                {stat.number}
              </span>
              <span className="stat-label" style={{ color: theme.textMuted }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="footer-bottom" style={{ borderColor: theme.border }}>
          <div className="copyright">
            <p style={{ color: theme.textMuted }}>
              © {currentYear} KIITHub. Made with <Heart size={14} color={theme.error} fill={theme.error} /> for KIIT
              students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
