import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponseBase, GetChunkReq } from "types";
import { chunkHolderAxios } from "services";

export interface HelloResponse {}

const handler = nc<GetChunkReq, NextApiResponse<ApiResponseBase<HelloResponse>>>({
  onError: (err, req, res, next) => {
    console.log(err);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  }
}).get(async (req, res) => {
  const { chunkId, accessToken } = req.query;

  const chunksRes = await chunkHolderAxios.get(`/chunks/${chunkId}`, {
    headers: {
      Authorization: accessToken
    }
  });

  return res.status(200).json(chunksRes.data);
});

export default handler;
