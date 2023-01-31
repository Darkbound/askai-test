import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponseBase, AskAQuestionReq, AskAQuestionRes } from "types";
import { inferenceRunnerAxios } from "services";
import { questionSchema } from "schemas";

const handler = nc<AskAQuestionReq, NextApiResponse<ApiResponseBase<AskAQuestionRes>>>({
  onError: (err, req, res, next) => {
    console.log(err.message);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  }
}).post(async (req, res) => {
  const { question } = questionSchema.parse(req.body);

  const answerRes = await inferenceRunnerAxios.post("/ask", { question });

  return res.status(200).json(answerRes.data);
});

export default handler;
