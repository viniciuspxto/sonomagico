import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary palette */
        deep: "var(--color-deep)",
        purple: "var(--color-purple)",
        violet: "var(--color-violet)",
        lavender: "var(--color-lavender)",
        "light-lavender": "var(--color-light-lavender)",

        /* Accent */
        "accent-gold": "var(--color-accent-gold)",
        "accent-orange": "var(--color-accent-orange)",
        "accent-teal": "var(--color-accent-teal)",
        star: "var(--color-star)",

        /* Semantic */
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        "card-hover": "var(--color-card-hover)",
        "card-border": "var(--color-card-border)",

        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-btn": "var(--color-primary-btn)",

        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",

        border: "var(--color-border)",

        free: "var(--color-free)",
        premium: "var(--color-premium)",

        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      borderRadius: {
        sharp: "var(--radius-sharp)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        card: "var(--radius-card)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};

export default config;
