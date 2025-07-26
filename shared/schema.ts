import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const charities = pgTable("charities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  category: text("category").notNull(), // muslim, international, gaza, medical, education
  focusArea: text("focus_area").notNull(),
  featured: text("featured").default("false"), // "true" or "false"
});

export const insertCharitySchema = createInsertSchema(charities).omit({
  id: true,
});

export type InsertCharity = z.infer<typeof insertCharitySchema>;
export type Charity = typeof charities.$inferSelect;
