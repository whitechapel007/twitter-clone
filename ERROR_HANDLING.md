# Comprehensive Error Handling System

## Overview

This application implements a robust, multi-layered error handling system that provides consistent, user-friendly error responses across all API endpoints and frontend interactions.

## Backend Error Handling

### 1. Prisma Error Handler (`lib/errors/prisma-error-handler.ts`)

Handles database-specific errors with 15+ error code mappings:

- **Connection Errors**: P1000, P1001, P1002 (authentication, unreachable server, timeout)
- **Constraint Violations**: P2002 (unique constraint), P2003 (foreign key), P2025 (record not found)
- **Schema Errors**: P2021 (table not exists), P2022 (column not exists)
- **Data Conversion**: P2023 (inconsistent column data)

**Example Usage:**
```typescript
try {
  await prisma.user.create({ data: userData });
} catch (error) {
  throw handlePrismaError(error);
}
```

### 2. API Error Handler (`lib/errors/api-error-handler.ts`)

Combines validation and database error handling:

- **Validation Errors**: Zod schema validation with detailed field-level errors
- **Database Errors**: Automatic Prisma error conversion
- **Generic Errors**: Fallback handling for unexpected errors

**Example Usage:**
```typescript
export default createApiHandler({
  schema: userSchema,
  handler: async (input) => {
    return await withFullErrorHandling(async () => {
      // Your business logic here
    });
  },
});
```

### 3. API Helpers (`lib/utils/api-helpers.ts`)

Type-safe API handlers with automatic error handling:

```typescript
export default createApiHandler({
  schema: registerUserSchema,
  handler: async (input, event) => {
    // Automatic validation and error handling
    return await createUser(input, event);
  },
});
```

## Frontend Error Handling

### Enhanced Error Interface

```typescript
interface ApiError {
  statusCode?: number;
  statusMessage?: string;
  name?: string;
  message?: string;
  data?: {
    message?: string;
    error?: string;
    details?: string;
    validationErrors?: Array<{
      message: string;
      path: string[];
    }>;
    code?: string;
    meta?: Record<string, unknown>;
  };
}
```

### Registration Error Handling

The frontend registration function now handles:

1. **Structured API Errors**: Errors with detailed data from backend
2. **Validation Errors**: Field-level validation with user-friendly messages
3. **Network Errors**: Connection and timeout issues
4. **Fallback Errors**: Unexpected error scenarios

**Example Implementation:**
```typescript
try {
  const response = await $fetch('/api/auth/register', {
    method: 'POST',
    body: userData
  });
} catch (error: unknown) {
  // Comprehensive error handling
  if (error && typeof error === "object") {
    const apiError = error as ApiError;
    
    // Handle Prisma errors with detailed information
    if (apiError.data?.error && apiError.data?.details) {
      throw createError({
        statusCode: apiError.statusCode || 400,
        statusMessage: apiError.data.details || "Registration failed",
      });
    }
    
    // Handle validation errors
    if (apiError.data?.validationErrors) {
      const validationMessage = apiError.data.validationErrors
        .map((err) => err.message)
        .join(", ");
      throw createError({
        statusCode: 400,
        statusMessage: `Validation error: ${validationMessage}`,
      });
    }
    
    // Handle network errors
    if (apiError.name === "TypeError" || 
        (apiError.message && apiError.message.includes("fetch"))) {
      throw createError({
        statusCode: 500,
        statusMessage: "Network error. Please check your connection.",
      });
    }
  }
}
```

## Error Response Structure

### Backend Error Response Format

```json
{
  "statusCode": 400,
  "statusMessage": "Validation error",
  "data": {
    "error": "Invalid input",
    "details": "The provided data is invalid",
    "validationErrors": [
      {
        "message": "String must contain at least 3 character(s)",
        "path": ["username"]
      }
    ]
  }
}
```

### Common Error Scenarios

1. **Duplicate Email (409)**:
   ```json
   {
     "statusCode": 409,
     "statusMessage": "User already exists with this email"
   }
   ```

2. **Validation Error (400)**:
   ```json
   {
     "statusCode": 400,
     "statusMessage": "Validation error",
     "data": {
       "validationErrors": [...]
     }
   }
   ```

3. **Database Connection Error (503)**:
   ```json
   {
     "statusCode": 503,
     "statusMessage": "Database connection error",
     "data": {
       "error": "Database unavailable",
       "details": "Cannot reach database server"
     }
   }
   ```

## Debug Endpoints

### Health Check (`/api/debug/info`)

Returns system status:
- Environment variables
- Database connection
- JWT functionality
- Server information

### Registration Test (`/api/debug/test-registration`)

Tests registration endpoint with detailed error reporting.

## Production Deployment

### Environment Variables Required

```bash
DATABASE_URL="mongodb://..."
ACCESS_TOKEN_SECRET="64-char-secret"
REFRESH_TOKEN_SECRET="64-char-secret"
NODE_ENV="production"
```

### Startup Script

Use `scripts/start-production.js` to properly load environment variables:

```bash
node scripts/start-production.js
```

### Database Maintenance

Run database cleanup if needed:

```bash
node scripts/cleanup-database.js
```

## Benefits

1. **Consistent Error Responses**: All errors follow the same structure
2. **User-Friendly Messages**: Technical errors are converted to readable messages
3. **Detailed Logging**: Server logs contain full error details for debugging
4. **Type Safety**: TypeScript interfaces ensure proper error handling
5. **Automatic Handling**: Minimal boilerplate code required
6. **Production Ready**: Robust error handling for production environments

## Testing Error Handling

The system has been tested with:
- ✅ Duplicate email registration
- ✅ Invalid validation data
- ✅ Database connection issues
- ✅ JWT configuration errors
- ✅ Network timeouts
- ✅ Malformed requests

All error scenarios are properly handled and return appropriate user-friendly messages.
