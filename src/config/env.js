import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z
    .string()
    .default("mongodb://localhost:27017/express-mongo-template"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRY: z.string().default("7d"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_SENDER: z.string().email().optional(),
  EMAIL_RECEIVER: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.prettifyError(parsed.error),
  );
  process.exit(1);
}

export const env = parsed.data;

export default env;
