function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function onRequestPost({ request, env, params }) {
  let input;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  const portions = Number(input.portions);
  if (!Number.isInteger(portions) || portions < 1 || portions > 50) {
    return jsonResponse({ error: "Choose between 1 and 50 portions." }, 400);
  }

  const id = String(params.id || "");
  const claimId = crypto.randomUUID();
  const results = await env.DB.batch([
    env.DB.prepare(
      "UPDATE listings SET portions_remaining = portions_remaining - ?, status = CASE WHEN portions_remaining = ? THEN 'claimed' ELSE status END WHERE id = ? AND status = 'available' AND portions_remaining >= ? AND pickup_at > ?",
    ).bind(portions, portions, id, portions, new Date().toISOString()),
    env.DB.prepare(
      "INSERT INTO claims (id, listing_id, portions) SELECT ?, ?, ? WHERE changes() = 1",
    ).bind(claimId, id, portions),
  ]);
  if (!results[0].meta.changes) {
    return jsonResponse({ error: "That offer has changed or no longer has enough portions." }, 409);
  }

  const listing = await env.DB.prepare(
    "SELECT id, title, portions_remaining, status FROM listings WHERE id = ?",
  ).bind(id).first();
  return jsonResponse({ claim: { id: claimId, portions }, listing });
}
