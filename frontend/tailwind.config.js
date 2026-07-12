/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "error": "#ffb4ab",
        "tertiary-container": "#2ab4e7",
        "background": "#10131a",
        "secondary-container": "#444955",
        "surface-bright": "#363940",
        "surface-container-low": "#191c22",
        "primary-fixed": "#ffdcbc",
        "border-subtle": "#2A303C",
        "on-secondary-fixed-variant": "#424753",
        "on-surface-variant": "#d8c3b0",
        "primary": "#ffb86b",
        "on-primary": "#492900",
        "on-tertiary-container": "#004258",
        "on-primary-fixed-variant": "#683d00",
        "tertiary-fixed-dim": "#70d2ff",
        "on-tertiary-fixed-variant": "#004d66",
        "status-success": "#3ECF6E",
        "tertiary-fixed": "#c0e8ff",
        "secondary-fixed-dim": "#c2c6d5",
        "inverse-on-surface": "#2e3037",
        "surface-container": "#1d2026",
        "surface-container-high": "#272a31",
        "primary-container": "#e8952e",
        "inverse-primary": "#895100",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "on-primary-container": "#5a3400",
        "status-danger": "#E8544E",
        "secondary": "#c2c6d5",
        "on-secondary-fixed": "#171c26",
        "on-tertiary-fixed": "#001e2b",
        "surface-dim": "#10131a",
        "on-error": "#690005",
        "surface": "#10131a",
        "on-secondary-container": "#b4b8c7",
        "on-background": "#e1e2eb",
        "outline": "#a08d7c",
        "inverse-surface": "#e1e2eb",
        "bg-surface": "#141821",
        "surface-container-lowest": "#0b0e14",
        "primary-fixed-dim": "#ffb86b",
        "tertiary": "#70d2ff",
        "on-secondary": "#2b303c",
        "on-tertiary": "#003547",
        "status-info": "#3B9CE8",
        "secondary-fixed": "#dee2f1",
        "surface-tint": "#ffb86b",
        "on-surface": "#e1e2eb",
        "surface-container-highest": "#32353c",
        "text-secondary": "#8A93A3",
        "outline-variant": "#534436",
        "on-primary-fixed": "#2c1700",
        "surface-variant": "#32353c"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "container-max": "1440px",
        "component-gap": "0.75rem",
        "margin-desktop": "1.5rem",
        "gutter": "1rem",
        "margin-mobile": "1rem"
      },
      "fontFamily": {
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "data-mono": ["Inter", "sans-serif"]
      },
      "fontSize": {
        "headline-lg": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "headline-md": ["20px", { "lineHeight": "28px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-lg-mobile": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "data-mono": ["13px", { "lineHeight": "18px", "fontWeight": "500" }]
      }
    }
  }
}
