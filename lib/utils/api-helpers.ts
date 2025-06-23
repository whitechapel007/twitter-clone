import type { z } from "zod";
import {
  defineEventHandler,
  readBody,
  getQuery,
  type EventHandlerRequest,
  type H3Event,
} from "h3";
import { withFullErrorHandling } from "../errors/api-error-handler";

/**
 * Creates a type-safe API handler with automatic error handling and validation
 */
export function createApiHandler<TInput, TOutput>(config: {
  schema?: z.ZodSchema<TInput>;
  handler: (
    input: TInput,
    event: H3Event<EventHandlerRequest>
  ) => Promise<TOutput>;
}) {
  return defineEventHandler(async (event) => {
    return withFullErrorHandling(async () => {
      let input: TInput;

      if (config.schema) {
        const body = await readBody(event);
        input = config.schema.parse(body);
      } else {
        input = {} as TInput;
      }

      return await config.handler(input, event);
    });
  });
}

/**
 * Creates a GET API handler with query parameter validation
 */
export function createGetApiHandler<TQuery, TOutput>(config: {
  querySchema?: z.ZodSchema<TQuery>;
  handler: (
    query: TQuery,
    event: H3Event<EventHandlerRequest>
  ) => Promise<TOutput>;
}) {
  return defineEventHandler(async (event) => {
    return withFullErrorHandling(async () => {
      let query: TQuery;

      if (config.querySchema) {
        const queryParams = getQuery(event);
        query = config.querySchema.parse(queryParams);
      } else {
        query = {} as TQuery;
      }

      return await config.handler(query, event);
    });
  });
}
