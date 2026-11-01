import Link from "next/link";

export const metadata = {
  title: "About",
  description: "A little about Mensi, how I work, and the tools I enjoy using.",
};

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "HTML & CSS",
  "Node.js",
  "Git",
  "Responsive design",
];

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero about-hero">
        <p className="eyebrow">A LITTLE ABOUT ME</p>
        <h1>
          Building with care,
          <br />
          <span className="text-accent">one detail at a time.</span>
        </h1>
        <p className="page-intro">
          I’m Mensi, a developer who loves making useful things for the web —
          and making them feel good to use.
        </p>
      </section>

      <section className="about-story content-grid">
        <div className="story-image">
          <img
            src="/images/portrait.svg"
            alt="Illustrated portrait of Mensi"
            width="400"
            height="460"
          />
          <span className="image-stamp" aria-hidden="true">HELLO, WORLD!</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">THE SHORT VERSION</p>
          <h2>Curiosity is my favorite tool.</h2>
          <p>
            I enjoy taking a rough idea and shaping it into something clear,
            useful, and a little unexpected. My work spans responsive
            interfaces, interactive experiments, and the code that brings them
            to life.
          </p>
          <p>
            I’m always learning, asking questions, and looking for ways to make
            the next version better. Good collaboration, thoughtful details,
            and a healthy dose of curiosity make the process worthwhile.
          </p>
          <Link className="text-link" href="/contact">
            Have something in mind? Let’s talk <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="skills-section">
        <div className="content-grid skills-grid">
          <div>
            <p className="eyebrow">TOOLS OF THE TRADE</p>
            <h2>What I work with<span className="text-accent">.</span></h2>
            <p className="muted-copy">
              The toolkit keeps growing. These are some of the technologies and
              practices I reach for most.
            </p>
          </div>
          <ul className="skill-list" aria-label="Skills and technologies">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell about-note">
        <span className="note-mark" aria-hidden="true">✳</span>
        <p>
          “The best interfaces don’t ask for attention.
          <br />
          They make the important things feel effortless.”
        </p>
        <span className="eyebrow">A PRINCIPLE I BUILD BY</span>
      </section>
    </main>
  );
}
