import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    return response.status(401).json({ error: "Sign in to continue." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      return response.status(401).json({ error: "Your session is invalid. Please sign in again." });
    }
    request.userId = payload.sub;
    next();
  } catch {
    return response.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
}
