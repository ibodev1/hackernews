import { Hono } from 'hono';
import { getItemWithComments } from '../helpers/item.ts';
import { ItemWithComments } from '../types/types.ts';
import type { Respond } from '../types/index.ts';

const itemRouter = new Hono();

itemRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    if (typeof id === 'string' && id.trim() !== '') {
      const item = await getItemWithComments(id);

      if (item) {
        return c.json<ItemWithComments>(item);
      }
    }

    return c.json<Respond>({
      result: 'error',
      message: 'Not found',
    });
  } catch (error: any) {
    return c.json<Respond>({
      result: 'error',
      error,
      message: error?.message,
    });
  }
});

export default itemRouter;
