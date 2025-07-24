import { jwtDecode } from "jwt-decode";

import type {
  AuthError,
  AuthResponse,
  DecodedToken,
  RegisterData,
  User,
} from "./auth";

// --- Auth Composable ---
export const useAuth = () => {
  // --- Global State ---
  const user = useState<User | null>("auth-user", () => null);
  const accessToken = useState<string | null>("auth-access-token", () => null);
  const isLoading = useState<boolean>("auth-loading", () => false);
  const error = useState<AuthError | null>("auth.error", () => null);

  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);

  const config = useRuntimeConfig();
  const router = useRouter();

  // API base URL - adjust according to your backend
  const API_BASE_URL = config.public.apiBaseUrl || "http://localhost:3000";

  /**
   * Clear authentication state
   */
  const clearAuth = () => {
    user.value = null;
    accessToken.value = null;
    error.value = null;
  };

  /**
   * Set authentication state
   */
  const setAuth = (authData: AuthResponse) => {
    user.value = authData.user;
    if (authData.accessToken) {
      accessToken.value = authData.accessToken;
    }
    error.value = null;
  };

  // --- Helper Functions ---
  const handleError = (error: any): string => {
    console.error("Auth error:", error.message);

    return error?.data?.message || error?.message || "An error occurred";
  };

  /**
   * Check if token is expired
   */
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Add 30 seconds buffer to prevent edge cases
      return decoded.exp < currentTime + 30;
    } catch (err) {
      console.error("Error decoding token:", err);
      return true;
    }
  };

  /**
   * Get token expiration time
   */
  const getTokenExpiration = (token: string): Date | null => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return new Date(decoded.exp * 1000);
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  /**
   * Check if current access token is expired
   */
  const checkTokenExpired = (): boolean => {
    if (!accessToken.value) return true;
    return isTokenExpired(accessToken.value);
  };

  const refreshAccessToken = async (): Promise<void> => {
    if (!accessToken.value) {
      await logout();
    }

    if (isTokenExpired(accessToken.value as string)) {
      await logout();
    }

    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<AuthResponse>(`/api/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      if (response.accessToken) {
        accessToken.value = response.accessToken;
      }
    } catch (err) {
      handleError(err);
      await logout();
    } finally {
      isLoading.value = false;
    }
  };

  // --- Core Methods ---
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      setAuth(response);
      await navigateTo("/");
      return response;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw the error so components can handle it
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: RegisterData) => {
    isLoading.value = true;
    try {
      const dob = new Date(
        parseInt(userData.birthYear),
        parseInt(userData.birthMonth) - 1,
        parseInt(userData.birthDay)
      ).toISOString();

      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: { ...userData, dob },
      });

      setAuth(response);
      await navigateTo("/");
      return response;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw the error so components can handle it
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout user
   * @param logoutFromAllDevices - Whether to invalidate sessions on all devices
   */
  const logout = async (
    logoutFromAllDevices: boolean = false
  ): Promise<void> => {
    try {
      isLoading.value = true;

      // Call logout endpoint if access token exists
      if (accessToken.value) {
        try {
          const response = await $fetch<{
            success: boolean;
            message: string;
            loggedOutFromAllDevices?: boolean;
          }>(`/api/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken.value}`,
            },
            body: { logoutFromAllDevices },
          });

          console.log("Logout response:", response.message);
        } catch (logoutError) {
          // Log the error but don't prevent local logout
          console.warn("Logout endpoint failed:", logoutError);
        }
      }

      clearAuth();
      await router.push("/auth");
    } catch (err) {
      // Always clear auth state even if logout endpoint fails
      console.error("Logout error:", err);
      clearAuth();
      await router.push("/auth");
    } finally {
      isLoading.value = false;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await $fetch<{ accessToken: string }>(
        "/api/auth/refresh-token",
        {
          method: "POST",
        }
      );
      accessToken.value = response.accessToken;
    } catch (error) {
      await logout();
      throw error;
    }
  };

  /**
   * Initialize auth state (call this in app.vue or plugin)
   */
  const initialize = async (): Promise<void> => {
    // Check if we have token in storage/state
    if (!accessToken.value) {
      return;
    }

    // If access token is expired, try to refresh
    if (checkTokenExpired()) {
      try {
        await refreshAccessToken();
      } catch (err) {
        clearAuth();
        return;
      }
    }

    // If we still don't have a user but have valid token, fetch user data
    if (!user.value && accessToken.value) {
      try {
        const data = await $fetch<User>(`/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        });
        user.value = data;
      } catch (err) {
        // If fetching user fails, clear auth state
        clearAuth();
      }
    }
  };

  // Auto-refresh token when needed
  const ensureValidToken = async () => {
    if (!accessToken.value || isTokenExpired(accessToken.value)) {
      await refreshToken();
    }
  };
  /**
   * Auto-refresh token before expiration
   */
  const startTokenRefreshTimer = () => {
    if (!accessToken.value) return;

    const expiration = getTokenExpiration(accessToken.value);
    if (!expiration) return;

    const timeUntilExpiry = expiration.getTime() - Date.now();
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000); // Refresh 5 minutes before expiry

    setTimeout(async () => {
      if (isAuthenticated.value) {
        await refreshAccessToken();
        startTokenRefreshTimer(); // Schedule next refresh
      }
    }, refreshTime);
  };

  return {
    // State
    user: readonly(user),
    accessToken: readonly(accessToken),
    isLoading: readonly(isLoading),
    isAuthenticated,

    // Methods
    login,
    register,
    logout,
    refreshToken,
    initialize,
    ensureValidToken,
  };
};
