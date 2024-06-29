import { Hono } from '@hono/hono'
import { Item, ResponseObject, Result } from '../types.ts'
import { getItemWithComments } from '../helpers/item.ts'

const itemRouter = new Hono()

itemRouter.get('/:id', async (ctx) => {
  try {
    const id = ctx.req.param('id')
    if (typeof id === 'string' && id !== '') {
      const item = await getItemWithComments(id)
      if (item) {
        return ctx.json<Item>(item)
      } else {
        return ctx.json<ResponseObject>({
          result: Result.Warning,
          message: 'Not found',
        })
      }
    }

    return ctx.json<ResponseObject>({
      result: Result.Warning,
      message: 'Not found',
    })
  } catch (error) {
    return ctx.json<ResponseObject>({
      result: Result.Error,
      message: error.toString(),
    })
  }
})

export default itemRouter
