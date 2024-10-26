import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import indexRouter from './routes/index.ts';
import itemRouter from './routes/item.ts';
import userRouter from './routes/user.ts';
import { Respond } from './types/index.ts';

const app = new Hono();

// Middlewares
app.use('*', logger(), cors(), prettyJSON(), secureHeaders());

// Routes
app.route('/', indexRouter);
app.route('/item', itemRouter);
app.route('/user', userRouter);

app.notFound((c) => {
  return c.json<Respond>({
    result: 'error',
    message: '404 Not Found',
  });
});

app.onError((error, c) => {
  return c.json<Respond>({
    result: 'error',
    message: error.message,
  });
});

const PORT = Number.parseInt(Deno.env.get('PORT') || '8000');

Deno.serve({
  port: PORT,
  onListen: ({ hostname, port }) => {
    console.info(`Listening on http://${hostname}:${port}`);
  },
}, app.fetch);
