/**
 * MOBILE NAVIGATION 📱
 * 
 * Bottom navigation bar for mobile devices
 */

'use client';

import { Home, Sparkles, Users, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function MobileNav() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Sparkles, label: 'Cortex', path: '/cortex' },
        { icon: Users, label: 'Collab', path: '/crystals' },
        { icon: Menu, label: 'More', path: '/settings' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200 pb-safe">
            <div className="flex items-center justify-around px-4 py-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <motion.button
                            key={item.path}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push(item.path)}
                            className={`
                                flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                                transition-all duration-200
                                ${isActive
                                    ? 'text-purple-600'
                                    : 'text-gray-600'
                                }
                            `}
                        >
                            <Icon
                                size={24}
                                className={isActive ? 'fill-purple-100' : ''}
                            />
                            <span className="text-xs font-medium">
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute bottom-0 w-12 h-1 bg-purple-600 rounded-t-full"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
