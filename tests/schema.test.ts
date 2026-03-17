import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import {
	generateValidRow,
	generateRowWithout,
	parseDates,
} from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("fails when title is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("fails when id is missing", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("accepts date strings for timestamp fields (Electric round-trip)", () => {
		const row = generateValidRow(todoSelectSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoSelectSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
	})

	it("todoInsertSchema allows missing timestamps", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Buy milk",
			completed: false,
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("todoInsertSchema fails when title is missing", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})
})
