import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

const dateOrString = z.union([z.date(), z.string()]);

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: dateOrString,
	updated_at: dateOrString,
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: z.date().optional(),
	updated_at: z.date().optional(),
});

export type Todo = z.infer<typeof todoSelectSchema>;
export type NewTodo = z.infer<typeof todoInsertSchema>;
