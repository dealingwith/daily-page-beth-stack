import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
// import { db } from "./db";
// import { Todo, todos } from "./db/schema";
// import { eq } from "drizzle-orm";

type Todo = {
  id: number;
  content: string;
  completed: boolean;
}

const todos: Todo[] = [
  {
    content: "Todo 1", 
    completed: false, 
    id: 1
  },
  {
    content: "Todo 2", 
    completed: true, 
    id: 2
  },
];

const habits: Todo[] = [
  {
    content: "Habit 1", 
    completed: false, 
    id: 1
  },
  {
    content: "Habit 2", 
    completed: true, 
    id: 2
  },
];

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          hx-get="/page"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  )
  .get("/todos", async () => {
    return <TodoList todos={todos} />;
  })
  .get("/habits", async () => {
    return <TodoList todos={habits} />;
  })
  .get("/page", async () =>{
    // const Filler: (string)[] = ["This", "That"];
    const Today: (Date) = new Date();
    return (
      <div class="min-h-screen flex flex-col m-2 space-y-2">
        <header class="bg-red-50 p-3 rounded border-2">Date: {Today.toLocaleDateString()}</header>
        <header class="bg-blue-50 p-3 rounded border-2">Today's Focus:</header>
        <div class="flex-1 flex flex-col sm:flex-row space-x-2">
          <div 
            class="flex-1 rounded border-2 p-2"
            hx-get="/todos"
            hx-swap="outerHTML"
            hx-trigger="load"
          />
          <div 
            class="flex-1 rounded border-2 p-2"
            hx-get="/habits"
            hx-swap="outerHTML"
            hx-trigger="load"
          />
        </div>
      </div>
    );
  })
  // .post(
  //   "/todos/toggle/:id",
  //   async ({ params }) => {
  //     const oldTodo = await db
  //       .select()
  //       .from(todos)
  //       .where(eq(todos.id, params.id))
  //       .get();
  //     const newTodo = await db
  //       .update(todos)
  //       .set({ completed: !oldTodo.completed })
  //       .where(eq(todos.id, params.id))
  //       .returning()
  //       .get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .delete(
  //   "/todos/:id",
  //   async ({ params }) => {
  //     await db.delete(todos).where(eq(todos.id, params.id)).run();
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //   }
  // )
  // .post(
  //   "/todos",
  //   async ({ body }) => {
  //     const newTodo = await db.insert(todos).values(body).returning().get();
  //     return <TodoItem {...newTodo} />;
  //   },
  //   {
  //     body: t.Object({
  //       content: t.String({ minLength: 1 }),
  //     }),
  //   }
  // )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{id}: {content}</p>
      <input
        type="checkbox"
        checked={completed}
        // hx-post={`/todos/toggle/${id}`}
        // hx-swap="outerHTML"
        // hx-target="closest div"
      />
      {/* <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button> */}
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div class="flex-1 rounded border-2 p-2">
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      {/* <TodoForm /> */}
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      // hx-post="/todos"
      // hx-swap="beforebegin"
      // _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}

// function Page({ content }: { content: String }) {
//   return (
//     <div class="flex-1 rounded border-2 p-2">{content} Screen</div>
//   )
// }
