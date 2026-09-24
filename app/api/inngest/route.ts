import { inngest } from "@/lib/inngest/client";
import { processDocument } from "@/lib/inngest/functions/process-document";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processDocument],
});