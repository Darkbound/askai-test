import z from "zod";

export const questionSchema = z.object({
  question: z.string(),
});

export type QuestionSchemaType = z.infer<typeof questionSchema>;
