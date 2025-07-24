<template>
  <div class="min-h-screen md:flex">
    <div class="flex-1 flex items-center justify-center bg-black text-white">
      <div class="">
        <svg viewBox="0 0 24 24" class="w-80 h-80 fill-current">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center px-8 py-10 lg:px-16 xl:px-24 bg-black text-white">
      <div class="max-w-md w-full">
        <h1 class="text-6xl font-bold mb-12">Happening now</h1>

        <h2 class="text-3xl font-bold mb-8">Join today.</h2>

        <div class="space-y-3 mb-8">
          <button
            class="w-full bg-white text-black font-medium py-3 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            @click="handleGoogleSignup" :disabled="isLoading" aria-label="Sign up with Google">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <button
            class="w-full bg-white text-black font-medium py-3 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            @click="handleAppleSignup" :disabled="isLoading" aria-label="Sign up with Apple">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            <span>Sign up with Apple</span>
          </button>

          <div class="flex items-center my-4">
            <div class="flex-1 border-t border-gray-700"></div>
            <span class="px-4 text-sm">or</span>
            <div class="flex-1 border-t border-gray-700"></div>
          </div>

          <button
            class="w-full bg-blue-500 text-white font-medium py-3 px-6 rounded-full hover:bg-blue-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleCreateAccount" :disabled="isLoading" aria-label="Create new account">
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>

        <p class="text-gray-500 text-xs mb-8">
          By signing up, you agree to the
          <a href="#" class="text-blue-400 hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-blue-400 hover:underline">Privacy Policy</a>,
          including
          <a href="#" class="text-blue-400 hover:underline">Cookie Use</a>.
        </p>

        <div>
          <p class="font-bold text-lg mb-4">Already have an account?</p>
          <button
            class="w-full border border-gray-600 text-blue-400 font-medium py-3 px-6 rounded-full hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            @click="handleSignIn" :disabled="isLoading" aria-label="Sign in to existing account">
            Sign in
          </button>
        </div>
      </div>
    </div>

    <AuthSignInModal :is-open="showSignInModal" @close="showSignInModal = false" @sign-up="handleSignUpFromModal" />

    <AuthCreateAccountModal :is-open="showCreateAccountModal" @close="showCreateAccountModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

// --- Composables ---
const { register, isLoading } = useAuth();
const toast = useToast();

// --- Page Meta ---
definePageMeta({
  layout: "auth",
  auth: false, // Ensure this page is accessible without auth
});

// --- Interfaces ---
export interface AccountData {
  name: string;
  email: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  username: string;
  password: string;
}

// --- State ---
const showSignInModal = ref(false);
const showCreateAccountModal = ref(false);

// --- Handlers for Auth Buttons ---

const handleGoogleSignup = () => {
  // TODO: Implement Google OAuth
  console.log("Google signup clicked");
  toast.info("Google signup is not yet implemented.");
};

const handleAppleSignup = () => {
  // TODO: Implement Apple OAuth
  console.log("Apple signup clicked");
  toast.info("Apple signup is not yet implemented.");
};

const handleCreateAccount = () => {
  showCreateAccountModal.value = true;
};

const handleSignIn = () => {
  showSignInModal.value = true;
};

// --- Handlers for Modal Events ---

const handleSignUpFromModal = () => {
  showSignInModal.value = false;
  showCreateAccountModal.value = true;
};


</script>

<style scoped>
/* Add any specific styling for this component here */
</style>
