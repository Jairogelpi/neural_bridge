/**
 * COLLABORATIVE EDITING SERVICE 🤝
 * 
 * Real-time collaborative editing using CRDT (Conflict-free Replicated Data Type)
 * Enables Google Docs-style simultaneous editing with live cursors and presence
 */

import { WebSocket } from 'ws';
import * as Y from 'yjs';

interface CollaborativeSession {
    doc: Y.Doc;
    users: Map<string, UserPresence>;
    lastUpdate: number;
}

interface UserPresence {
    userId: string;
    userName: string;
    color: string;
    cursor?: {
        line: number;
        column: number;
    };
    selection?: {
        start: number;
        end: number;
    };
    lastActive: number;
}

interface Operation {
    type: 'insert' | 'delete' | 'update';
    position: number;
    content?: string;
    length?: number;
    userId: string;
    timestamp: number;
}

export class CollaborationService {
    private static sessions = new Map<string, CollaborativeSession>();
    private static COLORS = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
    ];

    /**
     * Initialize a new collaborative session for a crystal
     */
    static initSession(crystalId: string): CollaborativeSession {
        if (this.sessions.has(crystalId)) {
            return this.sessions.get(crystalId)!;
        }

        const doc = new Y.Doc();
        const ytext = doc.getText('content');

        const session: CollaborativeSession = {
            doc,
            users: new Map(),
            lastUpdate: Date.now()
        };

        this.sessions.set(crystalId, session);
        console.log(`[Collab] Session initialized for crystal ${crystalId}`);

        return session;
    }

    /**
     * Add user to collaborative session
     */
    static joinSession(
        crystalId: string,
        userId: string,
        userName: string
    ): UserPresence {
        const session = this.initSession(crystalId);

        // Assign color
        const colorIndex = session.users.size % this.COLORS.length;
        const color = this.COLORS[colorIndex];

        const presence: UserPresence = {
            userId,
            userName,
            color,
            lastActive: Date.now()
        };

        session.users.set(userId, presence);
        console.log(`[Collab] User ${userName} joined crystal ${crystalId}`);

        return presence;
    }

    /**
     * Remove user from session
     */
    static leaveSession(crystalId: string, userId: string): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        session.users.delete(userId);
        console.log(`[Collab] User ${userId} left crystal ${crystalId}`);

        // Cleanup empty sessions after 5 minutes
        if (session.users.size === 0) {
            setTimeout(() => {
                const currentSession = this.sessions.get(crystalId);
                if (currentSession && currentSession.users.size === 0) {
                    this.sessions.delete(crystalId);
                    console.log(`[Collab] Session ${crystalId} cleaned up`);
                }
            }, 5 * 60 * 1000);
        }
    }

    /**
     * Apply operation to shared document
     */
    static applyOperation(crystalId: string, operation: Operation): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        const ytext = session.doc.getText('content');

        session.doc.transact(() => {
            switch (operation.type) {
                case 'insert':
                    if (operation.content) {
                        ytext.insert(operation.position, operation.content);
                    }
                    break;

                case 'delete':
                    if (operation.length) {
                        ytext.delete(operation.position, operation.length);
                    }
                    break;

                case 'update':
                    if (operation.length && operation.content) {
                        ytext.delete(operation.position, operation.length);
                        ytext.insert(operation.position, operation.content);
                    }
                    break;
            }
        });

        session.lastUpdate = Date.now();
    }

    /**
     * Update user cursor position
     */
    static updateCursor(
        crystalId: string,
        userId: string,
        cursor: { line: number; column: number }
    ): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        const user = session.users.get(userId);
        if (!user) return;

        user.cursor = cursor;
        user.lastActive = Date.now();
    }

    /**
     * Update user selection
     */
    static updateSelection(
        crystalId: string,
        userId: string,
        selection: { start: number; end: number }
    ): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        const user = session.users.get(userId);
        if (!user) return;

        user.selection = selection;
        user.lastActive = Date.now();
    }

    /**
     * Get all active users in a session
     */
    static getActiveUsers(crystalId: string): UserPresence[] {
        const session = this.sessions.get(crystalId);
        if (!session) return [];

        return Array.from(session.users.values());
    }

    /**
     * Get current document state
     */
    static getDocumentState(crystalId: string): string {
        const session = this.sessions.get(crystalId);
        if (!session) return '';

        const ytext = session.doc.getText('content');
        return ytext.toString();
    }

    /**
     * Set initial document content
     */
    static setInitialContent(crystalId: string, content: string): void {
        const session = this.initSession(crystalId);
        const ytext = session.doc.getText('content');

        session.doc.transact(() => {
            ytext.delete(0, ytext.length);
            ytext.insert(0, content);
        });
    }

    /**
     * Get session statistics
     */
    static getSessionStats(crystalId: string) {
        const session = this.sessions.get(crystalId);
        if (!session) return null;

        return {
            activeUsers: session.users.size,
            lastUpdate: session.lastUpdate,
            documentLength: session.doc.getText('content').length,
            users: this.getActiveUsers(crystalId)
        };
    }

    /**
     * Broadcast change to all users except sender
     */
    static broadcastChange(
        crystalId: string,
        operation: Operation,
        sockets: Map<string, WebSocket>
    ): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        const message = JSON.stringify({
            type: 'operation',
            crystalId,
            operation
        });

        // Send to all users except the one who made the change
        session.users.forEach((user, userId) => {
            if (userId !== operation.userId) {
                const socket = sockets.get(userId);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(message);
                }
            }
        });
    }

    /**
     * Broadcast cursor position to all users
     */
    static broadcastCursor(
        crystalId: string,
        userId: string,
        cursor: { line: number; column: number },
        sockets: Map<string, WebSocket>
    ): void {
        const session = this.sessions.get(crystalId);
        if (!session) return;

        const user = session.users.get(userId);
        if (!user) return;

        const message = JSON.stringify({
            type: 'cursor',
            crystalId,
            userId,
            userName: user.userName,
            color: user.color,
            cursor
        });

        // Send to all users except sender
        session.users.forEach((_, targetUserId) => {
            if (targetUserId !== userId) {
                const socket = sockets.get(targetUserId);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(message);
                }
            }
        });
    }

    /**
     * Broadcast presence update (user joined/left)
     */
    static broadcastPresence(
        crystalId: string,
        sockets: Map<string, WebSocket>
    ): void {
        const activeUsers = this.getActiveUsers(crystalId);

        const message = JSON.stringify({
            type: 'presence',
            crystalId,
            users: activeUsers
        });

        const session = this.sessions.get(crystalId);
        if (!session) return;

        session.users.forEach((_, userId) => {
            const socket = sockets.get(userId);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    /**
     * Cleanup inactive sessions (run periodically)
     */
    static cleanupInactiveSessions(maxInactiveMs: number = 30 * 60 * 1000): void {
        const now = Date.now();

        this.sessions.forEach((session, crystalId) => {
            if (now - session.lastUpdate > maxInactiveMs && session.users.size === 0) {
                this.sessions.delete(crystalId);
                console.log(`[Collab] Cleaned up inactive session: ${crystalId}`);
            }
        });
    }
}

// Cleanup task every 10 minutes
setInterval(() => {
    CollaborationService.cleanupInactiveSessions();
}, 10 * 60 * 1000);
