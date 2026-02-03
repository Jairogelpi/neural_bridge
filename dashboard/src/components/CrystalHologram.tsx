"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CrystalHologramProps {
    tier?: 'community' | 'verified' | 'certified' | 'trusted' | 'sovereign';
    size?: 'sm' | 'md' | 'lg';
}

export function CrystalHologram({ tier = 'verified', size = 'md' }: CrystalHologramProps) {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-64 h-64'
    };

    const colorMap = {
        community: 'from-blue-400 to-cyan-300',
        verified: 'from-emerald-400 to-teal-300',
        certified: 'from-amber-400 to-orange-300',
        trusted: 'from-purple-400 to-fuchsia-300',
        sovereign: 'from-rose-500 to-indigo-500' // The "Titan" gradient
    };

    return (
        <div
            className={`relative perspective-1000 ${sizeClasses[size]}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{
                    rotateY: isHovered ? 180 : 0,
                    rotateX: isHovered ? 10 : 0
                }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Core Crystal Shape (Octahedron simulation via planes) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[tier]} opacity-30 blur-xl rounded-full animate-pulse`} />

                {/* Front Face */}
                <div className="absolute inset-0 border border-white/50 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center transform translate-z-10 shadow-lg shadow-white/20">
                    <div className="text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-white/50 mx-auto mb-2 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-black drop-shadow-md">
                            {tier}
                        </span>
                    </div>
                </div>

                {/* Internal Geometry (The "Brain") */}
                <div className="absolute inset-4 border border-white/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-8 border border-white/40 rounded-full animate-[spin_5s_linear_infinite_reverse]" />

                {/* Back Face (Data) */}
                <div className="absolute inset-0 border border-white/50 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center transform -translate-z-10 rotate-y-180 shadow-inner">
                    <div className="text-center p-2">
                        <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Truth Score</p>
                        <p className="text-2xl font-black text-white">99.9%</p>
                        <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                            <div className="w-[99%] h-full bg-green-400" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
