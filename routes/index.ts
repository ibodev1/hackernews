import { Hono } from 'hono';
import { paginateParamsSchema, ZodError } from './schema.ts';
import { getItem, getStories } from '../helpers/item.ts';
import { paginate } from '../helpers/utils.ts';
import { Item, StoryTypes } from '../types/types.ts';
import { Paginate, Respond, ResponseObject } from '../types/index.ts';

const indexRouter = new Hono();

indexRouter.get('/', async (ctx) => {
  try {
    const query = ctx.req.query();
    const parsedQuery = paginateParamsSchema.parse(query);
    const page = parseInt(parsedQuery.page);
    const limit = parseInt(parsedQuery.limit);
    const stories = await getStories(StoryTypes.Top);

    if (!stories) {
      return ctx.json<ResponseObject>({
        result: 'error',
        message: 'No data.',
      });
    }

    const paginateValues = paginate<number>(stories, page, limit);
    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return ctx.json<ResponseObject>({
        result: 'error',
        message: 'No data.',
      });
    }

    let storyArray: Item[] = [];

    if (Array.isArray(paginateValues.data)) {
      const storyPromises = paginateValues.data.map((storyId) => getItem(storyId.toString()));
      const stories = await Promise.all(storyPromises);
      storyArray = stories.filter<Item>((story): story is Item => Boolean(story));
    }

    return ctx.json<Respond<Paginate<Item>>>({
      result: 'success',
      ...paginateValues,
      data: storyArray,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.json<ResponseObject>({
        result: 'error',
        issues: error.issues,
      });
    }
    return ctx.json<ResponseObject>({
      result: 'error',
      message: error.toString(),
    });
  }
});

indexRouter.get('/:type', async (ctx) => {
  try {
    const type = ctx.req.param('type') as StoryTypes ?? StoryTypes.Top;
    const query = ctx.req.query();
    const parsedQuery = paginateParamsSchema.parse(query);
    const page = parseInt(parsedQuery.page);
    const limit = parseInt(parsedQuery.limit);
    const stories = await getStories(type);

    if (!stories) {
      return ctx.json<ResponseObject>({
        result: 'error',
        message: 'No data.',
      });
    }

    const paginateValues = paginate<number>(stories, page, limit);
    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return ctx.json<ResponseObject>({
        result: 'error',
        message: 'No data.',
      });
    }

    let storyArray: Item[] = [];

    if (Array.isArray(paginateValues.data)) {
      const storyPromises = paginateValues.data.map((storyId) => getItem(storyId.toString()));
      const stories = await Promise.all(storyPromises);
      storyArray = stories.filter<Item>((story): story is Item => Boolean(story));
    }

    return ctx.json<Respond<Paginate<Item>>>({
      result: 'success',
      ...paginateValues,
      data: storyArray,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.json<ResponseObject>({
        result: 'error',
        issues: error.issues,
      });
    }
    return ctx.json<ResponseObject>({
      result: 'error',
      message: error.toString(),
    });
  }
});

export default indexRouter;
