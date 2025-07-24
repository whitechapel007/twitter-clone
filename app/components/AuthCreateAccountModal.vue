<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/30"
    @click="closeModal">
    <div class="bg-black rounded-2xl w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8 relative max-h-[95vh] overflow-y-auto"
      @click.stop>

      <!-- Close button -->
      <button class="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors" @click="closeModal"
        aria-label="Close modal">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <!-- X Logo -->
      <div class="flex justify-center mb-6">
        <svg viewBox="0 0 24 24" class="w-8 h-8 fill-current text-white">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
          <input v-model="formData.name" type="text" placeholder="Name" maxlength="50"
            class="w-full bg-transparent border-2 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:outline-none transition-colors text-sm sm:text-base"
            :class="getFieldClasses('name')" @focus="focusedField = 'name'" @blur="validateField('name')"
            @input="clearFieldError('name')" />

          <div class="absolute top-2 right-3 sm:right-4 text-gray-500 text-xs sm:text-sm">
            {{ formData.name.length }} / 50
          </div>
          <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email field -->
        <div class="relative">
          <input v-model="formData.email" type="email" placeholder="Email"
            class="w-full bg-transparent border-2 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:outline-none transition-colors text-sm sm:text-base"
            :class="getFieldClasses('email')" @focus="focusedField = 'email'" @blur="validateField('email')"
            @input="clearFieldError('email')" />
          <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
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
              <select v-model="formData.birthMonth"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                :class="{ 'border-red-500': errors.birthDate }" @change="clearFieldError('birthDate')">
                <option value="" disabled class="bg-black">Month</option>
                <option v-for="(month, index) in months" :key="index" :value="index + 1" class="bg-black">
                  {{ month }}
                </option>
              </select>
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Day -->
            <div class="relative">
              <select v-model="formData.birthDay"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                :class="{ 'border-red-500': errors.birthDate }" @change="clearFieldError('birthDate')">
                <option value="" disabled class="bg-black">Day</option>
                <option v-for="day in 31" :key="day" :value="day" class="bg-black">
                  {{ day }}
                </option>
              </select>
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Year -->
            <div class="relative">
              <select v-model="formData.birthYear"
                class="w-full bg-transparent border-2 border-gray-600 text-white py-4 px-4 rounded-md focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                :class="{ 'border-red-500': errors.birthDate }" @change="clearFieldError('birthDate')">
                <option value="" disabled class="bg-black">Year</option>
                <option v-for="year in years" :key="year" :value="year" class="bg-black">
                  {{ year }}
                </option>
              </select>
              <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <p v-if="errors.birthDate" class="text-red-400 text-xs mt-1">{{ errors.birthDate }}</p>
        </div>

        <!-- Next button -->
        <button @click="handleNextStep"
          class="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full transition-colors mt-6 sm:mt-8 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isStep1Valid ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-600 text-gray-400'"
          :disabled="!isStep1Valid">
          Next
        </button>
      </div>

      <!-- Step 2: Additional fields (username, password, etc.) -->
      <div v-if="currentStep === 2" class="space-y-4 sm:space-y-6">
        <!-- Username field -->
        <div class="relative">
          <input v-model="formData.username" type="text" placeholder="Username" maxlength="30"
            class="w-full bg-transparent border-2 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:outline-none transition-colors text-sm sm:text-base"
            :class="getFieldClasses('username')" @focus="focusedField = 'username'" @blur="validateField('username')"
            @input="clearFieldError('username')" />
          <p v-if="errors.username" class="text-red-400 text-xs mt-1">{{ errors.username }}</p>
        </div>

        <!-- Password field -->
        <div class="relative">
          <input v-model="formData.password" type="password" placeholder="Password (minimum 8 characters)"
            class="w-full bg-transparent border-2 text-white placeholder-gray-500 py-3 sm:py-4 px-3 sm:px-4 rounded-md focus:outline-none transition-colors text-sm sm:text-base"
            :class="getFieldClasses('password')" @focus="focusedField = 'password'" @blur="validateField('password')"
            @input="clearFieldError('password')" />

          <!-- Password requirements -->
          <div v-if="formData.password && focusedField === 'password'" class="mt-2 space-y-1">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full" :class="formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-500'">
              </div>
              <span class="text-xs" :class="formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'">At least
                8 characters</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full"
                :class="/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-500'"></div>
              <span class="text-xs" :class="/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'">One
                lowercase letter</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full"
                :class="/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-500'"></div>
              <span class="text-xs" :class="/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'">One
                uppercase letter</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 rounded-full" :class="/\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-500'">
              </div>
              <span class="text-xs" :class="/\d/.test(formData.password) ? 'text-green-400' : 'text-gray-400'">One
                number</span>
            </div>
          </div>

          <p v-if="errors.password" class="text-red-400 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Create account button -->
        <button @click="handleCreateAccount"
          class="w-full font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full transition-colors mt-6 sm:mt-8 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          :class="isStep2Valid ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-600 text-gray-400'"
          :disabled="!isStep2Valid || isLoading">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isLoading ? "Creating account..." : "Create account" }}
        </button>

        <!-- Back button -->
        <button
          class="w-full border border-gray-600 text-white font-medium py-3 px-4 sm:px-6 rounded-full hover:bg-gray-900 transition-colors text-sm sm:text-base"
          @click="handleBackStep" :disabled="isLoading">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useToast } from "../composables/useToast";

