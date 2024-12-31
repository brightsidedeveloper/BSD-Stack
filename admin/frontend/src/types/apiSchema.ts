import { z } from 'zod'

// Define generic schemas for OpenAPI components
const SchemaObject = z.object({
  type: z.string(),
  properties: z.record(
    z.object({
      type: z.string(),
      example: z.any().optional(),
    })
  ),
  required: z.array(z.string()).optional(),
})

const RequestBodySchema = z.object({
  description: z.string().optional(),
  required: z.boolean().optional(),
  content: z.record(
    z.object({
      schema: z.object({
        $ref: z.string(),
      }),
    })
  ),
})

const ResponseSchema = z.object({
  description: z.string(),
  content: z.record(
    z.object({
      schema: z.object({
        $ref: z.string(),
      }),
    })
  ),
})

const MethodSchema = z.object({
  summary: z.string(),
  operationId: z.string(),
  security: z.array(z.any()).optional(),
  requestBody: RequestBodySchema.optional(),
  responses: z.record(ResponseSchema),
})

const PathsSchema = z.record(
  z.object({
    get: MethodSchema.optional(),
    post: MethodSchema.optional(),
    put: MethodSchema.optional(),
    patch: MethodSchema.optional(),
    delete: MethodSchema.optional(),
  })
)

const ComponentsSchema = z.object({
  schemas: z.record(SchemaObject),
})

const OpenAPISchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
    version: z.string(),
  }),
  paths: PathsSchema,
  components: ComponentsSchema.optional(),
})

export type OpenAPISchemaType = z.infer<typeof OpenAPISchema>

const CheatAny = z.any()

export type CheatAny = z.infer<typeof CheatAny>

export default OpenAPISchema
