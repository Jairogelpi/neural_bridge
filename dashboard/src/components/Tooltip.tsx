"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    description?: string; // Additional detail for the "Real Data" explanation
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, description, side = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const variants = {
        hidden: { opacity: 0, scale: 0.9, y: side === 'top' ? 10 : -10 },
        visible: { opacity: 1, scale: 1, y: 0 }
    };

    const positionClasses = {
        top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2'
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={variants}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${positionClasses[side]} z-50 w-64 p-4 bg-gray-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-gray-800 pointer-events-none`}
                    >
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">{content}</div>
                        {description && (
                            <div className="text-[10px] text-gray-300 leading-relaxed font-medium">
                                {description}
                            </div>
                        )}
                        <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
