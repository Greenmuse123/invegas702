// Cover generation has been disabled. This route is intentionally left blank.
export async function POST() {
  return new Response(JSON.stringify({ error: 'Cover generation is disabled.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
}
