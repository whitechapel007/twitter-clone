<template>
  <component :is="tag" :class="containerClasses" :aria-label="ariaLabel" v-bind="linkProps">
    <svg :viewBox="viewBox" :class="logoClasses" :style="logoStyles" fill="currentColor" role="img"
      :aria-hidden="!showText">
      <path :d="logoPath" />
    </svg>

    <span v-if="showText" :class="textClasses">
      {{ text }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

// --- Types ---
interface Props {
  /** Size of the logo */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | string;
  /** Color variant */
  variant?: "default" | "white" | "black" | "blue" | "custom";
  /** Custom color (when variant is 'custom') */
  color?: string;
  /** Whether to show text alongside logo */
  showText?: boolean;
  /** Text to display */
  text?: string;
  /** Whether logo should be clickable */
  clickable?: boolean;
  /** Link destination (when clickable) */
  to?: string;
  /** External link (when clickable) */
  href?: string;
  /** Custom CSS classes */
  class?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

// --- Props with defaults ---
const props = withDefaults(defineProps<Props>(), {
  size: "md",
  variant: "default",
  color: "",
  showText: false,
  text: "X",
  clickable: false,
  to: "/",
  href: "",
  class: "",
  ariaLabel: "X Logo",
});

// --- Computed ---
const tag = computed(() => {
  if (props.clickable) {
    return props.href ? "a" : "NuxtLink";
  }
  return "div";
});

const linkProps = computed(() => {
  if (!props.clickable) return {};

  if (props.href) {
    return {
      href: props.href,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return { to: props.to };
});

const containerClasses = computed(() => {
  const baseClasses = "inline-flex items-center gap-2";
  const clickableClasses = props.clickable
    ? "transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
    : "";

  return [baseClasses, clickableClasses, props.class].filter(Boolean).join(" ");
});

const sizeClasses = computed(() => {
  if (typeof props.size === "string" && !["xs", "sm", "md", "lg", "xl", "2xl"].includes(props.size)) {
    return ""; // Custom size will be handled by logoStyles
  }

  const sizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
    "2xl": "w-12 h-12",
  };

  return sizes[props.size as keyof typeof sizes] || sizes.md;
});

const colorClasses = computed(() => {
  if (props.variant === "custom") return "";

  const variants = {
    default: "text-white dark:text-black",
    white: "text-white dark:text-black",
    black: "text-black dark:text-white",
    blue: "text-blue-500 dark:text-white",
  };

  return variants[props.variant] || variants.default;
});

const logoClasses = computed(() => {
  return [sizeClasses.value, colorClasses.value, "flex-shrink-0"].filter(Boolean).join(" ");
});

const logoStyles = computed(() => {
  const styles: Record<string, string> = {};

  // Handle custom size
  if (typeof props.size === "string" && !["xs", "sm", "md", "lg", "xl", "2xl"].includes(props.size)) {
    styles.width = props.size;
    styles.height = props.size;
  }

  // Handle custom color
  if (props.variant === "custom" && props.color) {
    styles.color = props.color;
  }

  return styles;
});

const textClasses = computed(() => {
  const baseClasses = "font-bold tracking-tight";
  const sizeTextClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
  };

  const textSize = typeof props.size === "string" && sizeTextClasses[props.size as keyof typeof sizeTextClasses]
    ? sizeTextClasses[props.size as keyof typeof sizeTextClasses]
    : "text-lg";

  return [baseClasses, textSize, colorClasses.value].filter(Boolean).join(" ");
});

// X/Twitter logo path
const logoPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

const viewBox = "0 0 24 24";
</script>
