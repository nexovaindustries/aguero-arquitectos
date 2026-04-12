tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "on-primary-fixed-variant": "#474747",
                "on-primary-fixed": "#1b1b1b",
                "on-secondary": "#ffffff",
                "secondary-fixed": "#e6e1e1",
                "surface-container-low": "#f7f3f2",
                "primary-fixed": "#e2e2e2",
                "tertiary-fixed-dim": "#c7c6c6",
                "surface-container": "#f1edec",
                "on-surface": "#1c1b1b",
                "error-container": "#ffdad6",
                "primary-container": "#1b1b1b",
                "tertiary-fixed": "#e3e2e2",
                "surface-container-highest": "#e6e1e1",
                "tertiary": "#000000",
                "on-secondary-fixed": "#1c1b1b",
                "on-primary-container": "#848484",
                "on-secondary-container": "#666464",
                "tertiary-container": "#1b1c1c",
                "inverse-primary": "#c6c6c6",
                "surface": "#fdf8f8",
                "secondary-container": "#e6e1e1",
                "on-primary": "#ffffff",
                "secondary-fixed-dim": "#c9c6c5",
                "inverse-surface": "#313030",
                "surface-variant": "#e6e1e1",
                "on-tertiary-fixed-variant": "#464747",
                "secondary": "#605e5e",
                "on-tertiary": "#ffffff",
                "primary": "#000000",
                "inverse-on-surface": "#f4f0ef",
                "on-error": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "surface-dim": "#ddd9d9",
                "on-secondary-fixed-variant": "#484646",
                "on-background": "#1c1b1b",
                "background": "#fdf8f8",
                "surface-bright": "#fdf8f8",
                "error": "#ba1a1a",
                "outline": "#7e7576",
                "surface-container-high": "#ebe7e7",
                "primary-fixed-dim": "#c6c6c6",
                "outline-variant": "#cfc4c5",
                "on-tertiary-fixed": "#1b1c1c",
                "on-tertiary-container": "#848484",
                "surface-tint": "#5e5e5e",
                "on-surface-variant": "#4c4546",
                "on-error-container": "#93000a"
            },
            "borderRadius": {
                "DEFAULT": "0px",
                "lg": "0px",
                "xl": "0px",
                "full": "9999px"
            },
            "fontFamily": {
                "headline": ["Manrope", "sans-serif"],
                "body": ["Inter", "sans-serif"],
                "label": ["Inter", "sans-serif"]
            },
            "animation": {
                "fade-in-up": "titleReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                "title-reveal": "titleReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                "body-fade": "bodyFade 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
                "fade-in": "fadeIn 1s ease-out forwards"
            },
            "keyframes": {
                titleReveal: {
                    "0%": { opacity: 0, transform: "translateY(40px) scale(0.98)", filter: "blur(8px)" },
                    "100%": { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }
                },
                bodyFade: {
                    "0%": { opacity: 0, transform: "translateY(15px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" }
                },
                fadeInUp: {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" }
                },
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 }
                }
            }
        }
    }
}
