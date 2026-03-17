import { createCollection } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { todoSelectSchema } from "@/db/zod-schemas";

const BASE_URL =
	typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:8080";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		shapeOptions: {
			url: `${BASE_URL}/api/todos`,
		},
		getKey: (todo) => todo.id,
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			if (!response.ok) throw new Error(`Insert failed: ${response.status}`);
			const result = await response.json();
			return { txid: result.txid };
		},
		onUpdate: async ({ transaction }) => {
			const { original, changes } = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: original.id, ...changes }),
			});
			if (!response.ok) throw new Error(`Update failed: ${response.status}`);
			const result = await response.json();
			return { txid: result.txid };
		},
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: original.id }),
			});
			if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
			const result = await response.json();
			return { txid: result.txid };
		},
	}),
);
