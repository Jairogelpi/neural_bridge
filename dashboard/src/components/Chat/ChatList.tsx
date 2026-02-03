"use client";

import { MessageSquarePlus, Trash2 } from 'lucide-react';

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: number;
}

interface ChatListProps {
    sessions: ChatSession[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export function ChatList({ sessions, activeId, onSelect, onCreate, onDelete }: ChatListProps) {
    return (
        <div className="w-64 border-r border-gray-100 bg-gray-50/50 flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100">
                <button
                    onClick={onCreate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-lg shadow-black/5 active:scale-95"
                >
                    <MessageSquarePlus size={16} />
                    <span>New Session</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs px-4">
                        No active sessions. Start a new neural dialogue.
                    </div>
                )}
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => onSelect(session.id)}
                        className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${activeId === session.id
                            ? 'bg-white border-blue-100 shadow-sm'
                            : 'hover:bg-gray-100 border-transparent'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activeId === session.id ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-xs font-bold truncate ${activeId === session.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {session.title || 'Untitled Session'}
                                </h3>
                                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                    {session.lastMessage || 'No messages yet'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => onDelete(session.id, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
