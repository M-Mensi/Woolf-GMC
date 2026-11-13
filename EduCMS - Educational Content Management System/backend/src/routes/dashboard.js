import { Router } from "express";
import { pool } from "../db.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (request, response, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT c.id)::int AS total_courses,
              COUNT(l.id)::int AS total_lessons,
              COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'published')::int AS published_courses
       FROM courses c LEFT JOIN lessons l ON l.course_id = c.id
       WHERE c.owner_id = $1`,
      [request.userId],
    );
    response.json({ stats: rows[0] });
  } catch (error) {
    next(error);
  }
});
