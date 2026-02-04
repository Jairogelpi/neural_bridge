"use client";

import { Sidebar } from '@/components/Sidebar';
import { SupremacyMetrics } from '@/components/SupremacyMetrics';

export default function SupremacyPage() {
    return (
        <div className="flex h-screen bg-slate-50/50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <SupremacyMetrics />
                </div>
            </main>
        </div>
    );
}
