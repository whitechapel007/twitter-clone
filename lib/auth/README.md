# JWT Authentication System

A complete JWT-based authentication system with access and refresh tokens for your Twitter clone application.

## Features

- ✅ **Access Tokens** (15 minutes) - Short-lived for API requests
- ✅ **Refresh Tokens** (7 days) - Long-lived for token renewal
- ✅ **Secure JWT Implementation** - Industry-standard security
- ✅ **Protected Routes** - Middleware for authentication
- ✅ **Token Refresh** - Automatic token renewal
- ✅ **Error Handling** - Comprehensive error responses

## API Endpoints

### 1. **Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user_id",
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImage": "https://example.com/default-avatar.png",
  "createdAt": "2025-06-22T18:08:29.399Z",
  "updatedAt": "2025-06-22T18:08:29.399Z"
}
```

### 2. **Login User**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://example.com/default-avatar.png",
    "createdAt": "2025-06-22T18:08:29.399Z",
    "updatedAt": "2025-06-22T18:08:29.399Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. **Refresh Tokens**
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Tokens refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. **Get Current User** (Protected)
```bash
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://example.com/default-avatar.png",
    "createdAt": "2025-06-22T18:08:29.399Z",
    "updatedAt": "2025-06-22T18:08:29.399Z"
  },
  "tokenInfo": {
    "userId": "user_id",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

### 5. **Logout** (Protected)
```bash
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out successfully",
  "userId": "user_id",
  "timestamp": "2025-06-22T18:08:29.399Z"
}
```

## Usage in Your Application

### Creating Protected Routes
```typescript
import { createApiHandler } from "~/lib/utils/api-helpers";
import { withAuth } from "~/lib/auth/middleware";

export default createApiHandler({
  handler: withAuth(async (input, event, user) => {
    // user contains: { userId, email, username }
    return { message: `Hello ${user.username}!` };
  }),
});
```

### Optional Authentication
```typescript
import { withOptionalAuth } from "~/lib/auth/middleware";

export default createApiHandler({
  handler: withOptionalAuth(async (input, event, user) => {
    if (user) {
      return { message: `Hello ${user.username}!` };
    } else {
      return { message: "Hello guest!" };
    }
  }),
});
```

## Token Configuration

- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Issuer**: "twitter-clone"
- **Audience**: "twitter-clone-users"

## Security Features

- ✅ Secure JWT secrets (stored in environment variables)
- ✅ Token expiry validation
- ✅ Issuer and audience validation
- ✅ Proper error handling for expired/invalid tokens
- ✅ Password hashing with bcrypt

## Environment Variables

Make sure these are set in your `.env` file:
```env
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

## Error Responses

All authentication errors follow a consistent format:
```json
{
  "statusCode": 401,
  "statusMessage": "Access token expired",
  "data": {
    "error": "TOKEN_EXPIRED"
  }
}
```

Common error codes:
- `NO_TOKEN` - No authorization header provided
- `TOKEN_EXPIRED` - Access token has expired
- `INVALID_TOKEN` - Token is malformed or invalid
- `REFRESH_TOKEN_EXPIRED` - Refresh token has expired
- `USER_NOT_FOUND` - User associated with token doesn't exist
