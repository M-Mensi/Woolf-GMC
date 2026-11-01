import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <Link className="footer-brand" href="/">
          Made with care <span aria-hidden="true">✳</span>
        </Link>
        <p>© {new Date().getFullYear()} Mensi. Keep making good things.</p>
        <a href="https://github.com/M-Mensi" target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
