import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";

export const coursesRouter = Router();
export const lessonsRouter = Router();

const courseInput = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().max(10000).default(""),
  category: z.string().trim().min(1).max(80).default("General"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});
const lessonInput = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().max(50000).default(""),
});
const idSchema = z.string().regex(/^\d+$/);
const lessonOrderInput = z.object({ lessonIds: z.array(idSchema).min(1).max(500) });

function validId(value) {
  return idSchema.safeParse(value).success;
}

coursesRouter.get("/", async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.title, c.description, c.category, c.status, c.created_at, c.updated_at,
              COUNT(l.id)::int AS lesson_count
       FROM courses c LEFT JOIN lessons l ON l.course_id = c.id
       WHERE c.owner_id = $1
       GROUP BY c.id
       ORDER BY c.updated_at DESC`,
      [request.userId],
    );
    response.json({ courses: rows });
  } catch (error) {
    next(error);
  }
});

coursesRouter.post("/", async (request, response, next) => {
  const result = courseInput.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({ error: result.error.issues[0]?.message ?? "Invalid course details." });
  }
  try {
    const { title, description, category, status } = result.data;
    const { rows } = await pool.query(
      `INSERT INTO courses (owner_id, title, description, category, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, category, status, created_at, updated_at`,
      [request.userId, title, description, category, status],
    );
    response.status(201).json({ course: { ...rows[0], lesson_count: 0 } });
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/:id", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid course id." });
  }
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.title, c.description, c.category, c.status, c.created_at, c.updated_at,
              COUNT(l.id)::int AS lesson_count
       FROM courses c LEFT JOIN lessons l ON l.course_id = c.id
       WHERE c.id = $1 AND c.owner_id = $2
       GROUP BY c.id`,
      [request.params.id, request.userId],
    );
    if (!rows[0]) return response.status(404).json({ error: "Course not found." });
    const lessons = await pool.query(
      `SELECT id, title, content, position, created_at, updated_at
       FROM lessons WHERE course_id = $1 ORDER BY position, id`,
      [request.params.id],
    );
    response.json({ course: rows[0], lessons: lessons.rows });
  } catch (error) {
    next(error);
  }
});

coursesRouter.patch("/:id", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid course id." });
  }
  const result = courseInput.partial().safeParse(request.body);
  if (!result.success || Object.keys(result.data ?? {}).length === 0) {
    return response.status(400).json({ error: result.success ? "Provide at least one course field." : result.error.issues[0]?.message });
  }
  const fields = result.data;
  const columns = { title: "title", description: "description", category: "category", status: "status" };
  const values = Object.values(fields);
  const updates = Object.keys(fields).map((field, index) => `${columns[field]} = $${index + 3}`);
  updates.push("updated_at = NOW()");
  try {
    const { rows } = await pool.query(
      `UPDATE courses SET ${updates.join(", ")}
       WHERE id = $1 AND owner_id = $2
       RETURNING id, title, description, category, status, created_at, updated_at`,
      [request.params.id, request.userId, ...values],
    );
    if (!rows[0]) return response.status(404).json({ error: "Course not found." });
    response.json({ course: rows[0] });
  } catch (error) {
    next(error);
  }
});

coursesRouter.delete("/:id", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid course id." });
  }
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM courses WHERE id = $1 AND owner_id = $2",
      [request.params.id, request.userId],
    );
    if (!rowCount) return response.status(404).json({ error: "Course not found." });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

coursesRouter.post("/:id/lessons", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid course id." });
  }
  const result = lessonInput.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({ error: result.error.issues[0]?.message ?? "Invalid lesson details." });
  }
  try {
    const course = await pool.query(
      "SELECT id FROM courses WHERE id = $1 AND owner_id = $2",
      [request.params.id, request.userId],
    );
    if (!course.rowCount) return response.status(404).json({ error: "Course not found." });
    const { rows } = await pool.query(
      `INSERT INTO lessons (course_id, title, content, position)
       VALUES ($1, $2, $3, (SELECT COALESCE(MAX(position), -1) + 1 FROM lessons WHERE course_id = $1))
       RETURNING id, title, content, position, created_at, updated_at`,
      [request.params.id, result.data.title, result.data.content],
    );
    await pool.query("UPDATE courses SET updated_at = NOW() WHERE id = $1", [request.params.id]);
    response.status(201).json({ lesson: rows[0] });
  } catch (error) {
    next(error);
  }
});

