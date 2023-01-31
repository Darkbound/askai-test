import z from "zod";

export const questionSchema = z.object({
  question: z
    .string({
      required_error: "Question is required."
    })
    .min(5)
});

export type QuestionSchemaType = z.infer<typeof questionSchema>;
