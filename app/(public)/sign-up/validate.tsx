import { z } from "zod";

const schemas = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type TypeSchemas = z.infer<typeof schemas>;

export { schemas, type TypeSchemas };