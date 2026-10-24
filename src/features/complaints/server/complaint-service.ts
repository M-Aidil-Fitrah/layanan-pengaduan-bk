import "server-only";

import { randomBytes } from "node:crypto";

import { Prisma } from "@/generated/prisma/client";

import type { ComplaintSubmission } from "../schemas/complaint-schemas";
import {
  complaintRepository,
  type PublicComplaint,
} from "./complaint-repository";

const MAX_TRACKING_CODE_ATTEMPTS = 5;

export class ComplaintPersistenceError extends Error {
  constructor() {
    super("Complaint persistence failed.");
    this.name = "ComplaintPersistenceError";
  }
}

function createTrackingCode(): string {
  return `BK-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export async function createComplaint(
  submission: ComplaintSubmission,
): Promise<PublicComplaint> {
  for (let attempt = 0; attempt < MAX_TRACKING_CODE_ATTEMPTS; attempt += 1) {
    try {
      return await complaintRepository.create({
        ...submission,
        trackingCode: createTrackingCode(),
      });
    } catch (error) {
      const isTrackingCodeConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";

      if (!isTrackingCodeConflict || attempt === MAX_TRACKING_CODE_ATTEMPTS - 1) {
        throw new ComplaintPersistenceError();
      }
    }
  }

  throw new Error("Tracking code generation failed.");
}

export function findComplaintForPublicTracking(
  trackingCode: string,
): Promise<PublicComplaint | null> {
  return complaintRepository
    .findPublicByTrackingCode(trackingCode)
    .catch(() => {
      throw new ComplaintPersistenceError();
    });
}
