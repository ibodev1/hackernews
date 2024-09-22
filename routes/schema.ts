import { z, ZodError } from 'zod';

const paginateParamsSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('30'),
});

export { paginateParamsSchema, ZodError };
