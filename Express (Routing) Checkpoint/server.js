const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

function workingHoursOnly(req, res, next) {
  const now = new Date();
  const weekday = now.getDay() >= 1 && now.getDay() <= 5;
  const workingTime = now.getHours() >= 9 && now.getHours() < 17;

  if (!weekday || !workingTime) {
    return res
      .status(403)
      .send("<h1>We are currently closed</h1><p>Please visit us Monday to Friday, from 9:00 to 17:00.</p>");
  }

  next();
}

app.use(workingHoursOnly);
app.use(express.static(path.join(__dirname, "public")));

function renderPage(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Woolf Studio</title>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/">Woolf Studio</a>
      <nav aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/services">Our Services</a>
        <a href="/contact">Contact us</a>
      </nav>
    </header>
    <main>
      <section class="content">
        <p class="eyebrow">Good ideas, made real</p>
        <h1>${title}</h1>
        ${content}
      </section>
    </main>
    <footer>Open Monday to Friday, 9:00–17:00</footer>
  </body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(
    renderPage(
      "Welcome to Woolf Studio",
      "<p>We help people and businesses bring thoughtful ideas to life. Explore our services or get in touch to start a conversation.</p>"
    )
  );
});

app.get("/services", (req, res) => {
  res.send(
    renderPage(
      "Our Services",
      "<p>From the first sketch to the final details, we make the process clear and collaborative.</p><ul><li>Website design and development</li><li>Brand identity</li><li>Digital strategy</li></ul>"
    )
  );
});

app.get("/contact", (req, res) => {
  res.send(
    renderPage(
      "Contact us",
      "<p>Have a project in mind? We would love to hear from you.</p><p><a class=\"email\" href=\"mailto:hello@woolfstudio.example\">hello@woolfstudio.example</a></p>"
    )
  );
});

app.use((req, res) => {
  res.status(404).send(renderPage("Page not found", "<p>Sorry, we couldn't find that page.</p>"));
});

app.listen(PORT, () => {
  console.log(`Woolf Studio is running at http://localhost:${PORT}`);
});
