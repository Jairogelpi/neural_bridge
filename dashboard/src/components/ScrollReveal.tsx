"use client";

import { motion, Variants, useReducedMotion } from 'framer-motion';
import { ReactNode, memo } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    once?: boolean;
}

// Optimized: Pre-computed variants for better performance
const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    none: { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }
};

// Optimized easing - faster and smoother (cubic-bezier)
const easing: [number, number, number, number] = [0.22, 0.03, 0.26, 1];

export const ScrollReveal = memo(function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.5,
    once = true
}: ScrollRevealProps) {
    const prefersReducedMotion = useReducedMotion();
    const v = variants[direction];

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-50px", amount: 0.1 }}
            variants={{
                hidden: v.hidden,
                visible: {
                    ...v.visible,
                    transition: { duration, delay, ease: easing }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
});

// Optimized stagger container
export const ScrollRevealStagger = memo(function ScrollRevealStagger({
    children,
    className = '',
    staggerDelay = 0.08
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px", amount: 0.1 }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
});

// Optimized stagger item
export const ScrollRevealItem = memo(function ScrollRevealItem({
    children,
    className = ''
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: easing }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
});
