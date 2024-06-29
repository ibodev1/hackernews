import { Hono } from '@hono/hono'
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

    if (!stories) {
      return ctx.json<ResponseObject>({
        result: Result.Warning,
        message: 'No data.',
      })
    }

    const paginateValues = paginate<number>(stories, page, limit)
    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return ctx.json<ResponseObject>({
        result: Result.Warning,
        message: 'No data.',
      })
    }

    const storyArray = (await Promise.all(paginateValues.data.map((storyId) =>
      getItem(storyId.toString())
    )))
      .filter((item): item is Item =>
        item !== null
      )

    return ctx.json<Respond<Paginate<Item[]>>>({
      result: Result.Success,
      ...paginateValues,
      data: storyArray,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.json<ResponseObject>({
        result: Result.Error,
        issues: error.issues,
      })
    }
    return ctx.json<ResponseObject>({
      result: Result.Error,
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

    if (!stories) {
      return ctx.json<ResponseObject>({
        result: Result.Warning,
        message: 'No data.',
      })
    }

    const paginateValues = paginate<number>(stories, page, limit)
    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return ctx.json<ResponseObject>({
        result: Result.Warning,
        message: 'No data.',
      })
    }

    const storyArray = (await Promise.all(paginateValues.data.map((storyId) =>
      getItem(storyId.toString())
    )))
      .filter((item): item is Item =>
        item !== null
      )

    return ctx.json<Respond<Paginate<Item[]>>>({
      result: Result.Success,
      ...paginateValues,
      data: storyArray,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.json<ResponseObject>({
        result: Result.Error,
        issues: error.issues,
      })
    }
    return ctx.json<ResponseObject>({
      result: Result.Error,
      message: error.toString(),
    })
  }
})

export default indexRouter
