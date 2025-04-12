import { z } from 'zod';

// Phone number validation schema
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .regex(/^[0-9+\-() ]+$/, 'Phone number can only contain numbers, +, -, (, ), and spaces');

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// OTP validation schema
export const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^[0-9]+$/, 'OTP can only contain numbers');

// Message validation schema
export const messageSchema = z
  .string()
  .min(1, 'Message is required')
  .max(160, 'Message must not exceed 160 characters');

// Contact form validation schema
export const contactFormSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneSchema,
  email: emailSchema.optional(),
});

// Message form validation schema
export const messageFormSchema = z.object({
  phoneNumber: phoneSchema,
  message: messageSchema,
});

// Validation error type
export type ValidationError = {
  field: string;
  message: string;
};

// Helper function to format validation errors
export function formatValidationErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
} 