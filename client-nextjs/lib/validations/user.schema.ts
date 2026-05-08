// File: lib/validations/user.schema.ts

import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name required"),

  username: z.string().min(3, "Username required"),

  email: z.string().email("Invalid email"),

  mobile: z.string().min(10, "Invalid mobile"),

  address: z.string().min(5, "Address required"),

  password: z.string().min(6, "Password minimum 6 chars"),

  role: z.enum(["admin", "mechanic", "user"]),
});

export const updateUserSchema = createUserSchema.partial().omit({
  password: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;