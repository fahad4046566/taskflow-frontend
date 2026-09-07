import z from "zod";

export const CreateListSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  position: z
    .number()
    .int("Position must be an integer")
    .positive("Position must be greater than 0")
    .min(1, "Position must be at least 1"),
});
export type CreateList = z.infer<typeof CreateListSchema>;
