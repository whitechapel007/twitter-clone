<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/30"
    @click="closeModal"
  >
    <div
      class="bg-black rounded-2xl w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8 relative max-h-[95vh] overflow-y-auto"
      @click.stop
    >
      <!-- Close button -->
      <button
        class="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors"
        @click="closeModal"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>

      <!-- X Logo -->
      <div class="flex justify-center mb-6">
        <svg viewBox="0 0 24 24" class="w-8 h-8 fill-current text-white">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      </div>

      <!-- Title -->
      <h2 class="text-white text-3xl font-bold text-center mb-8">
        Create your account
      </h2>

      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Name field -->
        <div class="relative">
          <input
            v-model="formData.name"
            type="text"
            placeholder="Name"
            maxlength="50"
            class="w-full bg-transparent border-2 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:outline-none transition-colors text-sm sm:text-base"
            :class="nameFieldClasses"
            @focus="focusedField = 'name'"
            @blur="focusedField = ''"
          />
          <div
            class="absolute top-2 right-3 sm:right-4 text-gray-500 text-xs sm:text-sm"
          >
            {{ formData.name.length }} / 50
          </div>
        </div>

        <!-- Email field -->
        <div class="relative">
          <input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="w-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
            @focus="focusedField = 'email'"
            @blur="focusedField = ''"
          />
        </div>

        <!-- Date of birth section -->
        <div class="space-y-3 sm:space-y-4">
          <h3 class="text-white text-base sm:text-lg font-bold">
            Date of birth
          </h3>
          <p class="text-gray-500 text-xs sm:text-sm leading-relaxed">
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </p>

          <div class="grid grid-cols-3 gap-2 sm:gap-4">
            <!-- Month -->
            <div class="relative">
              <select
                v-model="formData.birthMonth"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled class="bg-black">Month</option>
                <option
                  v-for="(month, index) in months"
                  :key="index"
                  :value="index + 1"
                  class="bg-black"
                >
                  {{ month }}
                </option>
              </select>
              <svg
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Day -->
            <div class="relative">
              <select
                v-model="formData.birthDay"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled class="bg-black">Day</option>
                <option
                  v-for="day in 31"
                  :key="day"
                  :value="day"
                  class="bg-black"
                >
                  {{ day }}
                </option>
              </select>
              <svg
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Year -->
            <div class="relative">
              <select
                v-model="formData.birthYear"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled class="bg-black">Year</option>
                <option
                  v-for="year in years"
                  :key="year"
                  :value="year"
                  class="bg-black"
                >
                  {{ year }}
                </option>
              </select>
              <svg
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Next button -->
        <button
          :disabled="!isStep1Valid"
          class="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full transition-colors mt-6 sm:mt-8 text-sm sm:text-base"
          :class="
            isStep1Valid
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          "
          @click="nextStep"
        >
          Next
        </button>
      </div>

      <!-- Step 2: Additional fields (username, password, etc.) -->
      <div v-if="currentStep === 2" class="space-y-4 sm:space-y-6">
        <!-- Username field -->
        <div class="relative">
          <input
            v-model="formData.username"
            type="text"
            placeholder="Username"
            maxlength="30"
            class="w-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
          />
        </div>

        <!-- Password field -->
        <div class="relative">
          <input
            v-model="formData.password"
            type="password"
            placeholder="Password"
            class="w-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
          />
        </div>

        <!-- Create account button -->
        <button
          :disabled="!isStep2Valid"
          class="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full transition-colors mt-6 sm:mt-8 text-sm sm:text-base"
          :class="
            isStep2Valid
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          "
          @click="createAccount"
        >
          <Loader :is-loading="isLoading" />
          {{ isLoading ? "Creating account..." : "Create account" }}
        </button>

        <!-- Back button -->
        <button
          class="w-full border border-gray-600 text-white font-medium py-3 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-gray-900 transition-colors text-sm sm:text-base"
          @click="previousStep"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "~/composables/useAuth";

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "accountCreated", data: formDataProps): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { isLoading } = useAuth();

const currentStep = ref(1);
const focusedField = ref("");

type formDataProps = typeof formData.value;

const formData = ref({
  name: "",
  email: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  username: "",
  password: "",
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 100; year--) {
    years.push(year);
  }
  return years;
});

const nameFieldClasses = computed(() => {
  if (focusedField.value === "name" || formData.value.name.length > 0) {
    return "border-blue-500";
  }
  return "border-gray-600";
});

const isStep1Valid = computed(() => {
  return (
    formData.value.name.trim().length > 0 &&
    formData.value.email.trim().length > 0 &&
    formData.value.birthMonth &&
    formData.value.birthDay &&
    formData.value.birthYear
  );
});

const isStep2Valid = computed(() => {
  return (
    formData.value.username.trim().length > 0 &&
    formData.value.password.trim().length >= 6
  );
});

const closeModal = () => {
  currentStep.value = 1;
  formData.value = {
    name: "",
    email: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    username: "",
    password: "",
  };
  emit("close");
};

const nextStep = () => {
  if (isStep1Valid.value) {
    currentStep.value = 2;
  }
};

const previousStep = () => {
  currentStep.value = 1;
};

const createAccount = () => {
  if (isStep2Valid.value) {
    console.log("Creating account with data:", formData.value);
    emit("accountCreated", formData.value);
    closeModal();
  }
};
</script>
