
import { RecursiveBrain } from './recursive_brain';

/**
 * LEARNING LOOP (The Background Thinker) 🔄
 */
export class LearningLoop {
    private static intervals: Map<string, any> = new Map();

    static start(domain: string, intervalMs: number = 3600000) {
        if (this.intervals.has(domain)) return;
        console.log(`[LearningLoop] 🚀 Starting Autonomous Evolution for [${domain}]...`);
        RecursiveBrain.learningPulse(domain).catch(console.error);
        const interval = setInterval(() => {
            RecursiveBrain.learningPulse(domain).catch(console.error);
        }, intervalMs);
        this.intervals.set(domain, interval);
    }

    static stop(domain: string) {
        const interval = this.intervals.get(domain);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(domain);
            console.log(`[LearningLoop] ⏹️ Stopped Evolution for [${domain}].`);
        }
    }
}
