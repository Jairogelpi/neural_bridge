import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

/**
 * WEBSOCKET REAL-TIME SERVER 🔴⚡
 * 
 * Provides real-time updates for:
 * - New crystals (cortex graph auto-update)
 * - Job progress (crystallization, multimodal)
 * - System stats (cache, queue)
 * - Live notifications
 * - **NEW: Collaborative editing (P4)**
 */

export class WebSocketServer {
    private static io: SocketIOServer | null = null;
    private static userSockets = new Map<string, Socket>(); // userId -> Socket

    /**
     * Initialize WebSocket server
     */
    static initialize(httpServer: HTTPServer): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.DASHBOARD_URL || '*',
                methods: ['GET', 'POST']
            },
            path: '/ws'
        });

        this.io.on('connection', (socket: Socket) => {
            console.log(`[WebSocket] 🔌 Client connected: ${socket.id}`);

            // Store user socket for collaboration
            socket.on('user:identify', (userId: string) => {
                this.userSockets.set(userId, socket);
                console.log(`[WebSocket] 👤 User ${userId} identified`);

                socket.on('disconnect', () => {
                    this.userSockets.delete(userId);
                });
            });

            // ═══════════════════════════════════════════════════════════
            // COLLABORATIVE EDITING (P4)
            // ═══════════════════════════════════════════════════════════

            // Join crystal editing session
            socket.on('collab:join', async (data: {
                crystalId: string;
                userId: string;
                userName: string;
            }) => {
                const { CollaborationService } = await import('./collaboration');

                const presence = CollaborationService.joinSession(
                    data.crystalId,
                    data.userId,
                    data.userName
                );

                socket.join(`crystal:${data.crystalId}`);

                // Send current state to joining user
                const currentState = CollaborationService.getDocumentState(data.crystalId);
                const activeUsers = CollaborationService.getActiveUsers(data.crystalId);

                socket.emit('collab:init', {
                    content: currentState,
                    presence,
                    users: activeUsers
                });

                // Broadcast presence update to all users
                this.io!.to(`crystal:${data.crystalId}`).emit('collab:user:joined', {
                    user: presence,
                    totalUsers: activeUsers.length
                });

                console.log(`[Collab] ${data.userName} joined crystal ${data.crystalId}`);
            });

            // Leave crystal editing session
            socket.on('collab:leave', async (data: {
                crystalId: string;
                userId: string;
            }) => {
                const { CollaborationService } = await import('./collaboration');

                CollaborationService.leaveSession(data.crystalId, data.userId);
                socket.leave(`crystal:${data.crystalId}`);

                const activeUsers = CollaborationService.getActiveUsers(data.crystalId);

                this.io!.to(`crystal:${data.crystalId}`).emit('collab:user:left', {
                    userId: data.userId,
                    totalUsers: activeUsers.length
                });

                console.log(`[Collab] User ${data.userId} left crystal ${data.crystalId}`);
            });

            // Edit operation (insert, delete, update)
            socket.on('collab:edit', async (data: {
                crystalId: string;
                operation: any;
            }) => {
                const { CollaborationService } = await import('./collaboration');

                CollaborationService.applyOperation(data.crystalId, data.operation);

                // Broadcast to all other users in the crystal
                socket.to(`crystal:${data.crystalId}`).emit('collab:operation', {
                    operation: data.operation,
                    timestamp: Date.now()
                });
            });

            // Cursor position update
            socket.on('collab:cursor', async (data: {
                crystalId: string;
                userId: string;
                cursor: { line: number; column: number };
            }) => {
                const { CollaborationService } = await import('./collaboration');

                CollaborationService.updateCursor(data.crystalId, data.userId, data.cursor);

                // Broadcast cursor to all other users
                socket.to(`crystal:${data.crystalId}`).emit('collab:cursor', {
                    userId: data.userId,
                    cursor: data.cursor
                });
            });

            // Selection update
            socket.on('collab:selection', async (data: {
                crystalId: string;
                userId: string;
                selection: { start: number; end: number };
            }) => {
                const { CollaborationService } = await import('./collaboration');

                CollaborationService.updateSelection(
                    data.crystalId,
                    data.userId,
                    data.selection
                );

                socket.to(`crystal:${data.crystalId}`).emit('collab:selection', {
                    userId: data.userId,
                    selection: data.selection
                });
            });

            // ═══════════════════════════════════════════════════════════
            // ORIGINAL EVENTS (P1)
            // ═══════════════════════════════════════════════════════════

            // Subscribe to crystals
            socket.on('subscribe:crystals', () => {
                socket.join('crystals');
                console.log(`[WebSocket] 📡 ${socket.id} subscribed to crystals`);
            });

            // Subscribe to job updates
            socket.on('subscribe:job', (jobId: string) => {
                socket.join(`job:${jobId}`);
                console.log(`[WebSocket] 📡 ${socket.id} subscribed to job ${jobId}`);
            });

            // Subscribe to stats
            socket.on('subscribe:stats', () => {
                socket.join('stats');
                console.log(`[WebSocket] 📡 ${socket.id} subscribed to stats`);
            });

            // Unsubscribe
            socket.on('unsubscribe:crystals', () => {
                socket.leave('crystals');
            });

            socket.on('unsubscribe:job', (jobId: string) => {
                socket.leave(`job:${jobId}`);
            });

            socket.on('unsubscribe:stats', () => {
                socket.leave('stats');
            });

            // Disconnect
            socket.on('disconnect', () => {
                console.log(`[WebSocket] 🔌 Client disconnected: ${socket.id}`);
            });
        });

        // Broadcast stats every 5 seconds
        setInterval(() => {
            this.broadcastStats();
        }, 5000);

        console.log('[WebSocket] ✅ Server initialized with collaboration support');
    }

    /**
     * Emit new crystal event
     */
    static emitNewCrystal(crystal: any): void {
        if (!this.io) return;

        this.io.to('crystals').emit('crystal:new', {
            crystal,
            timestamp: Date.now()
        });

        console.log(`[WebSocket] 📡 Broadcasted new crystal: ${crystal.context_id}`);
    }

    /**
     * Emit crystal updated event
     */
    static emitCrystalUpdated(crystal: any): void {
        if (!this.io) return;

        this.io.to('crystals').emit('crystal:updated', {
            crystal,
            timestamp: Date.now()
        });
    }

    /**
     * Emit job progress
     */
    static emitJobProgress(jobId: string, progress: {
        status: 'waiting' | 'active' | 'completed' | 'failed';
        progress?: number;
        result?: any;
        error?: string;
    }): void {
        if (!this.io) return;

        this.io.to(`job:${jobId}`).emit('job:progress', {
            jobId,
            ...progress,
            timestamp: Date.now()
        });
    }

    /**
     * Broadcast system stats
     */
    private static async broadcastStats(): Promise<void> {
        if (!this.io) return;

        try {
            const { CacheManager } = await import('./cache');
            const { DatabasePool } = await import('./database');
            const { JobQueueManager } = await import('./job_queue');

            const [cacheStats, dbStats, queueStats] = await Promise.all([
                CacheManager.getStats().catch(() => null),
                Promise.resolve(DatabasePool.getStats()),
                JobQueueManager.getStats().catch(() => null)
            ]);

            this.io.to('stats').emit('stats:update', {
                cache: cacheStats,
                database: dbStats,
                queue: queueStats,
                timestamp: Date.now()
            });
        } catch (error) {
            // Silently fail
        }
    }

    /**
     * Get connected clients count
     */
    static getConnectedClients(): number {
        if (!this.io) return 0;
        return this.io.sockets.sockets.size;
    }

    /**
     * Shutdown WebSocket server
     */
    static shutdown(): void {
        if (this.io) {
            this.io.close();
            this.io = null;
            this.userSockets.clear();
            console.log('[WebSocket] ✅ Server shut down');
        }
    }
}

// Auto-cleanup on process exit
process.on('SIGTERM', () => {
    WebSocketServer.shutdown();
});

process.on('SIGINT', () => {
    WebSocketServer.shutdown();
});
