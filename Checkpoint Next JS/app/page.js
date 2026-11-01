import Link from "next/link";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export const metadata = {
  title: "Mensi — Developer & Designer",
};

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            Available for thoughtful collaborations
          </p>
          <h1>
            I make the web
            <br />
            feel <span className="text-accent">a little more human.</span>
          </h1>
          <p className="hero-intro">
            Hey, I’m Mensi — a developer who cares about the details. I turn
            ideas into clear, considered digital experiences.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about">
              More about me <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-social">
            <span>FIND ME ELSEWHERE</span>
            <a href="https://github.com/M-Mensi" target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero-art" aria-label="Illustrated portrait and code card">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="portrait-frame">
            <img
              src="/images/portrait.svg"
              alt="Colorful illustrated portrait of a developer"
              width="400"
              height="460"
            />
            <span className="portrait-caption">MENSI · DEVELOPER</span>
          </div>
          <div className="floating-note">
            <span className="note-icon" aria-hidden="true">✳</span>
            <span>
              <strong>Curious by default</strong>
              <small>Always learning, always making.</small>
            </span>
          </div>
          <span className="hero-sparkle sparkle-one" aria-hidden="true">✳</span>
          <span className="hero-sparkle sparkle-two" aria-hidden="true">✦</span>
        </div>
        <div className="hero-index" aria-hidden="true">01 / 04</div>
      </section>

      <section className="intro-strip" aria-label="Introduction">
        <div className="section-shell intro-strip-inner">
          <span className="strip-label">A little bit of everything</span>
          <p>
            Front-end craft <span>✳</span> Thoughtful design <span>✳</span>{" "}
            Useful ideas
          </p>
          <span className="strip-year">BASED IN THE DIGITAL WORLD</span>
        </div>
      </section>

      <section className="section-shell section-block featured-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK · 01—03</p>
            <h2>Things I’ve made<span className="text-accent">.</span></h2>
          </div>
          <Link className="text-link" href="/projects">
            All projects <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="section-shell values-section">
        <div className="values-card">
          <div>
            <p className="eyebrow">A GOOD PLACE TO START</p>
            <h2>
              Good work starts
              <br />
              with a <span className="text-accent">good conversation.</span>
            </h2>
          </div>
          <Link className="button button-light" href="/contact">
            Say hello <span aria-hidden="true">↗</span>
          </Link>
          <span className="values-decoration" aria-hidden="true">✳</span>
        </div>
      </section>
    </main>
  );
}