coursesRouter.patch("/:id/lessons/order", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid course id." });
  }
  const result = lessonOrderInput.safeParse(request.body);
  if (!result.success || new Set(result.data?.lessonIds).size !== result.data?.lessonIds.length) {
    return response.status(400).json({ error: "Provide each lesson id once to set the lesson order." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const course = await client.query(
      "SELECT id FROM courses WHERE id = $1 AND owner_id = $2 FOR UPDATE",
      [request.params.id, request.userId],
    );
    if (!course.rowCount) {
      await client.query("ROLLBACK");
      return response.status(404).json({ error: "Course not found." });
    }

    const existing = await client.query(
      "SELECT id FROM lessons WHERE course_id = $1 ORDER BY position, id FOR UPDATE",
      [request.params.id],
    );
    const existingIds = new Set(existing.rows.map((lesson) => String(lesson.id)));
    if (
      existingIds.size !== result.data.lessonIds.length ||
      result.data.lessonIds.some((id) => !existingIds.has(id))
    ) {
      await client.query("ROLLBACK");
      return response.status(400).json({ error: "Lesson ids must match the lessons in this course." });
    }

    for (const [position, lessonId] of result.data.lessonIds.entries()) {
      await client.query(
        "UPDATE lessons SET position = $1 WHERE id = $2 AND course_id = $3",
        [position, lessonId, request.params.id],
      );
    }
    await client.query("UPDATE courses SET updated_at = NOW() WHERE id = $1", [request.params.id]);
    await client.query("COMMIT");
    response.json({ success: true });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Lesson reorder transaction rollback failed:", rollbackError);
      }
    }
    next(error);
  } finally {
    client?.release();
  }
});

lessonsRouter.patch("/:id", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid lesson id." });
  }
  const result = lessonInput.partial().safeParse(request.body);
  if (!result.success || Object.keys(result.data ?? {}).length === 0) {
    return response.status(400).json({ error: result.success ? "Provide at least one lesson field." : result.error.issues[0]?.message });
  }
  const columns = { title: "title", content: "content" };
  const fields = result.data;
  const updates = Object.keys(fields).map((field, index) => `${columns[field]} = $${index + 2}`);
  updates.push("updated_at = NOW()");
  try {
    const { rows } = await pool.query(
      `UPDATE lessons l SET ${updates.join(", ")}
       FROM courses c
       WHERE l.course_id = c.id AND l.id = $1 AND c.owner_id = $${Object.keys(fields).length + 2}
       RETURNING l.id, l.course_id, l.title, l.content, l.position, l.created_at, l.updated_at`,
      [request.params.id, ...Object.values(fields), request.userId],
    );
    if (!rows[0]) return response.status(404).json({ error: "Lesson not found." });
    await pool.query("UPDATE courses SET updated_at = NOW() WHERE id = $1", [rows[0].course_id]);
    response.json({ lesson: rows[0] });
  } catch (error) {
    next(error);
  }
});

lessonsRouter.delete("/:id", async (request, response, next) => {
  if (!validId(request.params.id)) {
    return response.status(400).json({ error: "Invalid lesson id." });
  }
  try {
    const { rows } = await pool.query(
      `DELETE FROM lessons l USING courses c
       WHERE l.course_id = c.id AND l.id = $1 AND c.owner_id = $2
       RETURNING l.course_id`,
      [request.params.id, request.userId],
    );
    if (!rows[0]) return response.status(404).json({ error: "Lesson not found." });
    await pool.query("UPDATE courses SET updated_at = NOW() WHERE id = $1", [rows[0].course_id]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
