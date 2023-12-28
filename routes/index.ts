import { Hono } from 'hono'
import { schema, ZodError } from './schema.ts'
import { getItem, getStories } from '../helpers/item.ts'
import { paginate } from '../helpers/utils.ts'
import {
  Item,
  Paginate,
  Respond,
  ResponseObject,
  Result,
  StoryTypes,
} from '../types.ts'

const indexRouter = new Hono()

indexRouter.get('/', async (ctx) => {
  try {
    const query = ctx.req.query()
    const parsedQuery = schema.parse(query)

    const page = parseInt(parsedQuery.page)
    const limit = parseInt(parsedQuery.limit)

    const stories = await getStories(StoryTypes.Top)

    const paginateValues = paginate<number>(stories, page, limit)

    let storyArray: Item[] = []
    const storyAsyncArray: Promise<Item | null>[] = []

    if (stories && paginateValues && Array.isArray(paginateValues.data)) {
      for (const storyId of paginateValues.data) {
        storyAsyncArray.push(getItem(storyId.toString()))
      }
      storyArray = (await Promise.all(storyAsyncArray)).filter((q) =>
        q !== null
      ) as Item[]
      return ctx.json<Respond<Paginate<Item[]>>>({
        result: Result.Success,
        responseTime: Date.now(),
        ...paginateValues,
        data: storyArray,
      })
    }

    return ctx.json<ResponseObject>({
      result: Result.Warning,
      responseTime: Date.now(),
      message: 'No data.',
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

indexRouter.get('/:type', async (ctx) => {
  try {
    const type = ctx.req.param('type') as StoryTypes || StoryTypes.Top

    const query = ctx.req.query()
    const parsedQuery = schema.parse(query)

    const page = parseInt(parsedQuery.page)
    const limit = parseInt(parsedQuery.limit)

    const stories = await getStories(type)

    const paginateValues = paginate<number>(stories, page, limit)

    let storyArray: Item[] = []
    const storyAsyncArray: Promise<Item | null>[] = []

    if (stories && paginateValues && Array.isArray(paginateValues.data)) {
      for (const storyId of paginateValues.data) {
        storyAsyncArray.push(getItem(storyId.toString()))
      }
      storyArray = (await Promise.all(storyAsyncArray)).filter((q) =>
        q !== null
      ) as Item[]
      return ctx.json<Respond<Paginate<Item[]>>>({
        result: Result.Success,
        responseTime: Date.now(),
        ...paginateValues,
        data: storyArray,
      })
    }

    return ctx.json<ResponseObject>({
      result: Result.Warning,
      responseTime: Date.now(),
      message: 'No data.',
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

export default indexRouter
