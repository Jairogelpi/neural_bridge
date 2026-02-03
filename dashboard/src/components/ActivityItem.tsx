import { motion } from 'framer-motion';
import { Activity, Database, Shield, Zap } from 'lucide-react';

interface ActivityItemProps {
    type: string;
    message: string;
    timestamp: string;
    severity: string;
}

export function ActivityItem({ type, message, timestamp, severity }: ActivityItemProps) {
    const isCritical = severity === 'critical';

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            layout
            className={`group flex items-start space-x-4 p-4 rounded-2xl border ${isCritical ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'} hover:border-gray-200 transition-all`}
        >
            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${isCritical ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'} transition-colors`}>
                {type === 'crystal' ? <Database size={14} /> :
                    type === 'security' ? <Shield size={14} /> :
                        <Activity size={14} />}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-600' : 'text-blue-600'}`}>
                        {type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 font-mono">
                        {new Date(timestamp).toLocaleTimeString()}
                    </span>
                </div>
                <p className={`text-xs font-medium leading-relaxed ${isCritical ? 'text-red-800' : 'text-gray-600'}`}>
                    {message}
                </p>
            </div>
        </motion.div>
    );
}
