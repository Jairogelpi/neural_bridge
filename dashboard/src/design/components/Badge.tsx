/**
 * BADGE COMPONENT 🏷️
 * 
 * Colorful badges for tags, status, etc.
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray';

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-purple-100 text-purple-700 ring-purple-500/20',
    success: 'bg-green-100 text-green-700 ring-green-500/20',
    warning: 'bg-amber-100 text-amber-700 ring-amber-500/20',
    error: 'bg-red-100 text-red-700 ring-red-500/20',
    gray: 'bg-gray-100 text-gray-700 ring-gray-500/20',
};

export function Badge({
    variant = 'gray',
    children,
    className = ''
}: BadgeProps) {
    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
                ${variantStyles[variant]}
                ${className}
                inline-flex items-center gap-1.5
                px-2.5 py-0.5
                text-xs font-medium
                rounded-full
                ring-1 ring-inset
            `}
        >
            {children}
        </motion.span>
    );
}
