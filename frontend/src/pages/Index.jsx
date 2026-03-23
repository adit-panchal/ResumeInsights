import React from "react";
import { Link } from "react-router-dom";
import "./Index.css";

const Index = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-text">
          <h1>
            Is Your Resume <span>Good Enough?</span>
          </h1>
          <p>
            Your resume is the first impression for employers. An ATS-friendly
            resume boosts your chances of an interview.
          </p>
          <p>
            Our AI analyzes your resume, providing an ATS score and improvement
            suggestions to match job standards.
          </p>
          <p className="highlight-text">
            Join us to extract insights and craft a compelling narrative that
            stands out in a competitive job market.
          </p>

          <div className="landing-buttons">
            <Link to="/upload" className="btn btn-primary">
              Calculate Score
            </Link>
            <Link to="/register" className="btn btn-outline">
              Join Now
            </Link>
          </div>
        </div>

        <div className="landing-image-container">
          <div className="glow-effect"></div>
          <img
            src="/static/resume_hero.png"
            alt="AI Resume Analysis Dashboard"
            className="landing-image"
          />
        </div>
      </div>

      <div className="features-section" id="description-section">
        <div className="features-image">
          <div className="features-glow"></div>
          <img
            src="/static/ats_features.png"
            alt="ATS Resume Scanning Process"
            className="features-img"
          />
        </div>
        <div className="features-text">
          <h2>
            Boost Your Resume with <br />
            <span>ATS Insights</span>
          </h2>
          <p>
            Many companies use Applicant Tracking Systems (ATS) to filter
            resumes. Make sure your resume is optimized for these systems to
            increase your chances of landing an interview.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>AI Analysis</h3>
              <p>Deep scan of your resume against modern ATS algorithms.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Custom Score</h3>
              <p>Get a personalized ATS score based on keyword extraction.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💡</span>
              <h3>Expert Tips</h3>
              <p>
                Actionable suggestions for formatting and content improvement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section" id="contact">
        <div className="contact-container">
          <h2>
            Get In <span>Touch</span>
          </h2>
          <p>
            Have questions or need assistance? Reach out to our team of career
            experts and AI engineers.
          </p>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group-contact">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group-contact">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group-contact">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-submit">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2026 Resume Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
