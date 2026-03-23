import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Upload.css";

// ── Helper: build bot conversation from ATS result ──────────────────────────
const buildBotMessages = (result) => {
  const { rating, email, phone, missing } = result;

  let scoreLabel = "";
  let scoreEmoji = "";
  if (rating >= 80) { scoreLabel = "Excellent"; scoreEmoji = "🏆"; }
  else if (rating >= 60) { scoreLabel = "Good"; scoreEmoji = "✅"; }
  else if (rating >= 40) { scoreLabel = "Average"; scoreEmoji = "⚠️"; }
  else { scoreLabel = "Needs Work"; scoreEmoji = "🚨"; }

  const messages = [
    {
      id: 1,
      text: "👋 Hi! I've finished analysing your resume. Let me walk you through the results!",
      delay: 300,
    },
    {
      id: 2,
      text: `📊 Your ATS Compatibility Score is **${rating}/100** — that's **${scoreLabel}** ${scoreEmoji}`,
      delay: 1000,
      highlight: true,
    },
    {
      id: 3,
      text: email
        ? `📧 Detected Email: **${email}**`
        : "📧 No email address detected in your resume. Make sure to include one!",
      delay: 1800,
      warn: !email,
    },
    {
      id: 4,
      text: phone
        ? `📞 Detected Phone: **${phone}**`
        : "📞 No phone number detected. Recruiters need a way to reach you!",
      delay: 2600,
      warn: !phone,
    },
    ...(missing && missing.length > 0
      ? [
          {
            id: 5,
            text: `🔍 Your resume is missing **${missing.length}** important keyword${missing.length > 1 ? "s" : ""}:`,
            delay: 3400,
            warn: true,
          },
          {
            id: 6,
            type: "keywords",
            keywords: missing,
            delay: 4200,
          },
          {
            id: 7,
            text: "💡 **Tip:** Add these sections/keywords to boost your ATS score significantly!",
            delay: 5000,
            tip: true,
          },
        ]
      : [
          {
            id: 5,
            text: "🎉 Great news — no major keyword gaps found! Your resume covers all key sections.",
            delay: 3400,
          },
        ]),
    {
      id: 99,
      text:
        rating >= 60
          ? "🚀 Your resume looks solid! Keep tailoring it for each job description to maximise your chances."
          : "📝 Don't worry! With a few improvements, you can significantly improve your score. Upload an improved version anytime.",
      delay: missing && missing.length > 0 ? 5800 : 4200,
      tip: true,
    },
  ];

  return messages;
};

// ── Renders a single bot message bubble ─────────────────────────────────────
const BotMessage = ({ msg }) => {
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? <strong key={i}>{p}</strong> : p
    );
  };

  if (msg.type === "keywords") {
    return (
      <div className="bot-bubble keywords-bubble">
        {msg.keywords.map((kw, i) => (
          <span key={i} className="kw-tag">{kw}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bot-bubble ${msg.highlight ? "bubble-highlight" : ""} ${
        msg.warn ? "bubble-warn" : ""
      } ${msg.tip ? "bubble-tip" : ""}`}
    >
      {renderText(msg.text)}
    </div>
  );
};

// ── Main Upload Component ────────────────────────────────────────────────────
const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
      setVisibleMessages([]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file to upload"); return; }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setResult(null);
    setVisibleMessages([]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error parsing the document, please try another."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Drip bot messages in one by one ─────────────────────────────────────
  useEffect(() => {
    if (!result) return;
    const messages = buildBotMessages(result);
    setVisibleMessages([]);
    setIsTyping(true);

    messages.forEach((msg) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
        // hide typing indicator after last message
        if (msg.id === messages[messages.length - 1].id) {
          setIsTyping(false);
        }
      }, msg.delay);
    });
  }, [result]);

  // ── Auto-scroll chat to bottom ───────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isTyping]);

  // ── Score ring color ─────────────────────────────────────────────────────
  const scoreColor =
    result?.rating >= 80
      ? "#00e676"
      : result?.rating >= 60
      ? "#00e7ed"
      : result?.rating >= 40
      ? "#ffc107"
      : "#ff4d4d";

  return (
    <div className="upload-page">
      <div className={`upload-container ${result ? "upload-container--has-result" : ""}`}>

        {/* ── Upload Form ─────────────────────────────────────────────── */}
        <h2 className="upload-header">Upload Your Resume</h2>
        <form onSubmit={handleUpload}>
          <div className="file-input-container">
            <input
              type="file"
              id="resumeUpload"
              className="file-input"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="resumeUpload" className="file-input-label">
              {file ? "Change Resume" : "Choose Resume (PDF)"}
            </label>
          </div>

          <p className="file-name">{file ? file.name : "No file selected"}</p>

          {error && (
            <p className="upload-error">{error}</p>
          )}

          <div className="calculate-score-section">
            <button
              className="calculate-score-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Analysing…
                </span>
              ) : (
                "Calculate ATS Score"
              )}
            </button>
          </div>
        </form>

        {/* ── Bot Chat Panel ────────────────────────────────────────────── */}
        {result && (
          <div className="bot-panel">
            {/* Score ring header */}
            <div className="bot-score-header">
              <div
                className="score-ring"
                style={{ "--score-color": scoreColor, "--score": result.rating }}
              >
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${result.rating}, 100`}
                    style={{ stroke: scoreColor }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="score-text" style={{ color: scoreColor }}>
                  {result.rating}
                </span>
              </div>
              <div className="bot-score-label">
                <p className="bot-name">🤖 ResumeBot</p>
                <p className="score-sub">ATS Compatibility Score</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="bot-messages">
              {visibleMessages.map((msg) => (
                <div key={msg.id} className="bot-message-row animate-in">
                  <div className="bot-avatar">🤖</div>
                  <BotMessage msg={msg} />
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="bot-message-row animate-in">
                  <div className="bot-avatar">🤖</div>
                  <div className="bot-bubble typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
