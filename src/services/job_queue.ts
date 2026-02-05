import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

/**
 * JOB QUEUE SYSTEM 🔄
 * 
 * Handles async processing of long-running tasks:
 * - Crystallization (large files)
 * - Multimodal processing (audio/video)
 * - Batch operations
 * - Background upgrades
 * 
 * Prevents request timeouts and enables horizontal scaling.
 */

// Connection to Redis
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});

// Job Queues
export const crystallizationQueue = new Queue('crystallization', { connection });
export const multimodalQueue = new Queue('multimodal', { connection });
export const upgradeQueue = new Queue('background-upgrade', { connection });

export interface CrystallizationJobData {
    text: string;
    options: {
        tier?: 'flash' | 'smart' | 'deep';
        domain?: string;
        autoUpgrade?: boolean;
    };
    userId?: string;
    requestId: string;
}

export interface MultimodalJobData {
    type: 'audio' | 'video';
    fileBuffer: Buffer;
    metadata: Record<string, any>;
    options: Record<string, any>;
    userId?: string;
    requestId: string;
}

export interface UpgradeJobData {
    crystalId: string;
    text: string;
    domain: string;
}

/**
 * Job Queue Manager
 */
export class JobQueueManager {
    private static crystallizationWorker: Worker | null = null;
    private static multimodalWorker: Worker | null = null;
    private static upgradeWorker: Worker | null = null;

    /**
     * Start all workers
     */
    static async startWorkers(): Promise<void> {
        console.log('[JobQueue] 🚀 Starting background workers...');

        // Crystallization Worker
        this.crystallizationWorker = new Worker(
            'crystallization',
            async (job: Job<CrystallizationJobData>) => {
                console.log(`[Worker:Crystallization] Processing job ${job.id}`);
                const { CrystallizationService } = await import('./crystallization');

                const crystal = await CrystallizationService.crystallize(
                    job.data.text,
                    {
                        tier: job.data.options.tier as any || 'flash',
                        domain: job.data.options.domain,
                        autoUpgrade: job.data.options.autoUpgrade
                    }
                );

                return {
                    crystal,
                    requestId: job.data.requestId
                };
            },
            { connection }
        );

        // Multimodal Worker
        this.multimodalWorker = new Worker(
            'multimodal',
            async (job: Job<MultimodalJobData>) => {
                console.log(`[Worker:Multimodal] Processing ${job.data.type} job ${job.id}`);

                if (job.data.type === 'audio') {
                    const { AudioCrystallizer } = await import('./multimodal/audio_crystallizer');
                    const crystal = await AudioCrystallizer.crystallize(
                        job.data.fileBuffer,
                        job.data.metadata,
                        job.data.options
                    );
                    return { crystal, requestId: job.data.requestId };
                } else {
                    const { VideoCrystallizer } = await import('./multimodal/video_crystallizer');
                    const crystal = await VideoCrystallizer.crystallize(
                        job.data.fileBuffer,
                        job.data.metadata,
                        job.data.options
                    );
                    return { crystal, requestId: job.data.requestId };
                }
            },
            { connection }
        );

        // Background Upgrade Worker
        this.upgradeWorker = new Worker(
            'background-upgrade',
            async (job: Job<UpgradeJobData>) => {
                console.log(`[Worker:Upgrade] Upgrading crystal ${job.data.crystalId}`);
                const { CrystallizationService } = await import('./crystallization');

                // Perform deep crystallization
                const deepCrystal = await CrystallizationService.crystallize(
                    job.data.text,
                    { tier: 'deep', domain: job.data.domain }
                );

                deepCrystal.supersedes = job.data.crystalId;

                // Update cache
                const { CacheManager } = await import('./cache');
                await CacheManager.setCrystal(job.data.crystalId, deepCrystal);

                return { crystalId: deepCrystal.context_id };
            },
            { connection }
        );

        // Event listeners
        this.crystallizationWorker.on('completed', (job) => {
            console.log(`[Worker:Crystallization] ✅ Job ${job.id} completed`);
        });

        this.crystallizationWorker.on('failed', (job, err) => {
            console.error(`[Worker:Crystallization] ❌ Job ${job?.id} failed:`, err);
        });

        this.multimodalWorker.on('completed', (job) => {
            console.log(`[Worker:Multimodal] ✅ Job ${job.id} completed`);
        });

        this.multimodalWorker.on('failed', (job, err) => {
            console.error(`[Worker:Multimodal] ❌ Job ${job?.id} failed:`, err);
        });

        console.log('[JobQueue] ✅ All workers started');
    }

    /**
     * Add crystallization job
     */
    static async addCrystallizationJob(data: CrystallizationJobData): Promise<Job> {
        return await crystallizationQueue.add('crystallize', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            }
        });
    }

    /**
     * Add multimodal processing job
     */
    static async addMultimodalJob(data: MultimodalJobData): Promise<Job> {
        return await multimodalQueue.add('process', data, {
            attempts: 2,
            backoff: {
                type: 'exponential',
                delay: 3000
            }
        });
    }

    /**
     * Add background upgrade job
     */
    static async addUpgradeJob(data: UpgradeJobData): Promise<Job> {
        return await upgradeQueue.add('upgrade', data, {
            delay: 5000, // Wait 5s before starting
            attempts: 2
        });
    }

    /**
     * Get job status
     */
    static async getJobStatus(queue: Queue, jobId: string): Promise<{
        status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
        progress?: number;
        result?: any;
        error?: string;
    }> {
        const job = await queue.getJob(jobId);
        if (!job) {
            return { status: 'failed', error: 'Job not found' };
        }

        const state = await job.getState();
        const progress = job.progress;

        let result;
        if (state === 'completed') {
            result = await job.returnvalue;
        }

        let error;
        if (state === 'failed') {
            error = job.failedReason;
        }

        return {
            status: state as any,
            progress: typeof progress === 'number' ? progress : undefined,
            result,
            error
        };
    }

    /**
     * Get queue stats
     */
    static async getStats() {
        const [crystalCounts, multimodalCounts, upgradeCounts] = await Promise.all([
            crystallizationQueue.getJobCounts(),
            multimodalQueue.getJobCounts(),
            upgradeQueue.getJobCounts()
        ]);

        return {
            crystallization: crystalCounts,
            multimodal: multimodalCounts,
            backgroundUpgrade: upgradeCounts
        };
    }

    /**
     * Graceful shutdown
     */
    static async shutdown(): Promise<void> {
        console.log('[JobQueue] 🛑 Shutting down workers...');

        await Promise.all([
            this.crystallizationWorker?.close(),
            this.multimodalWorker?.close(),
            this.upgradeWorker?.close()
        ]);

        await Promise.all([
            crystallizationQueue.close(),
            multimodalQueue.close(),
            upgradeQueue.close()
        ]);

        await connection.quit();

        console.log('[JobQueue] ✅ Workers shut down gracefully');
    }
}

// Auto-cleanup on process exit
process.on('SIGTERM', async () => {
    await JobQueueManager.shutdown();
});

process.on('SIGINT', async () => {
    await JobQueueManager.shutdown();
});
