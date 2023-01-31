import nc from "next-connect";
import { NextApiResponse } from "next";
import {
  ApiResponseBase,
  GenerateChunkAuthTokenReq,
  GenerateChunkAuthTokenRes,
} from "types";
import { chunkHolderAxios } from "services";

const handler = nc<
  GenerateChunkAuthTokenReq,
  NextApiResponse<ApiResponseBase<GenerateChunkAuthTokenRes>>
>({
  onError: (err, req, res, next) => {
    console.log(err.message);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  },
}).post(async (req, res) => {
  const getAuthTokenRes = await chunkHolderAxios.post("/auth/generate-token");

  return res.status(200).json(getAuthTokenRes.data);
});

export default handler;
