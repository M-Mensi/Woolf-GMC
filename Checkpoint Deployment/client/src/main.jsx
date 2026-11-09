import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const experience = [
  {
    role: "Strategic Account Manager",
    company: "Cognizant",
    date: "Feb 2026 — Present",
    description:
      "Build and optimize full-funnel campaigns for global brands, connecting account strategy with measurable performance and long-term client growth.",
    tags: ["Account strategy", "Campaign optimization", "Client growth"],
  },
  {
    role: "Small & Medium Client Sales",
    company: "Snap Inc.",
    date: "Mar 2026 — Present",
    description:
      "Grow advertiser investment across MENA, with an active portfolio generating approximately $1M in quarterly revenue.",
    tags: ["MENA", "Digital advertising", "Revenue growth"],
  },
  {
    role: "Customer Care Specialist",
    company: "Vista",
    date: "Jul 2025 — Jan 2026",
    description:
      "Supported global clients with design and print services, resolving account issues and building loyalty through thoughtful service.",
    tags: ["Customer experience", "CRM"],
  },
  {
    role: "Customer Support Advisor",
    company: "Concentrix",
    date: "Feb 2025 — Jul 2025",
    description:
      "Resolved customer inquiries with clear communication, efficient problem-solving, and a focus on excellent service.",
    tags: ["Customer support", "Problem-solving"],
  },
  {
    role: "Media Buyer & Digital Marketing Specialist",
    company: "Apex Shop",
    date: "Aug 2024 — Jan 2025",
    description:
      "Managed and tested Meta campaigns, using performance insights to improve CPC, CPA, CPM, and return on ad spend.",
    tags: ["Meta Ads", "A/B testing", "Paid media"],
  },
  {
    role: "Mobile & Web Application Developer",
    company: "3S Standard Sharing Software",
    date: "Jan 2024 — Jul 2024",
    description:
      "Built a Flutter and Firebase ride-hailing app and contributed to an Angular, Node.js, and MongoDB budget-planning application.",
    tags: ["Flutter", "Firebase", "Angular", "Node.js", "MongoDB"],
  },
  {
    role: "Project Support Coordinator",
    company: "CERI",
    date: "Jul 2023 — Aug 2023",
    description:
      "Supported industrial project schedules, team coordination, and technical progress documentation.",
    tags: ["Project coordination", "Reporting"],
  },
  {
    role: "Junior Web Developer",
    company: "Ulmus Technologies",
    date: "Jan 2023 — Feb 2023",
    description:
      "Built and customized the company website with WordPress, adapting themes and functionality to business needs.",
    tags: ["WordPress", "Web development"],
  },
  {
    role: "Software Database Developer",
    company: "Linedata",
    date: "Jan 2022 — Feb 2022",
    description:
      "Developed Python and Flask database workflows and collaborated on software solutions in a Scrum team.",
    tags: ["Python", "Flask", "Databases"],
  },
];

const skills = [
  "Account strategy",
  "Digital advertising",
  "Campaign analytics",
  "Customer experience",
  "Node.js",
  "MongoDB",
  "Angular",
  "Flutter",
  "Firebase",
  "Python & Flask",
  "WordPress",
];

