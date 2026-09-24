import { google } from "@ai-sdk/google";
import { embedMany } from "ai";


const EMBEDDING_MODEL = google.embedding("text-embedding-004");

export interface EmbeddingResult {
  content: string;
  embedding: number[];
}


export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values: texts,
  });

  return embeddings;
}


export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}