// --- Types ---
interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "account-created", data: AccountData): void;
}

interface AccountData {
  name: string;
  email: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  username: string;
  password: string;
}

type FieldName = keyof AccountData | "birthDate";

// --- Props & Emits ---
defineProps<Props>();
const emit = defineEmits<Emits>();

// --- Composables ---
const { register, isLoading } = useAuth();
const toast = useToast();

// --- State ---
const currentStep = ref(1);
const focusedField = ref<string>("");

const formData = reactive<AccountData>({
  name: "",
  email: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  username: "",
  password: "",
});

const errors = reactive<Record<FieldName, string>>({
  name: "",
  email: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  birthDate: "",
  username: "",
  password: "",
});

// --- Constants ---
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// --- Computed ---
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= currentYear - 100; year--) {
    years.push(year);
  }
  return years;
});

const isStep1Valid = computed(() => {
  return (
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.birthMonth &&
    formData.birthDay &&
    formData.birthYear &&
    !errors.name &&
    !errors.email &&
    !errors.birthDate
  );
});

const isStep2Valid = computed(() => {
  return (
    formData.username.trim().length >= 3 &&
    formData.password.trim().length >= 8 &&
    /[a-z]/.test(formData.password) &&
    /[A-Z]/.test(formData.password) &&
    /\d/.test(formData.password) &&
    !errors.username &&
    !errors.password
  );
});

// --- Helper Methods ---
const clearFieldError = (fieldName: FieldName): void => {
  errors[fieldName] = "";
};

const getFieldClasses = (fieldName: FieldName): string => {
  const baseClasses = "border-gray-600 focus:border-blue-500";
  const errorClasses = "border-red-500";
  const focusClasses = "border-blue-500";

  if (errors[fieldName]) {
    return errorClasses;
  }

  if (focusedField.value === fieldName) {
    return focusClasses;
  }

  // Show blue border if field has content
  if (fieldName !== "birthDate" && formData[fieldName as keyof AccountData]?.toString().trim()) {
    return focusClasses;
  }

  return baseClasses;
};

// --- Validation Methods ---
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateAge = (year: string, month: string, day: string): boolean => {
  const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13;
  }
  return age >= 13;
};

