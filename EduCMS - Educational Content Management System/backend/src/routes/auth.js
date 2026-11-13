import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

function createToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: String(user.id), name: user.name, email: user.email };
}

authRouter.post("/register", async (request, response, next) => {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({ error: result.error.issues[0]?.message ?? "Invalid registration details." });
  }

  try {
    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    );
    const user = publicUser(rows[0]);
    response.status(201).json({ user, token: createToken(user.id) });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({ error: "An account with that email already exists." });
    }
    next(error);
  }
});

authRouter.post("/login", async (request, response, next) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({ error: "Enter a valid email and password." });
  }

  try {
    const email = result.data.email.toLowerCase();
    const { rows } = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(result.data.password, user.password_hash))) {
      return response.status(401).json({ error: "Email or password is incorrect." });
    }
    response.json({ user: publicUser(user), token: createToken(user.id) });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [request.userId],
    );
    if (!rows[0]) {
      return response.status(401).json({ error: "Account not found. Please sign in again." });
    }
    response.json({ user: publicUser(rows[0]) });
  } catch (error) {
    next(error);
  }
});
