// import type { Config } from "tailwindcss";

// const config = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         "in-active": "#545454",
//         connector: "#F0F1F6",
//         "keyword-yellow": "#E1CE26",
//         "keyword-purple": "#7C21D6",
//         "keyword-red": "#EB441F",
//         "keyword-green": "#2FE699",
//         "light-blue": "#3352CC",
//         "background-90": "#1D1D1D",
//         "background-80": "#252525",
//         "text-secondary": "#9B9CA0",
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         chart: {
//           "1": "hsl(var(--chart-1))",
//           "2": "hsl(var(--chart-2))",
//           "3": "hsl(var(--chart-3))",
//           "4": "hsl(var(--chart-4))",
//           "5": "hsl(var(--chart-5))",
//         },
//         sidebar: {
//           DEFAULT: "hsl(var(--sidebar-background))",
//           foreground: "hsl(var(--sidebar-foreground))",
//           primary: "hsl(var(--sidebar-primary))",
//           "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
//           accent: "hsl(var(--sidebar-accent))",
//           "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
//           border: "hsl(var(--sidebar-border))",
//           ring: "hsl(var(--sidebar-ring))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: {
//             height: "0",
//           },
//           to: {
//             height: "var(--radix-accordion-content-height)",
//           },
//         },
//         "accordion-up": {
//           from: {
//             height: "var(--radix-accordion-content-height)",
//           },
//           to: {
//             height: "0",
//           },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// } satisfies Config;

// export default config;






// import type { Config } from "tailwindcss";
// import tailwindScrollbar from 'tailwind-scrollbar';

// const config = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//     "*.{js,ts,jsx,tsx,mdx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         "in-active": "#545454",
//         connector: "#F0F1F6",
//         "keyword-yellow": "#E1CE26",
//         "keyword-purple": "#7C21D6",
//         "keyword-red": "#EB441F",
//         "keyword-green": "#2FE699",
//         "light-blue": "#3352CC",
//         "background-90": "#1D1D1D",
//         "background-80": "#252525",
//         "text-secondary": "#9B9CA0",
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         chart: {
//           "1": "hsl(var(--chart-1))",
//           "2": "hsl(var(--chart-2))",
//           "3": "hsl(var(--chart-3))",
//           "4": "hsl(var(--chart-4))",
//           "5": "hsl(var(--chart-5))",
//         },
//         sidebar: {
//           DEFAULT: "hsl(var(--sidebar-background))",
//           foreground: "hsl(var(--sidebar-foreground))",
//           primary: "hsl(var(--sidebar-primary))",
//           "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
//           accent: "hsl(var(--sidebar-accent))",
//           "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
//           border: "hsl(var(--sidebar-border))",
//           ring: "hsl(var(--sidebar-ring))",
//         },
//       },
      
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         'spin-slow': 'spin 2.5s linear infinite',
//       },
//       boxShadow: {
//         'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         'glow': '0 0 15px rgba(51, 82, 204, 0.3)',
//         'glow-hover': '0 0 20px rgba(51, 82, 204, 0.4)',
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate"), tailwindScrollbar],
// } satisfies Config;

// export default config;






// import type { Config } from "tailwindcss";
// import tailwindScrollbar from 'tailwind-scrollbar';

// const config = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//     "*.{js,ts,jsx,tsx,mdx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         // Original custom colors
//         "in-active": "#545454",
//         connector: "#F0F1F6",
//         "keyword-yellow": "#E1CE26",
//         "keyword-purple": "#7C21D6",
//         "keyword-red": "#EB441F",
//         "keyword-green": "#2FE699",
//         "light-blue": "#3352CC",
//         "background-90": "#1D1D1D",
//         "background-80": "#252525",
//         "text-secondary": "#9B9CA0",
        
//         // V4 accent colors (now accessible via Tailwind)
//         orange: "#ff6b35",
//         green: "#00d9a3",
//         red: "#ff3366",
//         yellow: "#ffd93d",
//         maroon: "#c1121f",
//         brown: "#a0522d",
//         purple: "#9d4edd",
        
//         // Design system colors
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         chart: {
//           "1": "hsl(var(--chart-1))",
//           "2": "hsl(var(--chart-2))",
//           "3": "hsl(var(--chart-3))",
//           "4": "hsl(var(--chart-4))",
//           "5": "hsl(var(--chart-5))",
//         },
//         sidebar: {
//           DEFAULT: "hsl(var(--sidebar-background))",
//           foreground: "hsl(var(--sidebar-foreground))",
//           primary: "hsl(var(--sidebar-primary))",
//           "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
//           accent: "hsl(var(--sidebar-accent))",
//           "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
//           border: "hsl(var(--sidebar-border))",
//           ring: "hsl(var(--sidebar-ring))",
//         },
//       },
      
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//         xl: "calc(var(--radius) + 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//         "fade-in-up": {
//           from: { opacity: "0", transform: "translateY(30px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-in": {
//           from: { opacity: "0" },
//           to: { opacity: "1" },
//         },
//         "slide-in-left": {
//           from: { opacity: "0", transform: "translateX(-50px)" },
//           to: { opacity: "1", transform: "translateX(0)" },
//         },
//         "slide-in-right": {
//           from: { opacity: "0", transform: "translateX(50px)" },
//           to: { opacity: "1", transform: "translateX(0)" },
//         },
//         "scale-in": {
//           from: { opacity: "0", transform: "scale(0.9)" },
//           to: { opacity: "1", transform: "scale(1)" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         "spin-slow": "spin 2.5s linear infinite",
//         "fade-in-up": "fade-in-up 0.6s ease-out",
//         "fade-in": "fade-in 0.6s ease-out",
//         "slide-in-left": "slide-in-left 0.6s ease-out",
//         "slide-in-right": "slide-in-right 0.6s ease-out",
//         "scale-in": "scale-in 0.6s ease-out",
//       },
//       boxShadow: {
//         'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         'glow': '0 0 15px rgba(51, 82, 204, 0.3)',
//         'glow-hover': '0 0 20px rgba(51, 82, 204, 0.4)',
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate"), tailwindScrollbar],
// } satisfies Config;

// export default config;

import type { Config } from "tailwindcss";
import tailwindScrollbar from 'tailwind-scrollbar';

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ============================================
        // LEGACY CUSTOM COLORS (Keep for backwards compatibility)
        // ============================================
        "in-active": "#545454",
        connector: "#F0F1F6",
        "keyword-yellow": "#E1CE26",
        "keyword-purple": "#7C21D6",
        "keyword-red": "#EB441F",
        "keyword-green": "#2FE699",
        "light-blue": "#3352CC",
        "background-90": "#1D1D1D",
        "background-80": "#252525",
        "text-secondary": "#9B9CA0",
        
        // ============================================
        // DASHBOARD COLORS (Orange accent only)
        // Use these for all dashboard UI elements
        // ============================================
        orange: "hsl(var(--dashboard-primary))", // Main dashboard accent
        
        // ============================================
        // LANDING PAGE COLORS (Multi-color palette)
        // Use these ONLY in landing page components
        // ============================================
        "landing-orange": "hsl(var(--landing-orange))",
        "landing-green": "hsl(var(--landing-green))",
        "landing-red": "hsl(var(--landing-red))",
        "landing-yellow": "hsl(var(--landing-yellow))",
        "landing-maroon": "hsl(var(--landing-maroon))",
        "landing-brown": "hsl(var(--landing-brown))",
        "landing-purple": "hsl(var(--landing-purple))",
        "landing-blue": "hsl(var(--landing-blue))",
        "landing-cyan": "hsl(var(--landing-cyan))",
        "landing-pink": "hsl(var(--landing-pink))",
        "landing-teal": "hsl(var(--landing-teal))",
        
        // ============================================
        // DESIGN SYSTEM COLORS (Shadcn/UI compatible)
        // These automatically use orange in dashboard context
        // ============================================
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Orange in dashboard
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Orange in dashboard
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 2.5s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        "scale-in": "scale-in 0.6s ease-out",
      },
      
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(255, 107, 53, 0.3)',
        'glow-hover': '0 0 20px rgba(255, 107, 53, 0.4)',
        // Landing page specific glows
        'landing-glow-blue': '0 0 15px rgba(59, 130, 246, 0.3)',
        'landing-glow-green': '0 0 15px rgba(16, 185, 129, 0.3)',
        'landing-glow-purple': '0 0 15px rgba(139, 92, 246, 0.3)',
        'landing-glow-pink': '0 0 15px rgba(236, 72, 153, 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), tailwindScrollbar],
} satisfies Config;

export default config;