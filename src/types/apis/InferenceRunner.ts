import { NextApiRequest } from "next";

export interface AskAQuestionReq extends NextApiRequest {
  body: { question: string };
}

export interface AskAQuestionRes {
  chunks: ChunkType[];
}

export type ChunkType = { chunkId: string; confidence: number };
