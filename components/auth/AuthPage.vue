<template>
  <div class="min-h-screen bg-black text-white flex flex-col lg:flex-row">
    <!-- Left side - X Logo -->
    <div class="flex-1 flex items-center justify-center py-8 lg:py-0">
      <div class="text-white">
        <!-- X Logo SVG -->
        <svg
          viewBox="0 0 24 24"
          class="w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 fill-current"
        >
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      </div>
    </div>

    <!-- Right side - Auth Form -->
    <div
      class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-8 lg:py-0"
    >
      <div class="max-w-md w-full mx-auto lg:mx-0">
        <!-- Happening now -->
        <h1
          class="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12"
        >
          Happening now
        </h1>

        <!-- Join today -->
        <h2 class="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Join today.
        </h2>

        <!-- Auth buttons -->
        <div class="space-y-3 mb-8">
          <!-- Google Sign up -->
          <button
            class="w-full bg-white text-black font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
            @click="handleGoogleSignup"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span class="truncate">Sign up with Google</span>
          </button>

          <!-- Apple Sign up -->
          <button
            class="w-full bg-white text-black font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
            @click="handleAppleSignup"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 fill-current"
              viewBox="0 0 24 24"
            >
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              />
            </svg>
            <span class="truncate">Sign up with Apple</span>
          </button>

          <!-- OR divider -->
          <div class="flex items-center my-4">
            <div class="flex-1 border-t border-gray-700"></div>
            <span class="px-4 text-gray-500 text-sm">or</span>
            <div class="flex-1 border-t border-gray-700"></div>
          </div>

          <!-- Create account -->
          <button
            class="w-full bg-blue-500 text-white font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base"
            @click="handleCreateAccount"
          >
            Create account
          </button>
        </div>

        <!-- Terms text -->
        <p
          class="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed"
        >
          By signing up, you agree to the
          <a href="#" class="text-blue-400 hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-blue-400 hover:underline">Privacy Policy</a>,
          including
          <a href="#" class="text-blue-400 hover:underline">Cookie Use</a>.
        </p>

        <!-- Already have account -->
        <div>
          <p class="text-white font-bold text-base sm:text-lg mb-4">
            Already have an account?
          </p>
          <button
            class="w-full border border-gray-600 text-blue-400 font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-gray-900 transition-colors text-sm sm:text-base"
            @click="handleSignIn"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>

    <!-- Sign In Modal -->
    <SignInModal
      :is-open="showSignInModal"
      @close="showSignInModal = false"
      @sign-up="handleSignUpFromModal"
    />

    <!-- Create Account Modal -->
    <CreateAccountModal
      :is-open="showCreateAccountModal"
      @close="showCreateAccountModal = false"
      @account-created="handleAccountCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface AccountData {
  name: string;
  email: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  username: string;
  password: string;
}

// Modal state
const showSignInModal = ref(false);
const showCreateAccountModal = ref(false);

// Component logic can be added here for handling auth actions
const handleGoogleSignup = () => {
  // TODO: Implement Google OAuth
  console.log("Google signup clicked");
};

const handleAppleSignup = () => {
  // TODO: Implement Apple OAuth
  console.log("Apple signup clicked");
};

const handleCreateAccount = () => {
  showCreateAccountModal.value = true;
  console.log("Create account clicked - opening modal");
};

const handleSignIn = () => {
  showSignInModal.value = true;
  console.log("Sign in clicked - opening modal");
};

const handleSignUpFromModal = () => {
  // Close sign in modal and open create account modal
  showSignInModal.value = false;
  showCreateAccountModal.value = true;
  console.log("Sign up from modal clicked");
};

const handleAccountCreated = (accountData: AccountData) => {
  // TODO: Handle account creation with API
  console.log("Account created with data:", accountData);
  // You can add API call here to create the account
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
