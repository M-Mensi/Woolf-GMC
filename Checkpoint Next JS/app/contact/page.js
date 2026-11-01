import Link from "next/link";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Mensi about a project or collaboration.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page-shell contact-page">
      <section className="contact-card">
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          OPEN TO GOOD CONVERSATIONS
        </p>
        <h1>
          Have a good
          <br />
          <span className="text-accent">one in mind?</span>
        </h1>
        <p className="contact-intro">
          Whether you have a project idea, a question, or just want to say hi,
          I’d love to hear from you.
        </p>
        <a
          className="button button-primary contact-email"
          href="mailto:hello@mensi.dev?subject=Hello%20Mensi"
        >
          hello@mensi.dev <span aria-hidden="true">↗</span>
        </a>
        <div className="contact-divider"><span>OR FIND ME HERE</span></div>
        <a
          className="contact-social"
          href="https://github.com/M-Mensi"
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <strong>GitHub</strong>
            <small>Code, experiments, and more</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
        <span className="contact-decoration contact-decoration-one" aria-hidden="true">✳</span>
        <span className="contact-decoration contact-decoration-two" aria-hidden="true">✦</span>
      </section>
      <div className="contact-back">
        <Link className="text-link" href="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
      </div>
    </main>
  );
}
