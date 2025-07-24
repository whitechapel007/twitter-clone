<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/30"
    @click="closeModal">
    <div class="bg-black rounded-2xl w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 relative max-h-[95vh] overflow-y-auto"
      @click.stop>
      <!-- Close button -->
      <button class="absolute top-3 left-3 sm:top-4 sm:left-4 text-white hover:text-gray-300 transition-colors z-10 p-1"
        @click="closeModal" aria-label="Close modal">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <!-- X Logo -->
      <div class="flex justify-center mb-4 sm:mb-6 mt-2">
        <svg viewBox="0 0 24 24" class="w-6 h-6 sm:w-8 sm:h-8 fill-current text-white">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      <!-- Title -->
      <h2 class="text-white text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Sign in to X
      </h2>

      <!-- Auth buttons -->
      <div class="space-y-3 mb-6">
        <!-- Google Sign in -->
        <button
          class="w-full bg-white text-black font-medium py-3 px-4 sm:px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleGoogleSignIn" :disabled="isLoading" aria-label="Sign in with Google">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span class="truncate">Sign in with Google</span>
        </button>

        <!-- Apple Sign in -->
        <button
          class="w-full bg-white text-black font-medium py-3 px-4 sm:px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleAppleSignIn" :disabled="isLoading" aria-label="Sign in with Apple">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
          <span class="truncate">Sign in with Apple</span>
        </button>

        <!-- OR divider -->
        <div class="flex items-center my-4">
          <div class="flex-1 border-t border-gray-700"></div>
          <span class="px-4 text-white text-sm">or</span>
          <div class="flex-1 border-t border-gray-700"></div>
        </div>

        <!-- Form inputs -->
        <div v-if="currentStep === 'email'">
          <input v-model="formData.email" type="text" placeholder="Phone, email, or username"
            class="w-full bg-transparent border border-gray-600 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:border-blue-500 focus:outline-none text-sm sm:text-base"
            :class="{ 'border-red-500': errors.email }" @keyup.enter="handleNext" />
          <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <div v-if="currentStep === 'password'">
          <input v-model="formData.password" type="password" placeholder="Password"
            class="w-full bg-transparent border border-gray-600 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:border-blue-500 focus:outline-none text-sm sm:text-base"
            :class="{ 'border-red-500': errors.password }" @keyup.enter="handleSubmit" />
          <p v-if="errors.password" class="text-red-400 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Action buttons -->
        <button v-if="currentStep === 'email'" @click="handleNext"
          class="w-full bg-white text-black font-bold py-3 px-4 sm:px-6 rounded-full hover:bg-gray-100 transition-colors mt-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!formData.email.trim() || isLoading">
          Next
        </button>

        <button v-if="currentStep === 'password'" @click="handleSubmit"
          class="w-full bg-white text-black font-bold py-3 px-4 sm:px-6 rounded-full hover:bg-gray-100 transition-colors mt-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          :disabled="!formData.password.trim() || isLoading">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isLoading ? "Signing in..." : "Sign in" }}
        </button>

        <!-- Back button for password step -->
        <button v-if="currentStep === 'password'" @click="handleBack"
          class="w-full border border-gray-600 text-white font-medium py-3 px-4 sm:px-6 rounded-full hover:bg-gray-900 transition-colors mt-3 text-sm sm:text-base"
          :disabled="isLoading">
          Back
        </button>

        <!-- Forgot password -->
        <button v-if="currentStep === 'password'" @click="handleForgotPassword"
          class="w-full border border-gray-600 text-white font-medium py-3 px-4 sm:px-6 rounded-full hover:bg-gray-900 transition-colors mt-3 text-sm sm:text-base"
          :disabled="isLoading">
          Forgot password?
        </button>
      </div>

      <!-- Don't have account -->
      <p class="text-gray-500 text-center mt-8 text-sm sm:text-base">
        Don't have an account?
        <button @click="handleSignUp" class="text-blue-400 hover:underline">
          Sign up
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";


// --- Types ---
interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "sign-up"): void;
}

type Step = "email" | "password";

// --- Props & Emits ---
defineProps<Props>();
const emit = defineEmits<Emits>();

// --- Composables ---
const { login, isLoading } = useAuth();
const toast = useToast();

// --- State ---
const currentStep = ref<Step>("email");
const formData = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

// --- Methods ---
const clearForm = () => {
  formData.email = "";
  formData.password = "";
  errors.email = "";
  errors.password = "";
  currentStep.value = "email";
};

const validateEmail = (): boolean => {
  const email = formData.email.trim();
  if (!email) {
    errors.email = "Email is required";
    return false;
  }
  if (!email.includes("@") && email.length < 3) {
    errors.email = "Please enter a valid email or username";
    return false;
  }
  errors.email = "";
  return true;
};

const validatePassword = (): boolean => {
  if (!formData.password.trim()) {
    errors.password = "Password is required";
    return false;
  }
  if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    return false;
  }
  errors.password = "";
  return true;
};

const closeModal = () => {
  emit("close");
  clearForm();
};

const handleNext = () => {
  if (validateEmail()) {
    currentStep.value = "password";
  }
};

const handleBack = () => {
  currentStep.value = "email";
  errors.password = "";
};

const handleSubmit = async () => {
  if (!validatePassword()) return;

  try {
    await login(formData.email, formData.password);
    // Only show success toast and close modal if login succeeds
    toast.success("Welcome back! You've been signed in successfully.");
    closeModal();
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle specific error types
    if (error?.statusCode === 401) {
      errors.password = "Invalid email or password";
      toast.error("Invalid credentials. Please check your email and password.");
    } else if (error?.statusCode === 400) {
      // Handle validation errors
      if (error?.data && Array.isArray(error.data)) {
        const emailError = error.data.find((err: any) => err.path?.[0] === 'email');
        const passwordError = error.data.find((err: any) => err.path?.[0] === 'password');

        if (emailError) {
          errors.email = emailError.message;
          currentStep.value = "email";
        }
        if (passwordError) {
          errors.password = passwordError.message;
        }

        toast.error("Please fix the validation errors and try again.");
      } else {
        errors.password = "Invalid input";
        toast.error("Please check your input and try again.");
      }
    } else {
      // Generic error handling
      errors.password = "Sign in failed";
      toast.error(error?.statusMessage || error?.message || "Failed to sign in. Please try again.");
    }
  }
};

const handleGoogleSignIn = () => {
  console.log("Google sign in clicked");
  toast.info("Google sign-in is not yet implemented.");
  // TODO: Implement Google OAuth
};

const handleAppleSignIn = () => {
  console.log("Apple sign in clicked");
  toast.info("Apple sign-in is not yet implemented.");
  // TODO: Implement Apple OAuth
};

const handleForgotPassword = () => {
  console.log("Forgot password clicked");
  toast.info("Password reset functionality is coming soon.");
  // TODO: Implement forgot password flow
};

const handleSignUp = () => {
  emit("sign-up");
  closeModal();
};
</script>
