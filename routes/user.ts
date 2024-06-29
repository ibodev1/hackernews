import { Hono } from '@hono/hono'
import {
  Item,
  Paginate,
  Respond,
  ResponseObject,
  Result,
  User,
} from '../types.ts'
import { getUser } from '../helpers/user.ts'
import { schema, ZodError } from './schema.ts'
import { paginate } from '../helpers/utils.ts'
import { getItem } from '../helpers/item.ts'

const userRouter = new Hono()

userRouter.get('/:id', async (ctx) => {
  try {
    const id = ctx.req.param('id')
    if (typeof id === 'string' && id !== '') {
      const user = await getUser(id)
      if (user) {
        return ctx.json<User>(user)
      } else {
        return ctx.json<ResponseObject>({
          result: Result.Warning,
          responseTime: Date.now(),
          message: 'Not found',
        })
      }
    }

    return ctx.json<ResponseObject>({
      result: Result.Warning,
      responseTime: Date.now(),
      message: 'Not found',
    })
  } catch (error) {
    return ctx.json<ResponseObject>({
      result: Result.Error,
      responseTime: Date.now(),
      message: error.toString(),
    })
  }
})

userRouter.get('/:id/submitted', async (ctx) => {
  try {
    const id = ctx.req.param('id')

    const query = ctx.req.query()
    const parsedQuery = schema.parse(query)

    const page = parseInt(parsedQuery.page)
    const limit = parseInt(parsedQuery.limit)

    if (typeof id === 'string' && id !== '') {
      const user = await getUser(id)
      if (user && Array.isArray(user.submitted)) {
        let submittedArray: Item[] = []
        const paginateValues = paginate<number>(user.submitted, page, limit),
          submittedAsyncArray: Promise<Item | null>[] = []
        if (paginateValues && Array.isArray(paginateValues.data)) {
          for (const storyId of paginateValues.data) {
            submittedAsyncArray.push(getItem(storyId.toString()))
          }
          submittedArray = (await Promise.all(submittedAsyncArray)).filter(
            (q) => q !== null,
          ) as Item[]
          return ctx.json<Respond<Paginate<Item[]>>>({
            result: Result.Success,
            responseTime: Date.now(),
            ...paginateValues,
            data: submittedArray,
          })
        }
      } else {
        return ctx.json<ResponseObject>({
          result: Result.Warning,
          responseTime: Date.now(),
          message: 'Not found',
        })
      }
    }

    return ctx.json<ResponseObject>({
      result: Result.Warning,
      responseTime: Date.now(),
      message: 'Not found',
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.json<ResponseObject>({
        result: Result.Error,
        responseTime: Date.now(),
        issues: error.issues,
      })
    }
    return ctx.json<ResponseObject>({
      result: Result.Error,
      responseTime: Date.now(),
      message: error.toString(),
    })
  }
})

export default userRouter
