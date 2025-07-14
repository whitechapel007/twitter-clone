/**
 * Utility functions for authentication management
 */

/**
 * Check if a JWT token is close to expiring
 * @param token - JWT token string
 * @param bufferMinutes - Minutes before expiry to consider "close to expiring" (default: 5)
 * @returns boolean indicating if token is close to expiring
 */
export const isTokenCloseToExpiry = (token: string, bufferMinutes = 5): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const buffer = bufferMinutes * 60 * 1000 // Convert minutes to milliseconds
    
    return (expiry - now) <= buffer
  } catch {
    return true // If we can't parse the token, consider it expired
  }
}

/**
 * Get the remaining time until token expiry
 * @param token - JWT token string
 * @returns number of milliseconds until expiry, or 0 if expired/invalid
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    
    return Math.max(0, expiry - now)
  } catch {
    return 0
  }
}

/**
 * Format time remaining in a human-readable format
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string like "5m 30s" or "2h 15m"
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Expired'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}
