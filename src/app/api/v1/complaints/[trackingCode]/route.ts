import { trackingCodeSchema } from "@/features/complaints/schemas/complaint-schemas";
import {
  ComplaintPersistenceError,
  findComplaintForPublicTracking,
} from "@/features/complaints/server/complaint-service";
import { apiError, apiSuccess } from "@/lib/api-response";
import { DatabaseConfigurationError } from "@/lib/database";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/v1/complaints/[trackingCode]">,
): Promise<Response> {
  const { trackingCode: rawTrackingCode } = await context.params;
  const result = trackingCodeSchema.safeParse(rawTrackingCode);

  if (!result.success) {
    return apiError(404, "NOT_FOUND", "Kode pengaduan tidak ditemukan.");
  }

  try {
    const complaint = await findComplaintForPublicTracking(result.data);

    if (!complaint) {
      return apiError(404, "NOT_FOUND", "Kode pengaduan tidak ditemukan.");
    }

    return apiSuccess({
      createdAt: complaint.createdAt.toISOString(),
      status: complaint.status,
      trackingCode: complaint.trackingCode,
    });
  } catch (error) {
    if (
      error instanceof DatabaseConfigurationError ||
      error instanceof ComplaintPersistenceError
    ) {
      return apiError(
        503,
        "DATABASE_UNAVAILABLE",
        "Layanan pelacakan belum tersedia. Silakan coba kembali nanti.",
      );
    }

    return apiError(
      500,
      "INTERNAL_ERROR",
      "Status pengaduan belum dapat diperiksa. Silakan coba kembali.",
    );
  }
}
