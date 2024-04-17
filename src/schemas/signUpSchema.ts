import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, { message: "username must be at least 4 characters" })
  .max(20, { message: "username must not be more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "username must not contain special characters",
  })
  .trim();

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "please provide a valid email" }),
  password: z.string().min(6, {message: "password must be at least 6 characters"}),
});
