-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('PERSONAL', 'ACADEMIC', 'SOCIAL', 'EMOTIONAL_WELLBEING', 'OTHER');

-- CreateEnum
CREATE TYPE "ReporterAudience" AS ENUM ('STUDENT', 'UNIVERSITY_STUDENT', 'PARENT_OR_GUARDIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('CONSULTATION', 'SOON', 'UNSAFE_NOW');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED');

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "trackingCode" VARCHAR(64) NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "audience" "ReporterAudience" NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "details" VARCHAR(2000) NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL,
    "name" VARCHAR(120),
    "contact" VARCHAR(120),
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Complaint_anonymous_identity_check" CHECK (
        NOT "isAnonymous" OR ("name" IS NULL AND "contact" IS NULL)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_trackingCode_key" ON "Complaint"("trackingCode");
