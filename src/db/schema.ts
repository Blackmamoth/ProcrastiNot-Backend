import { randomUUID } from "crypto";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const priorityEnum = pgEnum("todo_priority", ["low", "medium", "high"]);

export const task = pgTable("task", {
  id: uuid("id").primaryKey().default(randomUUID()),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: priorityEnum().default("medium"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type AddTaskType = InferInsertModel<typeof task>;

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().default(randomUUID()),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  age: integer("age").notNull(),
  mainGoal: text("main_goal").notNull(),
  motivation: text("motivation").notNull(),
  background: text("background").notNull(),
  currentRoutine: text("current_routine").notNull(),
  procrastinationTriggers: text("procrastination_triggers").notNull(),
});

export type AddProfileType = InferInsertModel<typeof profile>;
