import z from "zod";

export const getChunksSchema = z.object({
  chunkId: z
    .string({
      required_error: "Chunk ID is required."
    })
    .length(36),
  accessToken: z
    .string({
      required_error: "Access token is required."
    })
    .length(128)
});

export type GetChunksSchemaType = z.infer<typeof getChunksSchema>;
