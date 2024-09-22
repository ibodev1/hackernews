import { Hono } from 'hono';
import { getItemWithComments } from '../helpers/item.ts';
import { ItemWithComments } from '../types/types.ts';
import { ResponseObject } from '../types/index.ts';

const itemRouter = new Hono();

itemRouter.get('/:id', async (ctx) => {
  try {
    const id = ctx.req.param('id');
    if (typeof id === 'string' && id !== '') {
      const item = await getItemWithComments(id);
      if (item) {
        return ctx.json<ItemWithComments>(item);
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

export default itemRouter;
