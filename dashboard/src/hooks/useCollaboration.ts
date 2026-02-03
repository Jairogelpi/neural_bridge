/**
 * COLLABORATIVE EDITING HOOK 🤝
 * 
 * React hook for real-time collaborative editing
 * Manages WebSocket connection, Y.js doc, and editor state
 */

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
    userId: string;
    userName: string;
    color: string;
    cursor?: {
        line: number;
        column: number;
    };
}

interface CollabState {
    isConnected: boolean;
    activeUsers: User[];
    currentUser: User | null;
}

export function useCollaboration(
    crystalId: string,
    userId: string,
    userName: string
) {
    const [state, setState] = useState<CollabState>({
        isConnected: false,
        activeUsers: [],
        currentUser: null
    });

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
            path: '/ws',
            transports: ['websocket']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Collab] Connected to WebSocket');

            // Identify user
            socket.emit('user:identify', userId);

            // Join crystal editing session
            socket.emit('collab:join', {
                crystalId,
                userId,
                userName
            });
        });

        // Initialize with current state
        socket.on('collab:init', (data: {
            content: string;
            presence: User;
            users: User[];
        }) => {
            setState({
                isConnected: true,
                activeUsers: data.users,
                currentUser: data.presence
            });

            console.log('[Collab] Session initialized', data);
        });

        // User joined
        socket.on('collab:user:joined', (data: { user: User; totalUsers: number }) => {
            setState(prev => ({
                ...prev,
                activeUsers: [...prev.activeUsers, data.user]
            }));

            console.log('[Collab] User joined:', data.user.userName);
        });

        // User left
        socket.on('collab:user:left', (data: { userId: string; totalUsers: number }) => {
            setState(prev => ({
                ...prev,
                activeUsers: prev.activeUsers.filter(u => u.userId !== data.userId)
            }));

            console.log('[Collab] User left:', data.userId);
        });

        // Receive operation from other users
        socket.on('collab:operation', (data: { operation: any; timestamp: number }) => {
            // Operation will be applied by TipTap/Y.js automatically
            console.log('[Collab] Operation received', data);
        });

        // Receive cursor update
        socket.on('collab:cursor', (data: {
            userId: string;
            cursor: { line: number; column: number };
        }) => {
            setState(prev => ({
                ...prev,
                activeUsers: prev.activeUsers.map(user =>
                    user.userId === data.userId
                        ? { ...user, cursor: data.cursor }
                        : user
                )
            }));
        });

        socket.on('disconnect', () => {
            console.log('[Collab] Disconnected from WebSocket');
            setState(prev => ({ ...prev, isConnected: false }));
        });

        // Cleanup
        return () => {
            socket.emit('collab:leave', { crystalId, userId });
            socket.disconnect();
        };
    }, [crystalId, userId, userName]);

    // Send edit operation
    const sendOperation = (operation: any) => {
        if (socketRef.current) {
            socketRef.current.emit('collab:edit', {
                crystalId,
                operation
            });
        }
    };

    // Send cursor position
    const sendCursor = (cursor: { line: number; column: number }) => {
        if (socketRef.current) {
            socketRef.current.emit('collab:cursor', {
                crystalId,
                userId,
                cursor
            });
        }
    };

    // Send selection
    const sendSelection = (selection: { start: number; end: number }) => {
        if (socketRef.current) {
            socketRef.current.emit('collab:selection', {
                crystalId,
                userId,
                selection
            });
        }
    };

    return {
        ...state,
        sendOperation,
        sendCursor,
        sendSelection
    };
}
