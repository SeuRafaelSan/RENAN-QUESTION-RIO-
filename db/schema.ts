import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const responses = sqliteTable("responses", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  answers: text("answers").notNull(),
  scores: text("scores").notNull(),
  dominant: text("dominant").notNull(),
  createdAt: integer("created_at").notNull(),
});
