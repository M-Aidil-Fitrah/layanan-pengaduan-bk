import { z } from "zod";

import { complaintSubmissionSchema } from "@/features/complaints/schemas/complaint-schemas";
import {
  ComplaintPersistenceError,
  createComplaint,
} from "@/features/complaints/server/complaint-service";
import { apiError, apiSuccess } from "@/lib/api-response";
import { DatabaseConfigurationError } from "@/lib/database";

const MAX_BODY_SIZE = 16_384;

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return apiError(
      415,
      "INVALID_CONTENT_TYPE",
      "Gunakan content type application/json.",
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
    return apiError(413, "PAYLOAD_TOO_LARGE", "Ukuran request terlalu besar.");
  }

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
      return apiError(413, "PAYLOAD_TOO_LARGE", "Ukuran request terlalu besar.");
    }

    let parsedJson;

    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return apiError(400, "INVALID_JSON", "Body request bukan JSON yang valid.");
    }

    const result = complaintSubmissionSchema.safeParse(parsedJson);

    if (!result.success) {
      return apiError(
        422,
        "VALIDATION_ERROR",
        "Periksa kembali isian pengaduan.",
        z.flattenError(result.error).fieldErrors,
      );
    }

    const complaint = await createComplaint(result.data);

    return apiSuccess(
      {
        createdAt: complaint.createdAt.toISOString(),
        status: complaint.status,
        trackingCode: complaint.trackingCode,
      },
      201,
    );
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof ComplaintPersistenceError
    ) {
      return apiError(
        503,
        "DATABASE_UNAVAILABLE",
        "Layanan penyimpanan belum tersedia. Silakan coba kembali nanti.",
      );
    }

    return apiError(
      500,
      "INTERNAL_ERROR",
      "Pengaduan belum dapat diproses. Silakan coba kembali.",
    );
  }
}
