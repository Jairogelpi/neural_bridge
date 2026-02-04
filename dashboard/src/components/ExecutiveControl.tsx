"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Target, Play, Pause, CheckCircle, XCircle, Loader2, Infinity as InfinityIcon } from 'lucide-react';

interface MissionStep {
    id: string;
    description: string;
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'SKIPPED' | 'FAILED';
}

interface Mission {
    id: string;
    goal: string;
    status: 'PLANNING' | 'EXECUTING' | 'VERIFYING' | 'COMPLETE' | 'FAILED';
    steps: MissionStep[];
}

export function ExecutiveControl() {
    const [goal, setGoal] = useState('');
    const [activeMission, setActiveMission] = useState<Mission | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInitiateMission = async () => {
        if (!goal.trim()) return;
        setIsProcessing(true);

        // Mock mission initiation
        const mockMission: Mission = {
            id: `MISSION_${Date.now()}`,
            goal: goal,
            status: 'PLANNING',
            steps: [
                { id: 'STEP_1', description: 'Analyze goal intent...', status: 'PENDING' },
                { id: 'STEP_2', description: 'Query relevant crystals...', status: 'PENDING' },
                { id: 'STEP_3', description: 'Execute sovereign action...', status: 'PENDING' },
                { id: 'STEP_4', description: 'Verify axiomatic compliance...', status: 'PENDING' },
            ]
        };
        setActiveMission(mockMission);

        // Simulate execution
        for (let i = 0; i < mockMission.steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            mockMission.steps[i].status = 'SUCCESS';
            mockMission.status = 'EXECUTING';
            setActiveMission({ ...mockMission });
        }

        mockMission.status = 'COMPLETE';
        setActiveMission({ ...mockMission });
        setIsProcessing(false);
    };

    const getStepIcon = (status: MissionStep['status']) => {
        switch (status) {
            case 'PENDING': return <div className="w-3 h-3 rounded-full bg-slate-200" />;
            case 'RUNNING': return <Loader2 size={14} className="text-indigo-500 animate-spin" />;
            case 'SUCCESS': return <CheckCircle size={14} className="text-emerald-500" />;
            case 'FAILED': return <XCircle size={14} className="text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8">
            <header className="mb-8">
                <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-full mb-4 border border-indigo-100">
                    <InfinityIcon size={12} className="text-indigo-600 mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Phase Axiom: Sovereign Executive</span>
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                    Mission <span className="text-indigo-600">Control.</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    Define a goal. The AI acts autonomously.
                </p>
            </header>

            {/* Goal Input */}
            <div className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Enter a sovereign goal (e.g., 'Summarize and archive today's signals')"
                        className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <button
                        onClick={handleInitiateMission}
                        disabled={isProcessing || !goal.trim()}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        Execute
                    </button>
                </div>
            </div>

            {/* Active Mission */}
            <AnimatePresence>
                {activeMission && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-50 rounded-[1.5rem] p-6 border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Mission</p>
                                <h3 className="text-lg font-black text-slate-900 italic">"{activeMission.goal}"</h3>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeMission.status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-700' :
                                    activeMission.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                        'bg-indigo-100 text-indigo-700'
                                }`}>
                                {activeMission.status}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {activeMission.steps.map((step, idx) => (
                                <div key={step.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                    {getStepIcon(step.status)}
                                    <span className="text-sm font-medium text-slate-600">{step.description}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
