import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side size validation (20MB)
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File too large (max 20MB)" },
        { status: 400 }
      );
    }

    // Check PDF MIME type
    if (!file.type?.startsWith("application/pdf") && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF documents are allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename for S3/R2 key
    const sanitizedFileName = (file.name || "document.pdf")
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const key = `pdfs/${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizedFileName}`;

    // Upload directly to Cloudflare R2
    const result = await uploadToR2(
      buffer,
      key,
      file.type || "application/pdf"
    );

    return NextResponse.json(
      {
        ok: true,
        asset: {
          secure_url: result.url,
          public_id: result.key,
          bucket: result.bucket,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cloudflare R2 Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload file to Cloudflare R2",
      },
      { status: 500 }
    );
  }
}
