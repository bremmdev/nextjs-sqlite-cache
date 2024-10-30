import db from "@/lib/db";

//30 seconds time to live
export const TTL = 30000;

export type CachedTodo =
  | {
      id: number;
      todo: string;
      timestamp: number;
    }
  | undefined;

export function getTodoFromCache(id: string): CachedTodo {
  const cachedTodo = db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(+id) as CachedTodo;
  return cachedTodo;
}

//upsert will insert if the id does not exist, otherwise it will update the existing row
export function storeInCache(id: string, data: any, timestamp: number) {
  db.prepare(
    `
    INSERT INTO todos (id, todo, timestamp)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      todo = excluded.todo,
      timestamp = excluded.timestamp
  `
  ).run(id, JSON.stringify(data), timestamp);
}
