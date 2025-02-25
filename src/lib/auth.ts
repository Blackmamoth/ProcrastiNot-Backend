import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { AuthConfig } from "../config/environment";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  socialProviders: {
    github: {
      clientId: AuthConfig.GITHUB_CLIENT_ID,
      clientSecret: AuthConfig.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: AuthConfig.GOOGLE_CLIENT_ID,
      clientSecret: AuthConfig.GOOGLE_CLIENT_SECRET,
    },
  },
});
