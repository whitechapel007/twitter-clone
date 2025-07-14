# Deployment Guide

## Production Issues Identified

Based on the browser console errors, the following issues were identified and fixed:

### 1. Missing Environment Variables
**Issue**: Production server missing required environment variables
**Solution**: Set the following environment variables in your production environment:

```bash
DATABASE_URL="your-mongodb-connection-string"
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
```

### 2. Database Connection Issues
**Issue**: MongoDB connection errors causing 500 server errors
**Solution**: Ensure your MongoDB database is accessible and the connection string is correct

### 3. JWT Configuration
**Issue**: JWT token generation failing due to missing secrets
**Solution**: Generate secure secrets for production

## Quick Setup

### Local Development
```bash
# Create environment file with auto-generated secrets
node scripts/setup-env.js create

# Check environment variables
node scripts/setup-env.js check

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Production Deployment

#### 1. Environment Variables
Set these in your production environment (Vercel, Netlify, etc.):

```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/twitter-clone"
ACCESS_TOKEN_SECRET="your-64-character-random-string"
REFRESH_TOKEN_SECRET="your-64-character-random-string"
NODE_ENV="production"
```

#### 2. Generate Secrets
```bash
# Generate secure secrets
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. Database Setup
- Create a MongoDB database (MongoDB Atlas recommended for production)
- Ensure the database is accessible from your production environment
- Run `npx prisma db push` to create the schema

#### 4. Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Debug Endpoints

The application includes debug endpoints to help troubleshoot production issues:

- `GET /api/debug/info` - Check environment variables, database connection, and JWT functionality
- `POST /api/debug/test-registration` - Test registration endpoint with detailed error reporting

## Common Production Issues

### 1. 500 Internal Server Error
- Check environment variables are set correctly
- Verify database connection
- Check server logs for detailed error messages

### 2. Registration/Login Failures
- Ensure JWT secrets are configured
- Verify database schema is up to date
- Check network connectivity to database

### 3. Hydration Mismatches
- Clear browser cache
- Ensure consistent data between server and client
- Check for environment-specific code differences

## Monitoring

Monitor these endpoints for health checks:
- `GET /api/debug/info` - Overall system health
- `GET /api/auth/me` - Authentication system health

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Enable HTTPS in production
- Configure CORS appropriately
- Use secure cookie settings in production
