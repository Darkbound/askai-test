import { AskAQuestionForm } from "collections";
import { Answer, Button, Spinner, TextInput } from "components";
import { useGlobalContext } from "context";
import { useEffect } from "react";

export default function Home() {
  const { answers, isFetchingAnswers } = useGlobalContext();

  return (
    <main className="w-full">
      <div className="max-w-[500px] mx-auto mt-10">
        <AskAQuestionForm className="w-full flex mb-8" />

        {isFetchingAnswers ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : answers.length > 0 ? (
          answers.map((answerProps, i) => (
            <Answer key={`${answerProps.content.substring(0, 5)}-${i}`} className="mb-2" answerIndex={i + 1} {...answerProps} />
          ))
        ) : (
          <div className="font-bold text-lg">No answers, try another question.</div>
        )}
      </div>
    </main>
  );
}
