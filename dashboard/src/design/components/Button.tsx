/**
 * BUTTON COMPONENT 🔘
 * 
 * Premium button with glassmorphism and animations
 */

'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { tokens } from '../tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    loading?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-gradient-to-r from-purple-600 to-indigo-600 
        text-white 
        hover:from-purple-700 hover:to-indigo-700
        shadow-lg shadow-purple-500/30
        hover:shadow-xl hover:shadow-purple-500/40
    `,
    secondary: `
        bg-gray-100 
        text-gray-900 
        hover:bg-gray-200
        border border-gray-200
    `,
    ghost: `
        bg-transparent 
        text-gray-700 
        hover:bg-gray-100
    `,
    glass: `
        bg-white/70 
        backdrop-blur-xl 
        border border-white/20
        text-gray-900
        hover:bg-white/85
        shadow-lg
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export function Button({
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
            className={`
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
                inline-flex items-center justify-center gap-2
                font-medium rounded-xl
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={16} />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </motion.button>
    );
}
