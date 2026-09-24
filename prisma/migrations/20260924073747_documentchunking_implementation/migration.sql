-- CreateTable
CREATE TABLE "public"."DocumentChunk" (
    "id" TEXT NOT NULL,
    "summaryId" TEXT NOT NULL,
    "page_number" INTEGER NOT NULL,
    "section_path" TEXT NOT NULL DEFAULT 'GENERAL',
    "content" TEXT NOT NULL,
    "token_estimate" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentChunk_summaryId_idx" ON "public"."DocumentChunk"("summaryId");

-- AddForeignKey
ALTER TABLE "public"."DocumentChunk" ADD CONSTRAINT "DocumentChunk_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "public"."PDFSummaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
