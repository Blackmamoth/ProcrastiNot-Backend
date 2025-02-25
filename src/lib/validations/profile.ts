import { z } from "zod";

export const addProfileSchema = z.object({
  age: z
    .number({ message: "Age is required and should be a number" })
    .gt(18, { message: "You need to of age 18 or above" }),
  mainGoal: z
    .string({ message: "Main goal is required" })
    .trim()
    .min(1, { message: "Main goal is required" }),
  motivation: z
    .string({ message: "Motivation is required" })
    .trim()
    .min(1, { message: "Motivation cannot be empty" }),
  background: z
    .string({ message: "Background is required" })
    .trim()
    .min(1, { message: "Background cannot be empty" }),
  currentRoutine: z
    .string({ message: "Current routine is required" })
    .trim()
    .min(1, { message: "Current routine cannot be empty" }),
  procrastinationTriggers: z
    .string({ message: "Procrastination trigger is required" })
    .trim()
    .min(1, { message: "Procrastionation triggers cannot be empty" }),
});

export const updateProfileSchema = z.object({
  age: z.number().optional(),
  mainGoal: z.string().trim().optional(),
  motivation: z.string().trim().optional(),
  background: z.string().trim().optional(),
  currentRoutine: z.string().optional(),
  procrastinationTriggers: z.string().trim().optional(),
});

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;
