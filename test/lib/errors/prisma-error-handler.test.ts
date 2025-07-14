import { describe, it, expect, vi } from 'vitest'
import { Prisma } from '@prisma/client'
import { handlePrismaError, withDatabaseErrorHandling, isPrismaError, getPrismaErrorMessage } from '~/lib/errors/prisma-error-handler'

// Mock h3's createError function
vi.mock('h3', () => ({
  createError: vi.fn((error) => error),
}))

describe('Prisma Error Handler', () => {
  describe('handlePrismaError', () => {
    it('should handle P2002 unique constraint violation', () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] }
        }
      )

      const result = handlePrismaError(prismaError)

      expect(result.statusCode).toBe(409)
      expect(result.statusMessage).toBe('Unique constraint violation')
      expect(result.data?.error).toBe('Duplicate data')
      expect(result.data?.code).toBe('P2002')
    })

    it('should handle P2025 record not found', () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        {
          code: 'P2025',
          clientVersion: '5.0.0'
        }
      )

      const result = handlePrismaError(prismaError)

      expect(result.statusCode).toBe(404)
      expect(result.statusMessage).toBe('Record not found')
      expect(result.data?.error).toBe('Not found')
    })

    it('should handle validation errors', () => {
      const validationError = new Prisma.PrismaClientValidationError(
        'Invalid data provided',
        { clientVersion: '5.0.0' }
      )

      const result = handlePrismaError(validationError)

      expect(result.statusCode).toBe(400)
      expect(result.statusMessage).toBe('Invalid data provided')
      expect(result.data?.error).toBe('Validation error')
    })

    it('should handle unknown errors', () => {
      const unknownError = new Error('Something went wrong')

      const result = handlePrismaError(unknownError)

      expect(result.statusCode).toBe(500)
      expect(result.statusMessage).toBe('Internal server error')
      expect(result.data?.error).toBe('Unknown error')
      expect(result.data?.details).toBe('Something went wrong')
    })
  })

  describe('withDatabaseErrorHandling', () => {
    it('should return result when operation succeeds', async () => {
      const operation = vi.fn().mockResolvedValue('success')

      const result = await withDatabaseErrorHandling(operation)

      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledOnce()
    })

    it('should handle Prisma errors', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0'
        }
      )
      const operation = vi.fn().mockRejectedValue(prismaError)

      await expect(withDatabaseErrorHandling(operation)).rejects.toMatchObject({
        statusCode: 409,
        statusMessage: 'Unique constraint violation'
      })
    })
  })

  describe('isPrismaError', () => {
    it('should return true for Prisma errors', () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Error',
        { code: 'P2002', clientVersion: '5.0.0' }
      )

      expect(isPrismaError(prismaError)).toBe(true)
    })

    it('should return false for non-Prisma errors', () => {
      const regularError = new Error('Regular error')

      expect(isPrismaError(regularError)).toBe(false)
    })
  })

  describe('getPrismaErrorMessage', () => {
    it('should return correct message for known error codes', () => {
      expect(getPrismaErrorMessage('P2002')).toBe('Unique constraint violation')
      expect(getPrismaErrorMessage('P2025')).toBe('Record not found')
    })

    it('should return default message for unknown error codes', () => {
      expect(getPrismaErrorMessage('P9999')).toBe('Database operation failed')
    })
  })
})
