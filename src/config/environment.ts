import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export const GlobalConfig = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  PORT: process.env.PORT,
  FRONTEND_HOST: process.env.FRONTEND_HOST,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

export const AuthConfig = {
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
};
