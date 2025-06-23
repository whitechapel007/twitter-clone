# Robust Error Handling System

A comprehensive, reusable error handling system that provides consistent, user-friendly error responses across all API endpoints.

## Files

- **`prisma-error-handler.ts`** - Core Prisma error handling with 15+ error code mappings
- **`api-error-handler.ts`** - Generic API error handler combining validation and database errors
- **`../utils/api-helpers.ts`** - High-level utilities for type-safe API handlers

## Usage

### Simple API Handler

```typescript
import { createApiHandler } from "~/lib/utils/api-helpers";

export default createApiHandler({
  schema: yourZodSchema,
  handler: async (input) => {
    return await yourBusinessLogic(input);
  },
});
```

### Manual Error Handling

```typescript
import { withFullErrorHandling } from "~/lib/errors/api-error-handler";

export default defineEventHandler(async (event) => {
  return withFullErrorHandling(async () => {
    // Your logic here
  });
});
```

## Error Response Format

```typescript
{
  statusCode: number;
  statusMessage: string;
  data?: {
    error: string;
    details?: string;
    code?: string;
    meta?: any;
  };
}
```

## Key Prisma Error Codes

- **P2031**: Database connection failed
- **P2002**: Unique constraint violation (409)
- **P2025**: Record not found (404)
- **P1001**: Database server unreachable

## Benefits

- Consistent error responses across your app
- User-friendly error messages
- Full TypeScript support
- Centralized error handling
- Easy to maintain and extend
