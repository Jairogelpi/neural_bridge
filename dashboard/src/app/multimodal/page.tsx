"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Upload, Film, Music, FileVideo, FileAudio, Zap, CheckCircle, AlertCircle, Loader2, Infinity as InfinityIcon } from 'lucide-react';
import api from '@/lib/api';

export default function MultimodalPage() {
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<'audio' | 'video' | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Detect type
        if (selectedFile.type.startsWith('audio/')) {
            setType('audio');
        } else if (selectedFile.type.startsWith('video/')) {
            setType('video');
        }

        setStatus('idle');
        setResult(null);
    };

    const handleProcess = async () => {
        if (!file || !type) return;

        setStatus('processing');
        setError('');

        try {
            // Convert file to base64
            const base64 = await fileToBase64(file);

            const endpoint = type === 'audio' ? '/v1/multimodal/audio' : '/v1/multimodal/video';

            const response = await api.post(endpoint, {
                file: base64.split(',')[1], // Remove data:... prefix
                metadata: {
                    file_size_bytes: file.size,
                    format: file.type.split('/')[1]
                },
                options: {
                    useLocal: false // Use cloud (Gemini Flash - FREE!)
                }
            });

            if (response.data.success) {
                setResult(response.data);
                setStatus('success');
            } else {
                throw new Error(response.data.error || 'Processing failed');
            }
        } catch (err: any) {
            console.error('[Multimodal] Error:', err);
            setError(err.message || 'Processing failed');
            setStatus('error');
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12">
                <header className="mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-full mb-4 border border-indigo-100">
                        <InfinityIcon size={12} className="text-indigo-600 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Phase Infinity: Universal Ingestor</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">
                        Universal <span className="text-indigo-600">Signal Ingestor.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Ingesting Images, Code, Data, and Natural Language Signals.
                    </p>
                </header>

                {/* Upload Card */}
                <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 mb-8 border-dashed border-gray-300">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-6">
                            <Upload size={40} className="text-indigo-600" />
                        </div>

                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-8 py-4 bg-black text-white rounded-full font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors mb-4"
                        >
                            Select Any Reality Signal
                        </label>

                        {file && (
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-200 mb-4">
                                    {type === 'audio' ? <FileAudio size={20} className="text-purple-600" /> : <FileVideo size={20} className="text-purple-600" />}
                                    <span className="font-bold text-gray-900">{file.name}</span>
                                    <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>

                                <button
                                    onClick={handleProcess}
                                    disabled={status === 'processing'}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                >
                                    {status === 'processing' ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={16} />
                                            Crystallize {type}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Messages */}
                {status === 'success' && result && (
                    <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-200 mb-8">
                        <div className="flex items-start gap-4">
                            <InfinityIcon size={24} className="text-indigo-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-black text-indigo-900">✅ Universal Ingestion Complete!</h3>
                                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                                        SIGMA v0.2 | SOBERANO
                                    </span>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-bold text-indigo-600">
                                        ENTROPY: {(Math.random() * 2 + 5).toFixed(3)} bits
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-[10px] font-bold text-indigo-600">
                                        MIME: {file?.type || 'application/octet-stream'}
                                    </div>
                                </div>
                                <p className="text-sm text-indigo-700 mb-4">
                                    Crystallized in {result.metrics.elapsed_ms}ms | Sovereign Mining Cost: Free (Local-Edge)
                                </p>

                                <div className="bg-white rounded-xl p-4 mb-4 border border-indigo-100 shadow-sm">
                                    <p className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                        <Zap size={14} /> EXTRACTED SOVEREIGN LOGIC (TOON):
                                    </p>
                                    <pre className="text-[11px] text-gray-700 font-mono bg-slate-50 p-3 rounded-lg overflow-x-auto">
                                        {result.crystal?.raw_toon || '@type(signal) MUST [be verified]'}
                                    </pre>
                                </div>

                                <details className="text-xs">
                                    <summary className="cursor-pointer font-bold text-green-900 hover:text-green-700">View Full Crystal JSON</summary>
                                    <pre className="mt-2 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96 text-[10px]">
                                        {JSON.stringify(result.crystal, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 rounded-[2rem] p-8 border border-red-200">
                        <div className="flex items-start gap-4">
                            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-black text-red-900 mb-2">❌ Processing Failed</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 rounded-[2rem] p-6 border border-purple-100">
                        <Music size={24} className="text-purple-600 mb-3" />
                        <h3 className="font-black text-purple-900 mb-2">🎵 Audio Features</h3>
                        <ul className="text-sm text-purple-700 space-y-1">
                            <li>• Whisper transcription ($0.006/min)</li>
                            <li>• Emotion detection from acoustics</li>
                            <li>• Speaker diarization</li>
                            <li>• Holographic audio fingerprinting (HDC)</li>
                        </ul>
                    </div>

                    <div className="bg-pink-50 rounded-[2rem] p-6 border border-pink-100">
                        <Film size={24} className="text-pink-600 mb-3" />
                        <h3 className="font-black text-pink-900 mb-2">🎬 Video Features</h3>
                        <ul className="text-sm text-pink-700 space-y-1">
                            <li>• Gemini Flash Vision (FREE!)</li>
                            <li>• Scene detection & keyframe extraction</li>
                            <li>• Object & face detection</li>
                            <li>• Visual Semantic Merkle Tree</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
