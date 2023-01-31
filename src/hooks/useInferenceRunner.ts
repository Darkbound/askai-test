import axios, { AxiosError } from "axios";
import { useState } from "react";
import { AskAQuestionRes } from "types";

export const useInferenceRunner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string) => {
    setIsLoading(true);

    try {
      const {
        data: { chunks }
      } = await axios.post<AskAQuestionRes>("/api/inference-runner/ask-question", {
        question
      });

      setIsLoading(false);

      return chunks;
    } catch (e) {
      setError((e as AxiosError).message);
      setIsLoading(false);

      return [];
    }
  };

  return { askQuestion, isLoading, error };
};
