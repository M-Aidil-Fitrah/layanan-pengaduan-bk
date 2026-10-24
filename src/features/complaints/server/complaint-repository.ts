import "server-only";

import { getDatabaseClient } from "@/lib/database";

import type { ComplaintSubmission } from "../schemas/complaint-schemas";

export type ComplaintCreationInput = ComplaintSubmission & {
  trackingCode: string;
};

export type PublicComplaint = {
  createdAt: Date;
  status: "RECEIVED";
  trackingCode: string;
};

export const complaintRepository = {
  async create(input: ComplaintCreationInput): Promise<PublicComplaint> {
    return getDatabaseClient().complaint.create({
      data: {
        audience: input.audience,
        category: input.category,
        contact: input.contact,
        details: input.details,
        isAnonymous: input.isAnonymous,
        name: input.name,
        title: input.title,
        trackingCode: input.trackingCode,
        urgency: input.urgency,
      },
      select: {
        createdAt: true,
        status: true,
        trackingCode: true,
      },
    });
  },

  async findPublicByTrackingCode(
    trackingCode: string,
  ): Promise<PublicComplaint | null> {
    return getDatabaseClient().complaint.findUnique({
      where: { trackingCode },
      select: {
        createdAt: true,
        status: true,
        trackingCode: true,
      },
    });
  },
};
