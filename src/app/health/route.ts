// A dependency-free probe for the production build, not a portfolio screen.
export function GET() {
  return Response.json({ status: "ok" });
}
