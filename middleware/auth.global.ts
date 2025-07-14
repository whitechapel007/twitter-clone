export default defineNuxtRouteMiddleware((to) => {
  // Only run on client side to avoid SSR issues
  if (import.meta.server) {
    return;
  }

  // Wrap in try-catch to prevent errors from breaking the app
  try {
    const { accessToken, user, isInitialized } = useAuth();

    // Wait for auth system to initialize before making decisions
    if (!isInitialized.value) {
      return;
    }

    // Define public routes that don't require authentication
    const publicRoutes = ["/auth"];
    const isPublicRoute = publicRoutes.includes(to.path);

    // If user has a token or user data and tries to access auth page, redirect to home
    if (to.path === "/auth" && (accessToken.value || user.value)) {
      return navigateTo("/");
    }

    // If it's a public route, allow access
    if (isPublicRoute) {
      return;
    }

    // For protected routes, check if user has access token
    if (!accessToken.value) {
      return navigateTo("/auth");
    }

    // If we have a token but no user data, let the page load and the auth plugin will handle validation and redirect
  } catch (error) {
    console.error("Auth middleware error:", error);
    // On error, allow navigation to continue to prevent blocking the app
    return;
  }
});
