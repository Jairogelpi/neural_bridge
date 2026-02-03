/**
 * DESIGN TOKENS 🎨
 * 
 * Single source of truth for all design values
 * Glassmorphism + modern aesthetic
 */

export const tokens = {
    // ═══════════════════════════════════════════════════════════
    // COLORS
    // ═══════════════════════════════════════════════════════════
    colors: {
        // Primary brand (purple/indigo)
        primary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
        },

        // Accent (electric blue)
        accent: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },

        // Success (green)
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            700: '#15803d',
        },

        // Warning (amber)
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            700: '#b45309',
        },

        // Error (red)
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            700: '#b91c1c',
        },

        // Neutral (gray)
        gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
        },

        // Glass effects
        glass: {
            light: 'rgba(255, 255, 255, 0.7)',
            lightHover: 'rgba(255, 255, 255, 0.85)',
            dark: 'rgba(0, 0, 0, 0.3)',
            darkHover: 'rgba(0, 0, 0, 0.4)',
            border: 'rgba(255, 255, 255, 0.2)',
        },

        // Gradients
        gradients: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            accent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            success: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            ocean: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            cosmic: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        },
    },

    // ═══════════════════════════════════════════════════════════
    // TYPOGRAPHY
    // ═══════════════════════════════════════════════════════════
    typography: {
        fontFamily: {
            sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
        },

        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem',    // 48px
        },

        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            black: '900',
        },

        lineHeight: {
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75',
        },
    },

    // ═══════════════════════════════════════════════════════════
    // SPACING
    // ═══════════════════════════════════════════════════════════
    spacing: {
        0: '0',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        24: '6rem',    // 96px
    },

    // ═══════════════════════════════════════════════════════════
    // SHADOWS
    // ═══════════════════════════════════════════════════════════
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

        // Glass effects
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        glowPrimary: '0 0 20px rgba(139, 92, 246, 0.3)',
        glowAccent: '0 0 20px rgba(59, 130, 246, 0.3)',
    },

    // ═══════════════════════════════════════════════════════════
    // BORDERS
    // ═══════════════════════════════════════════════════════════
    borderRadius: {
        none: '0',
        sm: '0.25rem',   // 4px
        base: '0.5rem',  // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
        '2xl': '2rem',   // 32px
        full: '9999px',
    },

    borderWidth: {
        0: '0',
        1: '1px',
        2: '2px',
        4: '4px',
    },

    // ═══════════════════════════════════════════════════════════
    // ANIMATIONS
    // ═══════════════════════════════════════════════════════════
    animations: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },

        easing: {
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
    },

    // ═══════════════════════════════════════════════════════════
    // BACKDROP BLUR
    // ═══════════════════════════════════════════════════════════
    blur: {
        none: '0',
        sm: '4px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
    },

    // ═══════════════════════════════════════════════════════════
    // Z-INDEX
    // ═══════════════════════════════════════════════════════════
    zIndex: {
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        dropdown: '1000',
        sticky: '1100',
        fixed: '1200',
        modalBackdrop: '1300',
        modal: '1400',
        popover: '1500',
        tooltip: '1600',
    },
};

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const glassmorphism = (opacity = 0.7) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${tokens.blur.xl}) saturate(180%)`,
    WebkitBackdropFilter: `blur(${tokens.blur.xl}) saturate(180%)`,
    border: `1px solid ${tokens.colors.glass.border}`,
});

export const glassCard = () => ({
    ...glassmorphism(0.7),
    borderRadius: tokens.borderRadius['2xl'],
    boxShadow: tokens.shadows.glass,
});

export const gradient = (type: keyof typeof tokens.colors.gradients) => ({
    background: tokens.colors.gradients[type],
});
