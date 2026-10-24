import { z } from "zod";

export const complaintSubmissionSchema = z
  .object({
    audience: z.enum(["STUDENT", "UNIVERSITY_STUDENT", "PARENT_OR_GUARDIAN", "OTHER"]),
    category: z.enum(["PERSONAL", "ACADEMIC", "SOCIAL", "EMOTIONAL_WELLBEING", "OTHER"]),
    consent: z.literal(true, { error: "Persetujuan diperlukan sebelum pengaduan dikirim." }),
    contact: z.string().trim().max(120).optional().or(z.literal("")),
    details: z.string().trim().min(10, "Ceritakan masalahmu setidaknya dalam 10 karakter.").max(2_000, "Uraian pengaduan tidak boleh lebih dari 2.000 karakter."),
    isAnonymous: z.boolean(),
    name: z.string().trim().max(120).optional().or(z.literal("")),
    title: z.string().trim().min(1, "Judul pengaduan diperlukan.").max(100, "Judul pengaduan tidak boleh lebih dari 100 karakter."),
    urgency: z.enum(["CONSULTATION", "SOON", "UNSAFE_NOW"]),
  })
  .transform((submission) => ({
    ...submission,
    contact: submission.isAnonymous ? undefined : submission.contact || undefined,
    name: submission.isAnonymous ? undefined : submission.name || undefined,
  }));

export const trackingCodeSchema = z.string().trim().min(8, "Masukkan kode pengaduan yang lengkap.").max(64, "Kode pengaduan tidak valid.").regex(/^[A-Z0-9-]+$/i, "Kode hanya boleh berisi huruf, angka, dan tanda hubung.").transform((code) => code.toUpperCase());

export const complaintCreatedResponseSchema = z.object({ data: z.object({ trackingCode: z.string().min(8) }) });
export const trackedComplaintResponseSchema = z.object({ data: z.object({ createdAt: z.string().datetime(), status: z.literal("RECEIVED"), trackingCode: z.string().min(8) }) });

export type ComplaintSubmission = z.output<typeof complaintSubmissionSchema>;
