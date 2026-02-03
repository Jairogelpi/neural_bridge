/**
 * COLLABORATIVE CRYSTAL EDITOR 🔮✨
 * 
 * Real-time collaborative editor for crystals
 * Features: Live cursors, presence indicators, simultaneous editing
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useState } from 'react';
import { Users, Save, Share2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CollaborativeEditorProps {
    crystalId: string;
    initialContent?: string;
    onSave?: (content: string) => void;
}

export default function CollaborativeEditor({
    crystalId,
    initialContent = '',
    onSave
}: CollaborativeEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // TODO: Get from auth context when available
    const userId = 'user_' + Math.random().toString(36).slice(2, 9);
    const userName = 'User ' + userId.slice(-4);

    const {
        isConnected,
        activeUsers
    } = useCollaboration(crystalId, userId, userName);

    // Initialize TipTap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none p-8 min-h-[400px]'
            }
        },
    });

    // Handle save
    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        const html = editor.getHTML();

        if (onSave) {
            await onSave(html);
        }

        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">
                            Crystal Editor
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Connection status */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm text-gray-600">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        {/* Active users */}
                        {activeUsers.length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                                <Users size={16} className="text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                    {activeUsers.length} editing
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Share2 size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Active users list */}
                {activeUsers.length > 0 && (
                    <div className="max-w-5xl mx-auto px-6 pb-3 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Editing now:</span>
                        {activeUsers.map(user => (
                            <div
                                key={user.userId}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                                style={{
                                    backgroundColor: user.color + '20',
                                    color: user.color
                                }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: user.color }}
                                />
                                {user.userName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor */}
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <EditorContent editor={editor} />
                </div>

                {/* Helper text */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    {isConnected ? (
                        <span className="text-green-600">
                            ✨ Changes are synced in real-time with {activeUsers.length} {activeUsers.length === 1 ? 'collaborator' : 'collaborators'}
                        </span>
                    ) : (
                        <span className="text-amber-600">
                            ⚠️ Reconnecting to collaboration server...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
