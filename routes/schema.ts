import { z, ZodError } from 'zod'

const schema = z.object({
  page: z.string().default('1'),
  limit: z.string().default('30'),
})

export { schema, ZodError }
