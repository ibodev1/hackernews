import { Hono } from "https://deno.land/x/hono@v3.7.2/mod.ts";
import {
  cors,
  logger,
  prettyJSON,
  secureHeaders,
} from "https://deno.land/x/hono@v3.7.2/middleware.ts";
import {
  ResponseObject,
  Result
} from "./types.ts";
import indexRouter from "./routes/index.ts";
import itemRouter from "./routes/item.ts";
import userRouter from "./routes/user.ts";

const app = new Hono();

// Middlewares
app.use("*", logger(), cors(), prettyJSON(), secureHeaders());

// X-Response-Time
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  c.res.headers.set("X-Response-Time", `${end - start}`);
});

// Routes
app.route("/", indexRouter);
app.route("/item", itemRouter);
app.route("/user", userRouter);

app.notFound((ctx) => {
  return ctx.json<ResponseObject>({
    result: Result.Warning,
    responseTime: Date.now(),
    message: "404 Not Found",
  });
});

app.onError((error, ctx) => {
  return ctx.json<ResponseObject>({
    result: Result.Error,
    responseTime: Date.now(),
    message: error.message,
  });
});

Deno.serve({
  port: parseInt(Deno.env.get("PORT") || "8000"),
  onListen: ({ hostname, port }) => {
    console.info(`Listening on http://${hostname}:${port}`);
  },
}, app.fetch);
