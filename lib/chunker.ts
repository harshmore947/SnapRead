export interface DocumentChunk {
  content: string;
  pageNumber: number;
  sectionPath: string;
  tokenEstimate: number;
}

export function chunkDocumentText(text: string): DocumentChunk[] {
  const lines = text.split("\n");
  const chunks: DocumentChunk[] = [];

  let currentHeaders: string[] = [];
  let currentChunkLines: string[] = [];
  let currentPage = 1;

  // Helper to package up the current lines into a chunk
  const flushChunk = () => {
    const content = currentChunkLines.join("\n").trim();
    if (content.length > 0) {
      chunks.push({
        content,
        pageNumber: currentPage,
        sectionPath: currentHeaders.join(" > ") || "General",
        tokenEstimate: Math.ceil(content.length / 4),
      });
      currentChunkLines = [];
    }
  };

  for (const line of lines) {
    // 1. Check for page break marker
    if (line.includes("<!-- PAGE_BREAK:")) {
      const match = line.match(/<!-- PAGE_BREAK: (\d+) -->/);
      if (match) {
        currentPage = parseInt(match[1], 10);
      }
      continue;
    }

    // 2. Check for Markdown headings (e.g. # Title, ## Subtitle)
    if (line.trim().startsWith("#")) {
      flushChunk(); // Save what we had before this new section

      // Count the number of '#' at the start (e.g. "###" -> length 3)
      const headingMatch = line.match(/^(#+)\s*(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length; // 1, 2, 3...
        const title = headingMatch[2].trim();

        // Slice to keep parent headers up to this level, then append current
        currentHeaders = currentHeaders.slice(0, level - 1);
        currentHeaders.push(title);
      }
      continue;
    }

    // 3. Regular text line
    currentChunkLines.push(line);

    // If accumulated text is larger than ~2000 chars (approx 500 tokens), flush it
    if (currentChunkLines.join("\n").length > 2000) {
      flushChunk();
    }
  }

  // 4. Final flush for any leftover lines at the end of the file
  flushChunk();

  return chunks;
}
