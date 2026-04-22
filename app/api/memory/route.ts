// app/api/memory/route.js
export async function GET() {
  const memory = process.memoryUsage();
  return Response.json(memory);
}