import { z } from 'zod';

// 🔒 ZOD SCHEMA - Runtime validation
export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }).nullable(),
});

// 🔒 ARRAY SCHEMA
export const TaskArraySchema = z.array(TaskSchema);

// ✅ TypeScript type derived from Zod schema
export type Task = z.infer<typeof TaskSchema>;

// 🔒 VALIDATION FUNCTIONS
export const validateTask = (data: unknown): Task => {
  return TaskSchema.parse(data); // Throws error if invalid
};

export const validateTaskArray = (data: unknown): Task[] => {
  return TaskArraySchema.parse(data); // Throws error if invalid
}; 