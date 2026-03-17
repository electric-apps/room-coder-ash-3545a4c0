import {
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	SegmentedControl,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	component: TodoApp,
});

type Filter = "all" | "active" | "completed";

function TodoApp() {
	const [newTitle, setNewTitle] = useState("");
	const [filter, setFilter] = useState<Filter>("all");

	const { data: todos = [], isLoading } = useLiveQuery(
		(q) => q.from({ todos: todosCollection }),
		[],
	);

	const filteredTodos = todos.filter((todo: Todo) => {
		if (filter === "active") return !todo.completed;
		if (filter === "completed") return todo.completed;
		return true;
	});

	const activeCount = todos.filter((t: Todo) => !t.completed).length;

	const addTodo = () => {
		const title = newTitle.trim();
		if (!title) return;
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setNewTitle("");
	};

	const toggleTodo = (todo: Todo) => {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updated_at = new Date();
		});
	};

	const deleteTodo = (id: string) => {
		todosCollection.delete(id);
	};

	return (
		<Container size="2" py="8">
			<Flex direction="column" gap="6">
				<Flex direction="column" gap="1" align="center">
					<Heading size="8">Todo</Heading>
					<Text size="2" color="gray">
						{activeCount} item{activeCount !== 1 ? "s" : ""} left
					</Text>
				</Flex>

				<Card>
					<Flex gap="2">
						<TextField.Root
							placeholder="What needs to be done?"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && addTodo()}
							style={{ flex: 1 }}
							size="3"
						/>
						<Button size="3" onClick={addTodo} disabled={!newTitle.trim()}>
							<Plus size={16} />
							Add
						</Button>
					</Flex>
				</Card>

				<Flex direction="column" gap="3">
					<SegmentedControl.Root
						value={filter}
						onValueChange={(v) => setFilter(v as Filter)}
						size="2"
					>
						<SegmentedControl.Item value="all">All</SegmentedControl.Item>
						<SegmentedControl.Item value="active">Active</SegmentedControl.Item>
						<SegmentedControl.Item value="completed">
							Completed
						</SegmentedControl.Item>
					</SegmentedControl.Root>

					{isLoading ? (
						<Text color="gray" size="2" align="center">
							Loading…
						</Text>
					) : filteredTodos.length === 0 ? (
						<Text color="gray" size="2" align="center">
							{filter === "completed"
								? "No completed todos yet"
								: filter === "active"
									? "All done!"
									: "No todos yet — add one above"}
						</Text>
					) : (
						<Flex direction="column" gap="2">
							{filteredTodos.map((todo: Todo) => (
								<Card key={todo.id}>
									<Flex align="center" gap="3">
										<Checkbox
											size="2"
											checked={todo.completed}
											onCheckedChange={() => toggleTodo(todo)}
										/>
										<Box style={{ flex: 1 }}>
											<Text
												size="3"
												style={{
													textDecoration: todo.completed
														? "line-through"
														: "none",
													opacity: todo.completed ? 0.5 : 1,
												}}
											>
												{todo.title}
											</Text>
										</Box>
										<IconButton
											size="2"
											variant="ghost"
											color="red"
											onClick={() => deleteTodo(todo.id)}
										>
											<Trash2 size={14} />
										</IconButton>
									</Flex>
								</Card>
							))}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Container>
	);
}
