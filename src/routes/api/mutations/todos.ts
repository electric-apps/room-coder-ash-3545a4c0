import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());
				const data = todoInsertSchema.parse(body);
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values(data);
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			PATCH: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());
				const { id, ...changes } = body as {
					id: string;
					[key: string]: unknown;
				};
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({ ...changes, updated_at: new Date() })
						.where(eq(todos.id, id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
			DELETE: async ({ request }: { request: Request }) => {
				const body = await request.json();
				const { id } = body as { id: string };
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
