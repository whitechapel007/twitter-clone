interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

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

export const useAuth = () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  const accessToken = ref<string | null>(null);
  const isInitialized = ref(false);
  const tokenRefreshTimer = ref<NodeJS.Timeout | null>(null);

  // Initialize token from localStorage on client side
  if (typeof window !== "undefined") {
    try {
      const storedToken = localStorage.getItem("auth-token");
      if (storedToken && !accessToken.value) {
        accessToken.value = storedToken;
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    isInitialized.value = true;
  } else {
    // On server side, mark as initialized to prevent blocking
    isInitialized.value = true;
  }

  // Helper function to decode JWT and get expiry time
  const getTokenExpiry = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  };

  // Schedule automatic token refresh
  const scheduleTokenRefresh = (token: string) => {
    if (typeof window === "undefined") return;

    // Clear existing timer
    if (tokenRefreshTimer.value) {
      clearTimeout(tokenRefreshTimer.value);
    }

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    // Refresh token 2 minutes before expiry
    const refreshTime = expiry - Date.now() - 2 * 60 * 1000;

    if (refreshTime > 0) {
      tokenRefreshTimer.value = setTimeout(async () => {
        try {
          console.log("Auto-refreshing token...");
          await refreshToken();
        } catch (error) {
          console.error("Auto token refresh failed:", error);
          // If refresh fails, logout user
          await logout();
        }
      }, refreshTime);
    }
  };

  // Watch for token changes and persist to localStorage
  watch(accessToken, (newToken) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("auth-token", newToken);
        // Schedule automatic refresh for new token
        scheduleTokenRefresh(newToken);
      } else {
        localStorage.removeItem("auth-token");
        // Clear refresh timer when token is removed
        if (tokenRefreshTimer.value) {
          clearTimeout(tokenRefreshTimer.value);
          tokenRefreshTimer.value = null;
        }
      }
    }
  });

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{
        user: User;
        accessToken: string;
      }>("/api/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      if (response.user) {
        user.value = response.user;
        // Store token if provided
        if (response.accessToken) {
          accessToken.value = response.accessToken;
        }

        // Redirect to home page
        await navigateTo("/");
      }

      return response;
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Handle different error types
      if (error && typeof error === "object") {
        const apiError = error as ApiError;

        // Handle API errors with structured response
        if ("data" in apiError && apiError.data) {
          // Check for specific error details
          if (apiError.data.error && apiError.data.details) {
            throw createError({
              statusCode: apiError.statusCode || 401,
              statusMessage: apiError.data.details || "Login failed",
            });
          }

          // Handle general data errors
          throw createError({
            statusCode: apiError.statusCode || 401,
            statusMessage:
              apiError.data.message || apiError.data.error || "Login failed",
          });
        }

        // Handle errors with status code but no data
        if ("statusCode" in apiError) {
          throw createError({
            statusCode: apiError.statusCode || 401,
            statusMessage: apiError.statusMessage || "Login failed",
          });
        }
      }

      // Fallback for unknown errors
      throw createError({
        statusCode: 401,
        statusMessage: "Login failed",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
    birthMonth: string;
    birthDay: string;
    birthYear: string;
  }) => {
    isLoading.value = true;
    try {
      // Convert birth date fields to ISO datetime string
      const dob = new Date(
        parseInt(userData.birthYear),
        parseInt(userData.birthMonth) - 1, // Month is 0-indexed
        parseInt(userData.birthDay)
      ).toISOString();

      const response = await $fetch<{
        user: {
          id: string;
          name: string;
          email: string;
          username: string;
          createdAt: string;
          profileImage: string;
          updatedAt: string;
        };
        accessToken: string;
      }>("/api/auth/register", {
        method: "POST",
        body: {
          name: userData.name,
          email: userData.email,
          username: userData.username,
          password: userData.password,
          dob: dob,
        },
      });

      if (response.user) {
        user.value = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          username: response.user.username,
          avatar: response.user.profileImage,
          createdAt: response.user.createdAt,
        };

        // Store access token for authenticated requests
        if (response.accessToken) {
          accessToken.value = response.accessToken;
        }

        console.log("Registration successful:", response);

        // Redirect to home page
        await navigateTo("/");
      }

      return response;
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Handle different error types
      if (error && typeof error === "object") {
        const apiError = error as ApiError;

        // Handle API errors with structured response (from our error handler)
        if ("data" in apiError && apiError.data) {
          // Check if it's a Prisma error with detailed information
          if (apiError.data.error && apiError.data.details) {
            throw createError({
              statusCode: apiError.statusCode || 400,
              statusMessage:
                apiError.data.details ||
                apiError.data.error ||
                "Registration failed",
            });
          }

          // Handle validation errors
          if (apiError.data.validationErrors) {
            const validationMessage = apiError.data.validationErrors
              .map((err) => err.message)
              .join(", ");
            throw createError({
              statusCode: 400,
              statusMessage: `Validation error: ${validationMessage}`,
            });
          }

          // Handle general data errors
          throw createError({
            statusCode: apiError.statusCode || 400,
            statusMessage:
              apiError.data.message ||
              apiError.data.error ||
              "Registration failed",
          });
        }

        // Handle errors with status code but no data
        if ("statusCode" in apiError) {
          throw createError({
            statusCode: apiError.statusCode || 400,
            statusMessage: apiError.statusMessage || "Registration failed",
          });
        }

        // Handle fetch/network errors
        if (
          apiError.name === "TypeError" ||
          (apiError.message && apiError.message.includes("fetch"))
        ) {
          throw createError({
            statusCode: 500,
            statusMessage:
              "Network error during registration. Please check your connection.",
          });
        }

        // Handle timeout errors
        if (
          apiError.name === "AbortError" ||
          (apiError.message && apiError.message.includes("timeout"))
        ) {
          throw createError({
            statusCode: 408,
            statusMessage: "Registration request timed out. Please try again.",
          });
        }
      }

      // Fallback for unknown errors
      throw createError({
        statusCode: 500,
        statusMessage: "Registration failed due to an unexpected error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      const { $fetchWithAuth } = useNuxtApp();
      await $fetchWithAuth("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data and token regardless of API call success
      user.value = null;
      accessToken.value = null;

      // Redirect to auth page
      await navigateTo("/auth");
    }
  };

  const checkAuth = async () => {
    if (!accessToken.value) {
      return false;
    }

    try {
      const { $fetchWithAuth } = useNuxtApp();

      // Use $fetchWithAuth which automatically handles Authorization headers and token refresh
      const response = await $fetchWithAuth<{
        user: User;
        tokenInfo: Record<string, unknown>;
      }>("/api/auth/me");

      if (response.user) {
        user.value = response.user;
        return true;
      }
    } catch (error: unknown) {
      console.error("Auth check failed:", error);
      // The $fetchWithAuth interceptor already handled token refresh attempts
      // If we reach here, the token is invalid and should be cleared
      accessToken.value = null;
    }

    // Example user credentials for testing
    // Username: testuser
    // Email: test@example.com
    // Password: password123

    return false;
  };

  const refreshToken = async () => {
    try {
      const response = await $fetch<{
        message: string;
        accessToken: string;
      }>("/api/auth/refresh", {
        method: "POST",
        body: {}, // Empty body required by API validation
        // Backend gets refresh token from httpOnly cookie automatically
      });

      if (response.accessToken) {
        accessToken.value = response.accessToken;
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
    }

    return false;
  };

  // Helper function for making authenticated API calls
  const fetchWithAuth = () => {
    const { $fetchWithAuth } = useNuxtApp();
    return $fetchWithAuth;
  };

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    accessToken: readonly(accessToken),
    isInitialized: readonly(isInitialized),

    // Methods
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
    fetchWithAuth,
  };
};

export const useLogin = () => {
  const { login, isLoading } = useAuth();
  return { login, isLoading };
};

export const useRegister = () => {
  const { register, isLoading } = useAuth();
  return { register, isLoading };
};

export const useLogout = () => {
  const { logout } = useAuth();
  return { logout };
};
