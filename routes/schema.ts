import { z, ZodError } from "https://deno.land/x/zod@v3.22.2/mod.ts";

const schema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("30"),
});

export { schema, ZodError };
