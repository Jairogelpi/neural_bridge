'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    r: number;
    type: 'concept' | 'entity' | 'error';
    vx: number;
    vy: number;
}

interface Link {
    source: string;
    target: string;
    strength: number;
}

interface HyperGraphProps {
    nodes: any[];
    links: any[];
    isProcessing: boolean;
}

export default function HyperGraph({ nodes: initialNodes, links: initialLinks, isProcessing }: HyperGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const requestRef = useRef<number>();

    // Sync initial nodes and links
    useEffect(() => {
        const mappedNodes: Node[] = initialNodes.map(n => ({
            ...n,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            x: n.x * 5 + 50, // Scale to canvas space
            y: n.y * 5 + 50
        }));
        setNodes(mappedNodes);
        setLinks(initialLinks);
    }, [initialNodes, initialLinks]);

    const animate = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear with slight trail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;

        // Physics update
        setNodes(prevNodes => {
            const nextNodes = prevNodes.map(node => {
                let nextNode = { ...node };

                // 1. Force towards center
                nextNode.vx += (width / 2 - node.x) * 0.001;
                nextNode.vy += (height / 2 - node.y) * 0.001;

                // 2. Repulsion from other nodes
                prevNodes.forEach(other => {
                    if (other.id === node.id) return;
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = 100 / (dist * dist + 10);
                    nextNode.vx -= (dx / dist) * force;
                    nextNode.vy -= (dy / dist) * force;
                });

                // 3. Link constraint (attraction)
                links.forEach(link => {
                    if (link.source === node.id || link.target === node.id) {
                        const otherId = link.source === node.id ? link.target : link.source;
                        const other = prevNodes.find(n => n.id === otherId);
                        if (other) {
                            const dx = other.x - node.x;
                            const dy = other.y - node.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const force = (dist - 100) * 0.01 * link.strength;
                            nextNode.vx += (dx / dist) * force;
                            nextNode.vy += (dy / dist) * force;
                        }
                    }
                });

                // Apply velocity and damping
                nextNode.x += nextNode.vx;
                nextNode.y += nextNode.vy;
                nextNode.vx *= 0.9;
                nextNode.vy *= 0.9;

                // Bounds
                if (nextNode.x < 50) nextNode.x = 50;
                if (nextNode.x > width - 50) nextNode.x = width - 50;
                if (nextNode.y < 50) nextNode.y = 50;
                if (nextNode.y > height - 50) nextNode.y = height - 50;

                return nextNode;
            });

            // 4. Draw Links
            links.forEach(link => {
                const s = nextNodes.find(n => n.id === link.source);
                const t = nextNodes.find(n => n.id === link.target);
                if (s && t) {
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(t.x, t.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + link.strength * 0.2})`;
                    ctx.lineWidth = isProcessing ? 0.5 : 1;
                    ctx.stroke();

                    // Glow effect during processing
                    if (isProcessing && Math.random() > 0.95) {
                        ctx.beginPath();
                        ctx.arc(s.x + (t.x - s.x) * Math.random(), s.y + (t.y - s.y) * Math.random(), 1, 0, Math.PI * 2);
                        ctx.fillStyle = '#6366f1';
                        ctx.fill();
                    }
                }
            });

            // 5. Draw Nodes
            nextNodes.forEach(node => {
                const isError = node.type === 'error';

                // Shadow/Glow
                ctx.shadowBlur = isProcessing ? 15 : 5;
                ctx.shadowColor = isError ? '#f43f5e' : '#6366f1';

                // Node Body
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r + (isProcessing ? Math.sin(time / 100) * 1 : 0), 0, Math.PI * 2);
                ctx.fillStyle = isError ? '#e11d48' : '#4f46e5';
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.shadowBlur = 0; // Reset shadow

                // Label
                ctx.fillStyle = '#1e293b';
                ctx.font = `bold ${isProcessing ? '10px' : '12px'} Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y - node.r - 8);
            });

            return nextNodes;
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            style={{ touchAction: 'none' }}
        />
    );
}
