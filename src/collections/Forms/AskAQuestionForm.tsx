import { HTMLFormProps } from "types";
import { twMerge } from "tailwind-merge";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionSchemaType, questionSchema } from "schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, TextInput } from "components";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "context";
import { useChunksHolder, useInferenceRunner } from "hooks";

export interface AskAQuestionFormProps extends HTMLFormProps {}

export const AskAQuestionForm = ({ className, ...props }: AskAQuestionFormProps) => {
  const classes = twMerge(`flex flex-col ${className}`);

  const { setAnswers, setIsFetchingAnswers, getCurrentAccessToken, setAccessToken } = useGlobalContext();
  const { askQuestion, isLoading: isInferenceRunnerLoading } = useInferenceRunner();
  const { fetchAnswers, getToken, isLoading: isChunksHolderLoading } = useChunksHolder();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isChunksHolderLoading || isInferenceRunnerLoading) {
      setIsFetchingAnswers(true);
    } else {
      setIsFetchingAnswers(false);
    }
  }, [isInferenceRunnerLoading, isChunksHolderLoading]);

  const form = useForm<QuestionSchemaType>({
    resolver: zodResolver(questionSchema),
    mode: "all",
    defaultValues: {
      question: ""
    }
  });

  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<QuestionSchemaType> = async ({ question }) => {
    try {
      setError(null);

      const chunks = await askQuestion(question);

      const chunksToFetch = chunks.filter(({ confidence }) => confidence >= 70);

      const currentAccessToken = await getCurrentAccessToken();

      if (!currentAccessToken) setError("Unexpected error");

      const answers = await fetchAnswers(chunksToFetch, currentAccessToken || "");

      setAnswers(answers.sort((answerA, answerB) => answerB.confidence - answerA.confidence));
    } catch (e) {
      console.log(e);

      setError((e as AxiosError).message);
    }
  };

  return (
    <form {...props} className={classes} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        <TextInput name="question" className="w-full h-fit" placeholder="HELLOOOOOOO" control={control} />
        <Button className="self-center">Get Answers</Button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};
