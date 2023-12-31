import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const organizations = sqliteTable("organizations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  database_name: text("database_name").notNull(),
  database_auth_token: text("database_auth_token").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});
export type Organization = typeof organizations.$inferSelect;

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(user),
}));
