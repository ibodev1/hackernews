import { Hono } from '@hono/hono'
import { cors } from '@hono/hono/cors'
import { logger } from '@hono/hono/logger'
import { prettyJSON } from '@hono/hono/pretty-json'
import { secureHeaders } from '@hono/hono/secure-headers'
import { ResponseObject, Result } from './types.ts'
import indexRouter from './routes/index.ts'
import itemRouter from './routes/item.ts'
import userRouter from './routes/user.ts'

const app = new Hono()

// Middlewares
app.use('*', logger(), cors(), prettyJSON(), secureHeaders())

// X-Response-Time
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})

// Routes
app.route('/', indexRouter)
app.route('/item', itemRouter)
app.route('/user', userRouter)

app.notFound((ctx) => {
  return ctx.json<ResponseObject>({
    result: Result.Warning,
    message: '404 Not Found',
  })
})

app.onError((error, ctx) => {
  return ctx.json<ResponseObject>({
    result: Result.Error,
    message: error.message,
  })
})

Deno.serve({
  port: parseInt(Deno.env.get('PORT') || '8000'),
  onListen: ({ hostname, port }) => {
    console.info(`Listening on http://${hostname}:${port}`)
  },
}, app.fetch)
