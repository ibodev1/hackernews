import { Hono } from 'hono';
import { Respond } from '../types/index.ts';
import { getUser } from '../helpers/user.ts';
import { paginateParamsSchema } from './schema.ts';
import { paginate } from '../helpers/utils.ts';
import { getItem } from '../helpers/item.ts';
import { Item, User } from '../types/types.ts';
import { zValidator } from '@hono/zod-validator';
import { ZodError } from 'zod';

const userRouter = new Hono();

userRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    if (typeof id === 'string' && id.trim() !== '') {
      const user = await getUser(id);

      if (user) {
        return c.json<User>(user);
      }
    }

    return c.json<Respond>({
      result: 'error',
      message: 'Not found',
    });
  } catch (error: any) {
    return c.json<Respond>({
      result: 'error',
      message: error?.message,
    });
  }
});

userRouter.get('/:id/submitted', zValidator('query', paginateParamsSchema), async (c) => {
  try {
    const id = c.req.param('id');

    const queryPaginateValues = c.req.valid('query');

    if (typeof id === 'string' && id.trim() !== '') {
      const user = await getUser(id);

      if (user?.submitted && Array.isArray(user.submitted)) {
        const paginateValues = paginate<number>(user.submitted, queryPaginateValues);

        const submittedArray: Item[] = (
          await Promise.all(
            paginateValues.data.map((storyId) => getItem(storyId.toString())),
          )
        ).filter((item): item is Item => Boolean(item));

        return c.json<Respond>({
          result: 'success',
          paginate: paginateValues,
          data: submittedArray,
        });
      }
    }

    return c.json<Respond>({
      result: 'error',
      message: 'Not found',
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

export default userRouter;
