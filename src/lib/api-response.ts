type ApiErrorCode =
  | "DATABASE_UNAVAILABLE"
  | "INTERNAL_ERROR"
  | "INVALID_CONTENT_TYPE"
  | "INVALID_JSON"
  | "NOT_FOUND"
  | "PAYLOAD_TOO_LARGE"
  | "VALIDATION_ERROR";

type FieldErrors = Record<string, string[]>;

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  fields?: FieldErrors,
): Response {
  return Response.json(
    {
      error: {
        code,
        message,
        ...(fields ? { fields } : {}),
      },
    },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function apiSuccess(data: object, status = 200): Response {
  return Response.json(
    { data },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