const validateField = (fieldName: FieldName): boolean => {
  switch (fieldName) {
    case "name":
      if (!formData.name.trim()) {
        errors.name = "Name is required";
        return false;
      }
      if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
        return false;
      }
      errors.name = "";
      return true;

    case "email":
      if (!formData.email.trim()) {
        errors.email = "Email is required";
        return false;
      }
      if (!validateEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
        return false;
      }
      errors.email = "";
      return true;

    case "birthDate":
      if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
        errors.birthDate = "Please select your complete birth date";
        return false;
      }
      if (!validateAge(formData.birthYear, formData.birthMonth, formData.birthDay)) {
        errors.birthDate = "You must be at least 13 years old to create an account";
        return false;
      }
      errors.birthDate = "";
      return true;

    case "username":
      if (!formData.username.trim()) {
        errors.username = "Username is required";
        return false;
      }
      if (formData.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters";
        return false;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = "Username can only contain letters, numbers, and underscores";
        return false;
      }
      errors.username = "";
      return true;

    case "password":
      if (!formData.password.trim()) {
        errors.password = "Password is required";
        return false;
      }
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
        return false;
      }
      if (!/[a-z]/.test(formData.password)) {
        errors.password = "Password must contain at least one lowercase letter";
        return false;
      }
      if (!/[A-Z]/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter";
        return false;
      }
      if (!/\d/.test(formData.password)) {
        errors.password = "Password must contain at least one number";
        return false;
      }
      errors.password = "";
      return true;

    default:
      return true;
  }
};

// --- Form Methods ---
const clearForm = (): void => {
  Object.assign(formData, {
    name: "",
    email: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    username: "",
    password: "",
  });

  Object.assign(errors, {
    name: "",
    email: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    birthDate: "",
    username: "",
    password: "",
  });

  currentStep.value = 1;
  focusedField.value = "";
};

const closeModal = (): void => {
  emit("close");
  clearForm();
};

const handleNextStep = (): void => {
  // Validate all step 1 fields
  const nameValid = validateField("name");
  const emailValid = validateField("email");
  const birthDateValid = validateField("birthDate");

  if (nameValid && emailValid && birthDateValid) {
    currentStep.value = 2;
  }
};

const handleBackStep = (): void => {
  currentStep.value = 1;
};

const handleCreateAccount = async (): Promise<void> => {
  // Clear any existing errors
  Object.keys(errors).forEach(key => {
    errors[key as FieldName] = "";
  });

  // Validate all fields before submission
  const validations = [
    validateField("name"),
    validateField("email"),
    validateField("birthDate"),
    validateField("username"),
    validateField("password"),
  ];

  // If any validation fails, don't proceed
  if (!validations.every(Boolean)) {
    toast.error("Please fix the errors above before continuing.");
    return;
  }

  try {
    // Validate date is not in the future
    const birthDate = new Date(
      parseInt(formData.birthYear),
      parseInt(formData.birthMonth) - 1,
      parseInt(formData.birthDay)
    );

    if (birthDate > new Date()) {
      errors.birthDate = "Birth date cannot be in the future";
      currentStep.value = 1; // Go back to step 1 to show the error
      return;
    }

    // Create the account data with proper formatting
    const accountData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      username: formData.username.trim().toLowerCase(),
      password: formData.password,
      birthMonth: formData.birthMonth,
      birthDay: formData.birthDay,
      birthYear: formData.birthYear,
    };

    await register(accountData);

    toast.success("Account created successfully! Welcome to X.");
  
    closeModal();
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle specific validation errors from server
    if (error?.data && Array.isArray(error.data)) {
      // Handle Zod validation errors
      error.data.forEach((validationError: any) => {
        const field = validationError.path?.[0];
        if (field && field in errors) {
          errors[field as FieldName] = validationError.message;
        }
      });

      // If there are birth date errors, go back to step 1
      if (errors.birthDate) {
        currentStep.value = 1;
      }

      toast.error("Please fix the validation errors and try again.");
    } else if (error?.statusCode === 409) {
      // Handle duplicate user errors
      const message = error.statusMessage || "User already exists";
      if (message.toLowerCase().includes("email")) {
        errors.email = "An account with this email already exists";
        currentStep.value = 1;
      } else if (message.toLowerCase().includes("username")) {
        errors.username = "This username is already taken";
      }
      toast.error("Account already exists with these details.");
    } else {
      // Handle other errors
      const message = error?.statusMessage || error?.message || "Failed to create account";
      toast.error(message);
    }
  }
};
</script>
