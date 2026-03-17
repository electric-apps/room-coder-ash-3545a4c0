import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";

const todoPatchSchema = todoInsertSchema
	.pick({ title: true, completed: true })
	.partial();

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				try {
					const body = parseDates(await request.json());
					const data = todoInsertSchema.parse(body);
					const txid = await db.transaction(async (tx) => {
						await tx.insert(todos).values(data);
						return generateTxId(tx);
					});
					return Response.json({ txid });
				} catch (err) {
					const message = err instanceof z.ZodError ? err.message : "Server error";
					return Response.json({ error: message }, { status: 400 });
				}
			},
			PATCH: async ({ request }: { request: Request }) => {
				try {
					const body = parseDates(await request.json());
					const { id } = body as { id: string };
					const changes = todoPatchSchema.parse(body);
					const txid = await db.transaction(async (tx) => {
						await tx
							.update(todos)
							.set({ ...changes, updated_at: new Date() })
							.where(eq(todos.id, id));
						return generateTxId(tx);
					});
					return Response.json({ txid });
				} catch (err) {
					const message = err instanceof z.ZodError ? err.message : "Server error";
					return Response.json({ error: message }, { status: 400 });
				}
			},
			DELETE: async ({ request }: { request: Request }) => {
				try {
					const body = await request.json();
					const { id } = body as { id: string };
					const txid = await db.transaction(async (tx) => {
						await tx.delete(todos).where(eq(todos.id, id));
						return generateTxId(tx);
					});
					return Response.json({ txid });
				} catch {
					return Response.json({ error: "Server error" }, { status: 500 });
				}
			},
		},
	},
});
