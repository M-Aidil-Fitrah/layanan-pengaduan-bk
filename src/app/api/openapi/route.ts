import { openApiDocument } from "@/lib/openapi";

export function GET(): Response {
  return Response.json(openApiDocument, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
