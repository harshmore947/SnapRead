import { prisma } from "@/lib/prisma";
import { embedText } from "./embeddings";

export interface RetrievedChunk {
  id: string;
  pageNumber: number;
  sectionPath: string;
  content: string;
  tokenEstimate: number;
  rrfScore: number;
}

export interface HybridSearchOptions {
  summaryId: string;
  query: string;
  queryEmbedding?: number[];
  topK?: number;
}

/**
 * Native PostgreSQL Hybrid Search combining:
 * 1. Dense Semantic Vector Search (Cosine Distance <=> via pgvector)
 * 2. Sparse Lexical Search (PostgreSQL Full-Text Search ts_rank_cd)
 * 3. Reciprocal Rank Fusion (RRF) to combine ranks:
 *    RRF_Score = (1 / (60 + vector_rank)) + (1 / (60 + text_rank))
 */
export async function hybridSearch({
  summaryId,
  query,
  queryEmbedding,
  topK = 5,
}: HybridSearchOptions): Promise<RetrievedChunk[]> {
  try {
    // 1. If query embedding is not provided, generate it using Gemini
    const embedding = queryEmbedding ?? (await embedText(query));
    const vectorString = `[${embedding.join(",")}]`;

    // Clean query string for full text search (fallback to query if empty)
    const sanitizedQuery = query.replace(/[^\w\s]/gi, " ").trim() || query;

    // 2. Execute unified Hybrid RRF query in PostgreSQL
    const results = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        page_number: number;
        section_path: string;
        content: string;
        token_estimate: number;
        rrf_score: number;
      }>
    >(
      `
      WITH vector_search AS (
        SELECT
          id,
          page_number,
          section_path,
          content,
          token_estimate,
          ROW_NUMBER() OVER (ORDER BY embedding <=> $2::vector) as vector_rank
        FROM "DocumentChunk"
        WHERE "summaryId" = $1 AND embedding IS NOT NULL
        ORDER BY embedding <=> $2::vector
        LIMIT 20
      ),
      text_search AS (
        SELECT
          id,
          page_number,
          section_path,
          content,
          token_estimate,
          ROW_NUMBER() OVER (
            ORDER BY ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', $3)) DESC
          ) as text_rank
        FROM "DocumentChunk"
        WHERE "summaryId" = $1
          AND to_tsvector('english', content) @@ plainto_tsquery('english', $3)
        ORDER BY ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', $3)) DESC
        LIMIT 20
      )
      SELECT
        COALESCE(v.id, t.id) AS id,
        COALESCE(v.page_number, t.page_number) AS page_number,
        COALESCE(v.section_path, t.section_path) AS section_path,
        COALESCE(v.content, t.content) AS content,
        COALESCE(v.token_estimate, t.token_estimate) AS token_estimate,
        (
          COALESCE(1.0 / (60.0 + v.vector_rank), 0.0) +
          COALESCE(1.0 / (60.0 + t.text_rank), 0.0)
        ) AS rrf_score
      FROM vector_search v
      FULL OUTER JOIN text_search t ON v.id = t.id
      ORDER BY rrf_score DESC
      LIMIT $4;
      `,
      summaryId,
      vectorString,
      sanitizedQuery,
      topK
    );

    return results.map((row) => ({
      id: row.id,
      pageNumber: row.page_number,
      sectionPath: row.section_path,
      content: row.content,
      tokenEstimate: row.token_estimate,
      rrfScore: Number(row.rrf_score),
    }));
  } catch (error) {
    console.error("Hybrid search failed, falling back to basic chunk retrieval:", error);

    // Fallback: If vector extension or raw query fails, fetch first few chunks
    const fallbackChunks = await prisma.documentChunk.findMany({
      where: { summaryId },
      take: topK,
      orderBy: { page_number: "asc" },
    });

    return fallbackChunks.map((chunk) => ({
      id: chunk.id,
      pageNumber: chunk.page_number,
      sectionPath: chunk.section_path,
      content: chunk.content,
      tokenEstimate: chunk.token_estimate,
      rrfScore: 0,
    }));
  }
}

/**
 * Formats retrieved chunks into context string with explicit page and section citations
 * for grounding the LLM response.
 */
export function formatRetrievedContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "No relevant sections found in the document.";
  }

  return chunks
    .map((chunk, index) => {
      return `--- [SOURCE ${index + 1}: Page ${chunk.pageNumber} | Section: ${chunk.sectionPath}] ---\n${chunk.content}`;
    })
    .join("\n\n");
}
