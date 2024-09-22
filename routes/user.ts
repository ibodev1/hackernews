import { Hono } from 'hono';
import { Paginate, Respond, ResponseObject } from '../types/index.ts';

import { getUser } from '../helpers/user.ts';
import { paginateParamsSchema, ZodError } from './schema.ts';
import { paginate } from '../helpers/utils.ts';
import { getItem } from '../helpers/item.ts';
import { Item, User } from '../types/types.ts';

const userRouter = new Hono();

userRouter.get('/:id', async (ctx) => {
  try {
    const id = ctx.req.param('id');
    if (typeof id === 'string' && id.trim() !== '') {
      const user = await getUser(id);
      if (user) {
        return ctx.json<User>(user);
      } else {
        return ctx.json<ResponseObject>({
          result: 'error',
          message: 'Not found',
        });
      }
    }

    return ctx.json<ResponseObject>({
      result: 'error',
      message: 'Not found',
    });
  } catch (error) {
    return ctx.json<ResponseObject>({
      result: 'error',
      message: error.toString(),
    });
  }
});

userRouter.get('/:id/submitted', async (ctx) => {
  try {
    const id = ctx.req.param('id');
    const { page, limit } = paginateParamsSchema.parse(ctx.req.query());

    if (typeof id === 'string' && id.trim() !== '') {
      const user = await getUser(id);
      if (user?.submitted && Array.isArray(user.submitted)) {
        const paginateValues = paginate<number>(
          user.submitted,
          parseInt(page),
          parseInt(limit),
        );

        const submittedArray: Item[] = (
          await Promise.all(
            paginateValues.data.map((storyId) => getItem(storyId.toString())),
          )
        ).filter((item): item is Item => Boolean(item));

        return ctx.json<Respond<Paginate<Item>>>({
          result: 'success',
          ...paginateValues,
          data: submittedArray,
        });
      }
    }

    return ctx.json<ResponseObject>({
      result: 'error',
      message: 'Not found',
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

export default userRouter;
