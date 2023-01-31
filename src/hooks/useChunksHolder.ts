import axios, { AxiosError } from "axios";
import { AnswerType } from "context";
import { useState } from "react";
import { AskAQuestionRes, ChunkType, GenerateChunkAuthTokenRes, GetChunkRes } from "types";

export const useChunksHolder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswers = async (chunks: ChunkType[], accessToken: string): Promise<AnswerType[]> => {
    setIsLoading(true);

    const fetchedAnswers = await Promise.allSettled(
      chunks.map(({ chunkId }) => axios.get(`/api/chunk-holder/chunk?chunkId=${chunkId}&accessToken=${accessToken}`))
    );

    const finalAnswers = fetchedAnswers.map((answer, i) =>
      answer.status === "fulfilled"
        ? {
            confidence: chunks[i].confidence,
            content: answer.value.data,
            chunkId: chunks[i].chunkId,
            error: null
          }
        : {
            confidence: chunks[i].confidence,
            content: "",
            error: "There was an error fetching the content of this answer.",
            chunkId: chunks[i].chunkId
          }
    );

    setIsLoading(false);

    return finalAnswers;
  };

  const getToken = async () => {
    setIsLoading(true);

    try {
      const {
        data: { token }
      } = await axios.post<GenerateChunkAuthTokenRes>("/api/chunk-holder/generate-auth-token");

      return token;
    } catch (e) {
      console.log(e);

      setIsLoading(false);
      return null;
    }
  };

  const refetchAnswer = async (chunkId: string, accessToken: string | null): Promise<{ content: string; error: boolean }> => {
    setIsLoading(true);

    try {
      const fetchedAnswer = await axios.get(`/api/chunk-holder/chunk?chunkId=${chunkId}&accessToken=${accessToken}`);

      setIsLoading(false);

      return { error: false, content: fetchedAnswer.data };
    } catch (e) {
      setIsLoading(false);

      return { error: true, content: "There was an error fetching the content of this answer." };
    }
  };

  const getTokenExpiration = (token: string) => {
    const jwtExpirationPart = token.split(".")[1];

    if (!jwtExpirationPart) return -1; // invalid JWT token

    const expiration = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));

    return expiration.exp * 1000 - Date.now();
  };

  return { getToken, fetchAnswers, refetchAnswer, getTokenExpiration, isLoading, error };
};
