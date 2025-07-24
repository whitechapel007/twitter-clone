// ~/app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side rendering to avoid hydration issues
  if (import.meta.server) return;

  const { isAuthenticated, initialize, user, accessToken, ensureValidToken } =
    useAuth();

  // Initialize auth state if not already done
  if (!user.value && !accessToken.value) {
    try {
      await initialize();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/auth",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/toast-demo", // Demo page
  ];

  // Define routes that require authentication
  const protectedRoutes = [
    "/", // Home/dashboard
    "/profile",
    "/settings",
    "/compose",
    "/messages",
    "/notifications",
    "/bookmarks",
    "/lists",
    "/explore",
    "/search",
    "/user",
  ];

  // Helper function to check if a route matches
  const matchesRoute = (path: string, routes: string[]): boolean => {
    return routes.some((route) => {
      // Exact match
      if (path === route) return true;
      // Starts with route + slash (for nested routes)
      if (path.startsWith(route + "/")) return true;
      // Handle dynamic routes like /user/[username]
      if (route.includes("[") && route.includes("]")) {
        const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}(/.*)?$`);
        return regex.test(path);
      }
      return false;
    });
  };

  const isPublicRoute = matchesRoute(to.path, publicRoutes);
  const isProtectedRoute = matchesRoute(to.path, protectedRoutes);

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated.value && isPublicRoute && to.path.startsWith("/auth")) {
    return navigateTo("/");
  }

  // If user is not authenticated and trying to access protected routes, redirect to auth
  if (!isAuthenticated.value && (isProtectedRoute || to.path === "/")) {
    // Store the intended destination for redirect after login
    const redirectTo = to.fullPath !== "/" ? to.fullPath : undefined;
    const authPath = redirectTo
      ? `/auth?redirect=${encodeURIComponent(redirectTo)}`
      : "/auth";
    return navigateTo(authPath);
  }

  // For authenticated users accessing protected routes, ensure token is valid
  if (isAuthenticated.value && isProtectedRoute) {
    try {
      await ensureValidToken();
    } catch (error) {
      console.error("Token validation failed:", error);
      // If token refresh fails, redirect to auth
      return navigateTo("/auth");
    }
  }

  // For all other routes, allow access
  return;
});
