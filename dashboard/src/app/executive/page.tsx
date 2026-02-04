"use client";

import { Sidebar } from '@/components/Sidebar';
import { ExecutiveControl } from '@/components/ExecutiveControl';

export default function ExecutivePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12">
                <ExecutiveControl />
            </main>
        </div>
    );
}
