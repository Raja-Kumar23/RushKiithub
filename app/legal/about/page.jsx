"use client"
import "./about.css"

const AboutPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <div className="logo">📚 KIITHub</div>
          <h1>ℹ️ About Us</h1>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h3>Our Mission</h3>
            <p>
              KIITHUB aims to empower every KIIT University student by providing free and organized access to academic
              resources, tools, and community-driven features — helping you study smarter, make better decisions, and
              thrive throughout your academic journey.
            </p>
          </section>

          <section className="about-section">
            <h3>Why KIITHUB Was Created</h3>
            <p>
              KIITHUB was started during my 2nd year at KIIT University and is still being maintained while I continue
              my studies in 3rd year. As a student myself, I faced constant issues — whether it was finding previous
              year question papers, dependable notes, or even trustworthy faculty reviews during subject registration.
            </p>
            <p>
              One of the biggest struggles was with section selection and swapping — I had no idea which faculty to
              prefer, and once stuck in the wrong section, there was no proper or affordable way to swap. Some platforms
              existed, but they either lacked transparency or charged unnecessary amounts.
            </p>
            <p>
              That's when I decided to build KIITHUB — a clean, centralized, student-first platform where these everyday
              academic hurdles could be solved with simplicity, honesty, and community effort.
            </p>
            <p>
              As KIITHUB grows, I've been personally covering the cost of running live features such as{" "}
              <strong>real-time section swap listings</strong> and <strong>faculty review systems</strong>. To ensure
              the platform remains sustainable and can expand with more powerful tools, we're introducing a{" "}
              <strong>premium version</strong> soon.
            </p>
            <p>
              Don't worry — core features like study materials, CGPA calculator, and to-do lists will always be{" "}
              <strong>completely free</strong>. The premium plan is entirely optional and helps us maintain
              high-quality, real-time services that truly benefit the student body.
            </p>
          </section>

          <section className="about-section">
            <h3>What We Offer</h3>
            <ul className="features-list">
              <li>📚 Curated study materials and previous year question papers</li>
              <li>📊 CGPA calculator to assist in academic planning</li>
              <li>📝 Personal to-do list and task tracker</li>
              <li>🧑‍🏫 Faculty review system for informed course decisions</li>
              <li>🔄 Section swapping help with live matching</li>
              <li>💡 Project ideas and inspiration for student developers</li>
            </ul>
          </section>

          <section className="about-section">
            <h3>Our Vision</h3>
            <p>
              To build a long-lasting, community-powered academic hub for KIIT students — one that solves real problems,
              reduces confusion, and supports you throughout your academic life.
            </p>
          </section>

          <section className="about-section">
            <h3>Student-Led and Community-Focused</h3>
            <p>
              KIITHUB is a solo project — designed, developed, and managed entirely by a KIIT student. It started as a
              need, became a solution, and is now growing into a tool that supports thousands of students. Every
              feature, update, and design decision is made with the student experience in mind.
            </p>
          </section>

          <section className="about-section contact-section">
            <h3>Contact Information</h3>
            <p>
              Have suggestions or need help? Use the feedback form on the platform — your input truly helps shape
              KIITHUB for the better.
            </p>
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

export default AboutPage
