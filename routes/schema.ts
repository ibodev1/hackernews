import { z } from 'zod';

export const paginateParamsSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('30'),
}).optional();

export type PaginateValues = z.infer<typeof paginateParamsSchema>;
