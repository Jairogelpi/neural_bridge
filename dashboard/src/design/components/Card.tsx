/**
 * CARD COMPONENT 🃏
 * 
 * Glassmorphism card with hover effects
 */

'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
    hover?: boolean;
    children: ReactNode;
}

export function Card({
    glass = true,
    hover = true,
    children,
    className = '',
    ...props
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -4, scale: 1.01 } : {}}
            className={`
                ${glass
                    ? 'bg-white/70 backdrop-blur-xl border border-white/20'
                    : 'bg-white border border-gray-200'
                }
                ${className}
                rounded-2xl shadow-xl
                transition-all duration-300
                ${hover ? 'hover:shadow-2xl' : ''}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`p-6 border-b border-gray-100/50 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`p-6 border-t border-gray-100/50 ${className}`}>
            {children}
        </div>
    );
}
