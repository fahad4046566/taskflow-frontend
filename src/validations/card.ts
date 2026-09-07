import { z } from "zod";
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);


export const CreateCardSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title is too long (max 200 characters)"),
  
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description is too long (max 1000 characters)"),
  
  position: z.number()
    .int("Position must be an integer")
    .positive("Position must be greater than 0")
    .min(1, "Position must be at least 1"),
  
  dueDate: z.string().min(1, "Due date is required"),
  
  priority: PriorityEnum,
});

export type CreateCard = z.infer<typeof CreateCardSchema>;