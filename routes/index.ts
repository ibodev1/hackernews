import { Hono } from 'hono';
import { paginateParamsSchema } from './schema.ts';
import { getItem, getItemWithComments, getStories } from '../helpers/item.ts';
import { paginate } from '../helpers/utils.ts';
import { Item, type ItemWithComments, StoryTypes } from '../types/types.ts';
import { Respond } from '../types/index.ts';
import { zValidator } from '@hono/zod-validator';
import { ZodError } from 'zod';

const indexRouter = new Hono();

indexRouter.get('/', zValidator('query', paginateParamsSchema), async (c) => {
  try {
    const queryPaginateValues = c.req.valid('query');

    const stories = await getStories(StoryTypes.Top);

    if (!stories) {
      return c.json<Respond>({
        result: 'error',
        message: 'No data.',
      });
    }

    const paginateValues = paginate(stories, queryPaginateValues);

    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return c.json<Respond>({
        result: 'error',
        message: 'No data.',
      });
    }

    const storyPromises = paginateValues.data.map((storyId) => getItemWithComments(String(storyId)));
    const storiesData = await Promise.all(storyPromises);
    const storyArray = storiesData.filter<ItemWithComments>((story): story is ItemWithComments => Boolean(story));

    return c.json<Respond>({
      result: 'success',
      paginate: paginateValues,
      data: storyArray,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json<Respond>({
        result: 'error',
        error,
        issues: error.issues,
      });
    }
    return c.json<Respond>({
      result: 'error',
      error,
      message: error?.message,
    });
  }
});

indexRouter.get('/:type', zValidator('query', paginateParamsSchema), async (c) => {
  try {
    const type = c.req.param('type') as StoryTypes ?? StoryTypes.Top;
    const queryPaginateValues = c.req.valid('query');

    const stories = await getStories(type);

    if (!stories) {
      return c.json<Respond>({
        result: 'error',
        message: 'No data.',
      });
    }

    const paginateValues = paginate<number>(stories, queryPaginateValues);
    if (!paginateValues || !Array.isArray(paginateValues.data)) {
      return c.json<Respond>({
        result: 'error',
        message: 'No data.',
      });
    }

    const storyPromises = paginateValues.data.map((storyId) => getItem(storyId.toString()));
    const storiesData = await Promise.all(storyPromises);
    const storyArray = storiesData.filter<Item>((story): story is Item => Boolean(story));

    return c.json<Respond>({
      result: 'success',
      paginate: paginateValues,
      data: storyArray,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json<Respond>({
        result: 'error',
        issues: error.issues,
      });
    }
    return c.json<Respond>({
      result: 'error',
      message: error?.message,
    });
  }
});

export default indexRouter;
