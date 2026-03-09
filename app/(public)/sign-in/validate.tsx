import { z } from "zod";

const schemas = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type TypeSchemas = z.infer<typeof schemas>;

export { schemas, type TypeSchemas };