import { z } from "zod";

const schemas = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type TypeSchemas = z.infer<typeof schemas>;

export { schemas, type TypeSchemas };