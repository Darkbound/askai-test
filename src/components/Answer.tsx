import { twMerge } from "tailwind-merge";
import { AnswerType, useGlobalContext } from "context";
import { useChunksHolder } from "hooks";
import { useState } from "react";
import { HTMLDivProps } from "types";
import { Button } from "./Button";

export interface AnswerProps extends HTMLDivProps, AnswerType {
  answerIndex: number;
}

export const Answer = ({ answerIndex, chunkId, content, confidence, error, className, ...props }: AnswerProps) => {
  const classes = twMerge(`border border-black ${className}`);

  const [answer, setAnswer] = useState({
    chunkId,
    content,
    confidence,
    error
  });

  const { refetchAnswer, isLoading } = useChunksHolder();
  const { getCurrentAccessToken } = useGlobalContext();

  const retryFetchingAnswer = async () => {
    const currentAccessToken = await getCurrentAccessToken();

    if (!currentAccessToken) return;

    const refetchedAnswer = await refetchAnswer(chunkId, currentAccessToken);

    if (refetchedAnswer.error) {
      setAnswer(prevAnswer => ({ ...prevAnswer, content: refetchedAnswer.content, error: refetchedAnswer.content }));
    } else {
      setAnswer(prevAnswer => ({ ...prevAnswer, content: refetchedAnswer.content, error: null }));
    }
  };

  return (
    <div {...props} className={classes}>
      <div className="p-2 text-center border-b border-black font-bold w-full flex justify-between">
        Answer: {answerIndex}{" "}
        {answer.error && (
          <Button variant="danger" className="text-xs min-w-fit leading-6 px-2 rounded-lg" onClick={retryFetchingAnswer}>
            {isLoading ? "Loading..." : "Refetch"}
          </Button>
        )}
      </div>
      <div
        className="border-b border-black text-center py-8 answer-to-question"
        dangerouslySetInnerHTML={{ __html: isLoading ? "Loading..." : answer.error || answer.content }}
      />
      <div className="p-2">Confidence: {answer.confidence.toFixed(2)}%</div>
    </div>
  );
};
