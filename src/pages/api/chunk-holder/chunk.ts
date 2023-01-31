import nc from "next-connect";
import { NextApiResponse } from "next";
import { ApiResponseBase, GetChunkReq, GetChunkRes } from "types";
import { chunkHolderAxios } from "services";
import { getChunksSchema } from "schemas/getChunksSchema";
import { withRateLimit } from "../rateLimit";

const handler = nc<GetChunkReq, NextApiResponse<ApiResponseBase<GetChunkRes>>>({
  onError: (err, req, res, next) => {
    console.log(err.message);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  }
}).get(withRateLimit("getChunks"), async (req, res) => {
  const { chunkId, accessToken } = getChunksSchema.parse(req.query);

  const chunksRes = await chunkHolderAxios.get(`/chunks/${chunkId}`, {
    headers: {
      Authorization: accessToken
    }
  });

  return res.status(200).json(chunksRes.data);
});

export default handler;
