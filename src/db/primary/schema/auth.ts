import { relations } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { organizations } from "./organizations";

export const user = sqliteTable("user", {
  // lucia mandatory
  id: text("id").primaryKey(),

  // other
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),

  // google auth stuff
  email: text("email"),
  name: text("name").notNull(),
  picture: text("picture").notNull(),

  // relations
  buisness_id: integer("buisness_id", { mode: "number" }),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const userRelations = relations(user, ({ one }) => ({
  organization: one(organizations, {
    fields: [user.buisness_id],
    references: [organizations.id],
  }),
}));

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});