const certifications = [
  "Emotional Intelligence Practitioner",
  "Risk Management Expert",
  "AIGPE™ Six Sigma White Belt",
  "Facebook Marketing & Advertising",
  "Marketing Analytics",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ContactForm() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your message.");
      form.reset();
      setStatus(result.message);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Your name
        <input name="name" autoComplete="name" maxLength="100" required />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength="254"
          required
        />
      </label>
      <label>
        What would you like to talk about?
        <textarea name="message" rows="4" maxLength="5000" required />
      </label>
      <button className="button button-dark" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send message"} <Arrow />
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

function App() {
  return (
    <>
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Mohamed Mensi home">
          MM<span>.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="linkedin-link"
          href="https://www.linkedin.com/in/mensimed/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn <Arrow />
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> Tunis, Tunisia · Strategy, media &amp; technology</p>
            <h1>
              Growth starts
              <br />
              with <em>people.</em>
            </h1>
            <p className="hero-summary">
              I’m Mohamed — account manager, digital marketer, and software
              developer. I bring strategy, technology, and human connection
              together to help businesses grow.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contact">
                Let’s talk <Arrow />
              </a>
              <a className="text-link" href="#experience">
                Explore my experience <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="hero-note">
            <span className="note-mark">“</span>
            <p>
              Data finds the opportunity.
              <br />
              Empathy makes it matter.
            </p>
            <span className="note-caption">MY APPROACH</span>
          </div>
          <div className="hero-index">01 / 04</div>
        </section>

        <section className="intro section-wrap" id="about">
          <div className="section-label"><span>01</span> A little about me</div>
          <div className="intro-content">
            <h2>
              Commercial thinking.
              <br />
              <em>Builder’s curiosity.</em>
            </h2>
            <div className="intro-body">
              <p>
                My work has moved from software and databases to paid media,
                customer experience, and strategic account growth. That mix
                helps me see both the human need and the systems behind it.
              </p>
              <p>
                Today I help global brands make smarter advertising decisions
                and grow with confidence. Alongside my work, I’m completing an
                MSc in Computer Science: Software Engineering at Woolf.
              </p>
              <a
                className="underlined-link"
                href="https://www.linkedin.com/in/mensimed/"
                target="_blank"
                rel="noreferrer"
              >
                More about my journey <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="work-section" id="experience">
          <div className="section-wrap">
            <div className="section-label"><span>02</span> Career notes</div>
            <div className="work-heading">
              <h2>
                Experience in
                <br />
                <em>motion.</em>
              </h2>
              <p>
                A path across technology, service, and growth — always centered
                on making the next interaction better.
              </p>
            </div>
            <div className="timeline">
              {experience.map((item, index) => (
                <article className="timeline-item" key={`${item.company}-${item.role}`}>
                  <div className="timeline-number">0{index + 1}</div>
                  <div className="timeline-main">
                    <p className="timeline-company">{item.company}</p>
                    <h3>{item.role}</h3>
                    <p className="timeline-description">{item.description}</p>
                    <div className="tag-list">
                      {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                  <p className="timeline-date">{item.date}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="skills-section section-wrap">
          <div className="section-label"><span>03</span> Tools &amp; strengths</div>
          <div className="skills-content">
            <h2>
              Different tools.
              <br />
              <em>One human focus.</em>
            </h2>
            <div className="skill-list">
              {skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            <div className="education">
              <p className="mini-label">EDUCATION</p>
              <div>
                <strong>MSc, Computer Science — Software Engineering</strong>
                <span>Woolf · Aug 2025–Dec 2026</span>
              </div>
              <div>
                <strong>Bachelor of Technology, Computer Science</strong>
                <span>ISET Charguia · Sep 2021–Jul 2024</span>
              </div>
            </div>
            <div className="credentials">
              <div>
                <p className="mini-label">LANGUAGES</p>
                <p>Arabic · Native &nbsp; English · Professional &nbsp; French · Professional</p>
              </div>
              <div>
                <p className="mini-label">CERTIFICATIONS</p>
                <p>{certifications.join(" · ")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section-wrap contact-wrap">
            <div>
              <div className="section-label"><span>04</span> Start a conversation</div>
              <h2>
                Good things
                <br />
                start with <em>hello.</em>
              </h2>
              <p className="contact-copy">
                Have a role, a collaboration, or an interesting idea in mind?
                I’d be glad to hear from you.
              </p>
              <a className="contact-email" href="mailto:mensi.med@yahoo.com">
                mensi.med@yahoo.com <Arrow />
              </a>
              <p className="contact-location">Le Bardo, Tunis, Tunisia</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="wordmark" href="#home">MM<span>.</span></a>
        <p>Thoughtful growth, built together.</p>
        <a href="https://www.linkedin.com/in/mensimed/" target="_blank" rel="noreferrer">
          LinkedIn <Arrow />
        </a>
        <span>© {new Date().getFullYear()} Mohamed Mensi</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
