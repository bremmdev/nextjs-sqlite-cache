import db from "@/lib/db";

//30 seconds time to live
export const TTL = 30000;

export type CachedTodo =
  | {
      id: number;
      todoId: number;
      todo: string;
      timestamp: number;
    }
  | undefined;

export function getTodoFromCache(todoId: string): CachedTodo {
  const cachedTodo = db
    .prepare("SELECT * FROM todos WHERE todoId = ?")
    .get(+todoId) as CachedTodo;
  return cachedTodo;
}

//upsert will insert if the row if the todoId does not exist, otherwise it will update the existing row with new data and timestamp
export function storeInCache(todoId: string, data: any, timestamp: number) {
  db.prepare(
    `
    INSERT INTO todos (todoId, todo, timestamp)
    VALUES (?, ?, ?)
    ON CONFLICT(todoId) DO UPDATE SET
      todo = excluded.todo,
      timestamp = excluded.timestamp
  `
  ).run(+todoId, JSON.stringify(data), timestamp);
}
