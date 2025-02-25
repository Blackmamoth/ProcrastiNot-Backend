import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "title cannot be empty" }),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  deadline: z.date().optional(),
});

export const getTasksSchema = z.object({
  task_id: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  search: z.string().trim().optional(),
});

export type GetTaskType = z.infer<typeof getTasksSchema>;

export const updateTaskSchema = z.object({
  task_id: z.string({ message: "task_id is required" }).trim(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.date().optional(),
});

export type UpdateTaskType = z.infer<typeof updateTaskSchema>;

export const deleteTaskSchema = z.object({
  task_id: z.string({ message: "task_id is required" }).trim(),
});

export type DeleteTaskType = z.infer<typeof deleteTaskSchema>;
