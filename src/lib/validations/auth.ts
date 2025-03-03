import { z } from "zod";

export const authSignUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password should be of minimum 8 characters" })
    .max(16, { message: "Password should be of maximum 16 characters" }),
});

export const authSigninSchema = authSignUpSchema.omit({ name: true });
