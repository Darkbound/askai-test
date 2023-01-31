import { NextApiRequest } from "next";

export interface GenerateChunkAuthTokenReq extends NextApiRequest {}

export interface GenerateChunkAuthTokenRes {
  token: string;
}

export interface GetChunkReq extends NextApiRequest {
  query: {
    chunkId: string;
    accessToken: string;
  };
}

export interface GetChunkRes {
  chunk: string;
}
