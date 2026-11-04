import { z } from "zod";

import { publicRegistrationRoles } from "@/lib/auth/roles";

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/[0-9]/, "Include a number.");

export const registrationSchema = z
  .object({
    displayName: z.string().trim().min(2, "Enter your full name.").max(100),
    email: z.string().trim().pipe(z.email("Enter a valid email address.")).transform((email) => email.toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(publicRegistrationRoles),
    organizationName: z.string().trim().min(2).max(120).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")).transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Enter your password."),
  redirectTo: z.string().optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
