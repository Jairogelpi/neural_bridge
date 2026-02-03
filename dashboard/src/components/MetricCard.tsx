import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    color?: 'blue' | 'cyan' | 'purple' | 'indigo';
}

export function MetricCard({ label, value, subValue, icon: Icon, color = 'blue' }: MetricCardProps) {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        cyan: 'text-cyan-600 bg-cyan-50',
        purple: 'text-purple-600 bg-purple-50',
        indigo: 'text-indigo-600 bg-indigo-50',
    };

    return (
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
                {subValue && (
                    <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded-full uppercase tracking-wider">
                        {subValue}
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</h3>
                <p className="text-4xl font-black italic tracking-tighter text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all">
                    {value}
                </p>
            </div>
        </div>
    );
}
