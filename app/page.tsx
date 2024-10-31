type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

import { getTodoFromCache, storeInCache, TTL } from "@/lib/utils";

export default async function Home(props: {
  searchParams: SearchParams
}) {
  const { id } = await props.searchParams;

  if (typeof id !== "string") {
    return <h1>Todo not found</h1>;
  }

  const currentTimeStamp = new Date().getTime();
  const cachedTodo = getTodoFromCache(id);

  let data = cachedTodo?.todo ? JSON.parse(cachedTodo.todo) : null;

  // if there is no data in cache or the data is expired
  if (!data || currentTimeStamp - cachedTodo!.timestamp > TTL) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/" + id);
    data = await res.json();
    storeInCache(id, data, currentTimeStamp);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">SQLite cache demo</h1>
        <p>{data.title}</p>
    </div>
  );
}
