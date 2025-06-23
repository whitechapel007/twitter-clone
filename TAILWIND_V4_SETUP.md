# Tailwind CSS v4 Configuration with Dark Mode

This project has been configured with Tailwind CSS v4 including custom breakpoints, color palette, and comprehensive dark mode support.

## Features

### Custom Breakpoints

- `xs`: 614px
- `sm`: 1002px
- `md`: 1022px
- `lg`: 1092px
- `xl`: 1280px

### Custom Color Palette

The `dim` color palette with values from 50-900:

- `dim-50`: #5f99f7
- `dim-100`: #5f99f7
- `dim-200`: #38444d
- `dim-300`: #202e3a
- `dim-400`: #253341
- `dim-500`: #5f99f7
- `dim-600`: #5f99f7
- `dim-700`: #192734
- `dim-800`: #162d40
- `dim-900`: #15202b

### Dark Mode Support

- **Automatic detection**: Respects system preference
- **Manual toggle**: Users can override system preference
- **Persistent**: Choice is saved in localStorage
- **Smooth transitions**: CSS transitions for mode switching

## Usage

### Using Custom Breakpoints

```html
<div class="xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
  Responsive text
</div>
```

### Using Custom Colors

```html
<div class="bg-dim-900 text-dim-100">Dark background with light text</div>
```

### Using Theme Utilities

```html
<!-- These automatically adapt to light/dark mode -->
<div class="bg-theme-primary text-theme-primary">
  Primary background and text
</div>

<div class="bg-theme-secondary text-theme-secondary">
  Secondary background and text
</div>

<div class="bg-theme-accent text-theme-accent">Accent background and text</div>
```

### Using Component Classes

```html
<!-- Pre-styled card component -->
<div class="card p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

<!-- Pre-styled buttons -->
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
```

### Dark Mode Toggle

```vue
<template>
  <DarkModeToggle />
</template>
```

## Icon Packages

The project uses **Heroicons** for clean, professional SVG icons that work perfectly with Tailwind CSS:

### Current Setup

```bash
npm install @heroicons/vue
```

### Usage in Components

```vue
<script setup>
import { SunIcon, MoonIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <SunIcon class="w-5 h-5" />
  <MoonIcon class="w-5 h-5" />
</template>
```

### Alternative Icon Packages

If you prefer other icon libraries, here are some popular options:

#### 1. Lucide Vue (Clean, minimal icons)

```bash
npm install lucide-vue-next
```

```vue
<script setup>
import { Sun, Moon } from "lucide-vue-next";
</script>
```

#### 2. Tabler Icons (Large collection)

```bash
npm install @tabler/icons-vue
```

```vue
<script setup>
import { IconSun, IconMoon } from "@tabler/icons-vue";
</script>
```

#### 3. Phosphor Icons (Flexible weights)

```bash
npm install @phosphor-icons/vue
```

```vue
<script setup>
import { PhSun, PhMoon } from "@phosphor-icons/vue";
</script>
```

### Dark Mode Composable

```vue
<script setup>
const { isDark, toggleDarkMode, setDarkMode } = useDarkMode();

// Check if dark mode is active
console.log(isDark.value);

// Toggle dark mode
toggleDarkMode();

// Set dark mode explicitly
setDarkMode(true); // or false
</script>
```

## Files Structure

```
├── assets/css/main.css          # Main CSS with @theme directive and custom styles
├── composables/useDarkMode.ts   # Dark mode composable
├── components/DarkModeToggle.vue # Dark mode toggle component
└── nuxt.config.ts              # Nuxt configuration with Tailwind v4 plugin
```

## Key Differences from Tailwind CSS v3

- **No config file needed**: Configuration is done directly in CSS using `@theme`
- **CSS-first approach**: All customization happens in your CSS file
- **Simplified setup**: Just `@import "tailwindcss"` and define your theme

## Theme Configuration

The `@theme` directive is used to define custom design tokens:

```css
@import "tailwindcss";

@theme {
  /* Custom Breakpoints */
  --breakpoint-xs: 614px;
  --breakpoint-sm: 1002px;
  --breakpoint-md: 1022px;
  --breakpoint-lg: 1092px;
  --breakpoint-xl: 1280px;

  /* Custom Colors */
  --color-dim-50: #5f99f7;
  --color-dim-100: #5f99f7;
  --color-dim-200: #38444d;
  /* ... more colors */
}
```

This automatically generates utility classes like:

- `xs:`, `sm:`, `md:`, `lg:`, `xl:` for responsive breakpoints
- `bg-dim-50`, `text-dim-200`, `border-dim-300` for colors

## CSS Variables

The configuration uses CSS custom properties for theming:

### Background Colors

- `--bg-primary`: Main background color
- `--bg-secondary`: Secondary background color
- `--bg-accent`: Accent background color

### Text Colors

- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-accent`: Accent text color

### Breakpoints

- `--breakpoint-xs`: 614px
- `--breakpoint-sm`: 1002px
- `--breakpoint-md`: 1022px
- `--breakpoint-lg`: 1092px
- `--breakpoint-xl`: 1280px

## Development

To test the configuration:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and test:
   - Responsive breakpoints by resizing the window
   - Dark mode toggle in the header
   - System preference detection
   - Color palette in the demo cards

## Customization

### Adding New Colors

Add new color variables in `assets/css/main.css`:

```css
:root {
  --color-brand-500: #your-color;
}

.dark {
  --color-brand-500: #your-dark-color;
}
```

### Adding New Breakpoints

Add new breakpoint variables:

```css
:root {
  --breakpoint-2xl: 1536px;
}
```

### Custom Components

Add new component classes in the `@layer components` section:

```css
@layer components {
  .my-component {
    @apply bg-theme-primary text-theme-primary p-4 rounded;
  }
}
```

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to system preference for older browsers
- Progressive enhancement for dark mode features
