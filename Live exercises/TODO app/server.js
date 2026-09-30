const express = require("express");
const connectToDb = require("./config/connectToDb");
const authController = require("./controllers/auth.controller");
const noteController = require("./controllers/note.controller");
const authMiddleware = require("./middlewares/auth.middleware");

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Notes API is running" });
});

app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);

app.post("/api/notes", authMiddleware, noteController.createNote);
app.get("/api/notes", authMiddleware, noteController.getNotes);
app.get("/api/notes/:id", authMiddleware, noteController.getNote);
app.put("/api/notes/:id", authMiddleware, noteController.updateNote);
app.delete("/api/notes/:id", authMiddleware, noteController.deleteNote);

const startServer = async () => {
  await connectToDb();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
