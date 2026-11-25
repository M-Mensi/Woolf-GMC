const ALLOWED_CATEGORIES = new Set(["produce", "bakery", "prepared", "pantry"]);

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function text(value, maximum) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  if (category && category !== "all" && !ALLOWED_CATEGORIES.has(category)) {
    return jsonResponse({ error: "Unknown food category." }, 400);
  }

  const result = category && category !== "all"
    ? await env.DB.prepare(
      "SELECT id, title, category, portions_remaining, neighborhood, pickup_at, notes FROM listings WHERE status = 'available' AND category = ? AND pickup_at > ? ORDER BY pickup_at LIMIT 100",
    ).bind(category, new Date().toISOString()).all()
    : await env.DB.prepare(
      "SELECT id, title, category, portions_remaining, neighborhood, pickup_at, notes FROM listings WHERE status = 'available' AND pickup_at > ? ORDER BY pickup_at LIMIT 100",
    ).bind(new Date().toISOString()).all();
  return jsonResponse({ listings: result.results });
}

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_KEY) return jsonResponse({ error: "Coordinator access is not configured." }, 503);
  const suppliedKey = request.headers.get("x-admin-key") || "";
  if (suppliedKey.length !== env.ADMIN_KEY.length || suppliedKey !== env.ADMIN_KEY) {
    return jsonResponse({ error: "Coordinator key is not valid." }, 401);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  const title = text(input.title, 80);
  const category = input.category;
  const neighborhood = text(input.neighborhood, 60);
  const notes = text(input.notes, 280);
  const portions = Number(input.portions);
  const pickupAt = typeof input.pickup_at === "string" ? new Date(input.pickup_at) : null;
  if (title.length < 3 || neighborhood.length < 2) {
    return jsonResponse({ error: "Add a food title and a neighborhood." }, 400);
  }
  if (!ALLOWED_CATEGORIES.has(category)) return jsonResponse({ error: "Choose a valid food category." }, 400);
  if (!Number.isInteger(portions) || portions < 1 || portions > 500) {
    return jsonResponse({ error: "Portions must be a whole number between 1 and 500." }, 400);
  }
  if (!pickupAt || Number.isNaN(pickupAt.getTime()) || pickupAt <= new Date()) {
    return jsonResponse({ error: "Pickup time must be a valid future date and time." }, 400);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO listings (id, title, category, total_portions, portions_remaining, neighborhood, pickup_at, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')",
  ).bind(id, title, category, portions, portions, neighborhood, pickupAt.toISOString(), notes).run();
  return jsonResponse({ listing: { id, title, category, portions_remaining: portions, neighborhood, pickup_at: pickupAt.toISOString(), notes } }, 201);
}
