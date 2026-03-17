import z from "zod";

const schemas = z.object({
    name: z.string().min(2),
    type: z.string(),
    value_initial: z.number(),
    color: z.string()
})

type TypeSchemas = z.infer<typeof schemas>

export {schemas, type TypeSchemas}