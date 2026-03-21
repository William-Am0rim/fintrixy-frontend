import z from "zod";

const schemas = z.object({
    date: z.string().min(1, "A data é obrigatória"),
    wallet: z.string().min(1, "Selecione uma carteira"),
    type: z.enum(["expense", "income", "transfer"]),
    category: z.string().min(1, "Selecione uma categoria"),
    description: z.string().min(1, "A descrição é obrigatória").max(100),
    value: z.string().min(1, "O valor é obrigatório"),
    paid: z.boolean(),
    color: z.string().optional()
})

type TypeSchemas = z.infer<typeof schemas>

export {schemas, type TypeSchemas}