import "./globals.css";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Mensi — Developer & Designer",
    template: "%s | Mensi",
  },
  description:
    "The portfolio of Mensi — a developer building thoughtful, accessible web experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
