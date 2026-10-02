import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid Indian mobile number"
    ),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100, "Password is too long"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});


export const updateUserStatusSchema = z.object({
  status: z.enum([
    "APPROVED",
    "REJECTED",
    "BLOCKED",
  ]),
});


export const createGaneshaSchema = z.object({
  year: z
    .number()
    .int("Year must be a whole number.")
    .min(1900, "Please enter a valid year.")
    .max(2100, "Please enter a valid year."),

  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters.")
    .max(150, "Title is too long."),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long.")
    .optional()
    .or(z.literal("")),

  imageUrl: z
    .string()
    .trim()
    .url("Please enter a valid image URL."),
});

export const updateGaneshaSchema =
  createGaneshaSchema.partial();