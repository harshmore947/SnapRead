/*
  Warnings:

  - You are about to drop the column `status` on the `PDFSummaries` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentStatus" AS ENUM ('UPLOADED', 'QUEUED', 'PARSING', 'CHUNKING', 'INDEXING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "public"."PDFSummaries" DROP COLUMN "status",
ADD COLUMN     "doc_status" "public"."DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "raw_text" TEXT,
ALTER COLUMN "summary_text" DROP NOT NULL;
