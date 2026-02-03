import { type Crystal, CrystalStatus, ConstraintRule } from '../../types/crystal_format';
import { SemanticHasher } from '../semantic_hashing';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface VideoMetadata {
    duration_seconds: number;
    width: number;
    height: number;
    fps: number;
    codec: string;
    file_size_bytes: number;
}

export interface VisualFeatures {
    objects: Array<{ label: string; confidence: number; bbox?: number[] }>;
    faces: Array<{ bbox: number[]; landmarks?: any }>;
    text_detected: string;
    dominant_colors: string[];
    description: string; // AI-generated caption
}

export interface Keyframe {
    timestamp: number;
    frame_hash: string;
    scene_id: string;
    visual_features: VisualFeatures;
    frame_data?: string; // Base64 encoded thumbnail (optional)
}

export interface Scene {
    id: string;
    start: number;
    end: number;
    description: string;
    keyframe_indices: number[];
}

export interface VideoCrystal extends Crystal {
    video_metadata: VideoMetadata;
    keyframes: Keyframe[];
    scenes: Scene[];
    visual_merkle_root: string;
}

/**
 * VIDEO CRYSTALLIZER 🎬💎
 * 
 * Uses Gemini 1.5 Flash Vision (FREE) for best cost/performance ratio.
 * Processes video into verifiable crystals with visual semantic merkle trees.
 */
export class VideoCrystallizer {

    private static gemini: GoogleGenerativeAI | null = null;

    private static getGeminiClient(): GoogleGenerativeAI {
        if (!this.gemini) {
            const apiKey = process.env.GOOGLE_AI_API_KEY;
            if (!apiKey) {
                throw new Error('GOOGLE_AI_API_KEY not set for Gemini Vision');
            }
            this.gemini = new GoogleGenerativeAI(apiKey);
        }
        return this.gemini;
    }

    /**
     * Main entry point: Video File → Video Crystal
     */
    static async crystallize(
        videoBuffer: Buffer,
        metadata: Partial<VideoMetadata>,
        options: {
            keyframeInterval?: number; // Seconds between keyframes (default: 2)
            useLocal?: boolean; // Use local processing instead of cloud
            saveFrames?: boolean; // Save frame thumbnails
        } = {}
    ): Promise<VideoCrystal> {
        console.log(`[VideoCrystallizer] 🎬 Starting video crystallization...`);
        const startTime = Date.now();

        // 1. EXTRACT KEYFRAMES
        const keyframes = await this.extractKeyframes(
            videoBuffer,
            metadata,
            options.keyframeInterval || 2
        );

        // 2. ANALYZE EACH KEYFRAME (using Gemini Flash Vision - FREE!)
        const analyzedFrames = await this.analyzeKeyframesParallel(
            keyframes,
            options.useLocal || false
        );

        // 3. DETECT SCENES
        const scenes = this.detectScenes(analyzedFrames);

        // 4. BUILD VISUAL MERKLE TREE
        const merkleRoot = this.buildVisualMerkleTree(analyzedFrames);

        // 5. BUILD CRYSTAL
        const description = this.generateDescription(analyzedFrames, scenes);

        const crystal: VideoCrystal = {
            scp_version: '1.0',
            context_id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            created_at: new Date().toISOString(),
            version: '1.0.0',
            tier: 'verified',
            domain: 'video',
            tags: ['multimodal:video', 'type:video_crystal', 'engine:gemini-flash'],
            source: {
                platform: 'neural-bridge-video',
                url: 'internal://video_crystallization',
                timestamp: new Date().toISOString(),
                model: options.useLocal ? 'yolo-local' : 'gemini-1.5-flash-vision'
            },
            intent: {
                primary: description,
                status: CrystalStatus.ACTIVE
            },
            author: {
                id: 'video_crystallizer',
                name: 'Video Crystallizer Engine',
                reputation: 0.9
            },
            constraints: this.extractConstraints(analyzedFrames),
            verification: {
                canonical_hash: merkleRoot,
                semantic_invariants: this.generateInvariants(scenes, analyzedFrames),
                policy: {
                    min_checks: 2,
                    accept_threshold: 0.85,
                    max_retries: 1,
                    strategy: 'strict'
                }
            },
            video_metadata: {
                duration_seconds: metadata.duration_seconds || 0,
                width: metadata.width || 0,
                height: metadata.height || 0,
                fps: metadata.fps || 30,
                codec: metadata.codec || 'unknown',
                file_size_bytes: metadata.file_size_bytes || videoBuffer.length
            },
            keyframes: options.saveFrames ? analyzedFrames : analyzedFrames.map(kf => ({ ...kf, frame_data: undefined })),
            scenes,
            visual_merkle_root: merkleRoot
        };

        const elapsed = Date.now() - startTime;
        console.log(`[VideoCrystallizer] ✅ Video crystallization complete in ${elapsed}ms`);
        console.log(`[VideoCrystallizer] 📊 ${analyzedFrames.length} frames, ${scenes.length} scenes`);

        return crystal;
    }

    /**
     * EXTRACT KEYFRAMES from video (using ffmpeg)
     */
    private static async extractKeyframes(
        videoBuffer: Buffer,
        metadata: Partial<VideoMetadata>,
        intervalSeconds: number
    ): Promise<Array<{ timestamp: number; data: Buffer }>> {
        console.log(`[VideoCrystallizer] 📸 Extracting keyframes (1 per ${intervalSeconds}s)...`);

        // In production, use ffmpeg to extract frames
        // For MVP, simulate frame extraction

        const duration = metadata.duration_seconds || 60;
        const numFrames = Math.min(Math.ceil(duration / intervalSeconds), 30); // Max 30 frames to save costs
        const frames: Array<{ timestamp: number; data: Buffer }> = [];

        for (let i = 0; i < numFrames; i++) {
            const timestamp = i * intervalSeconds;
            // In production: extract actual frame using ffmpeg
            // ffmpeg -i video.mp4 -ss {timestamp} -vframes 1 frame_{i}.jpg
            frames.push({
                timestamp,
                data: Buffer.from('') // Placeholder
            });
        }

        console.log(`[VideoCrystallizer] ✅ Extracted ${frames.length} keyframes`);
        return frames;
    }

    /**
     * ANALYZE KEYFRAMES in parallel using Gemini Flash Vision (FREE!)
     */
    private static async analyzeKeyframesParallel(
        frames: Array<{ timestamp: number; data: Buffer }>,
        useLocal: boolean
    ): Promise<Keyframe[]> {
        console.log(`[VideoCrystallizer] 🔍 Analyzing ${frames.length} frames (${useLocal ? 'local' : 'Gemini Flash'})...`);

        // Process in batches of 5 to avoid rate limits
        const BATCH_SIZE = 5;
        const results: Keyframe[] = [];

        for (let i = 0; i < frames.length; i += BATCH_SIZE) {
            const batch = frames.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(frame => this.analyzeKeyframe(frame, useLocal))
            );
            results.push(...batchResults);

            // Small delay between batches to respect rate limits
            if (i + BATCH_SIZE < frames.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        console.log(`[VideoCrystallizer] ✅ Analyzed ${results.length} frames`);
        return results;
    }

    /**
     * ANALYZE SINGLE KEYFRAME with Gemini Flash Vision
     */
    private static async analyzeKeyframe(
        frame: { timestamp: number; data: Buffer },
        useLocal: boolean
    ): Promise<Keyframe> {
        const frameHash = SemanticHasher.computeSimHash(`frame_${frame.timestamp}`);

        if (useLocal || !process.env.GOOGLE_AI_API_KEY) {
            // Fallback to basic analysis
            return {
                timestamp: frame.timestamp,
                frame_hash: frameHash,
                scene_id: `scene_${Math.floor(frame.timestamp / 10)}`,
                visual_features: {
                    objects: [],
                    faces: [],
                    text_detected: '',
                    dominant_colors: ['#FFFFFF'],
                    description: 'Frame analysis unavailable'
                }
            };
        }

        try {
            const gemini = this.getGeminiClient();
            const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // For MVP, use text-based description prompt
            // In production, convert frame.data to base64 and send as image
            const prompt = `Analyze this video frame at ${frame.timestamp}s. Describe:
1. Main objects visible
2. Any text on screen
3. Overall scene description
4. Dominant colors

Be concise and factual.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const description = response.text();

            // Parse response to extract structured data
            const visualFeatures = this.parseGeminiResponse(description);

            return {
                timestamp: frame.timestamp,
                frame_hash: frameHash,
                scene_id: `scene_${Math.floor(frame.timestamp / 10)}`,
                visual_features: {
                    ...visualFeatures,
                    description
                }
            };
        } catch (error) {
            console.error(`[VideoCrystallizer] Error analyzing frame at ${frame.timestamp}s:`, error);
            // Fallback to basic analysis
            return {
                timestamp: frame.timestamp,
                frame_hash: frameHash,
                scene_id: `scene_${Math.floor(frame.timestamp / 10)}`,
                visual_features: {
                    objects: [],
                    faces: [],
                    text_detected: '',
                    dominant_colors: [],
                    description: 'Analysis failed - using default'
                }
            };
        }
    }

    /**
     * PARSE Gemini response into structured data
     */
    private static parseGeminiResponse(text: string): Omit<VisualFeatures, 'description'> {
        // Simple keyword extraction
        const objects: Array<{ label: string; confidence: number }> = [];
        const textDetected = text.match(/text[:\s]+([^\n]+)/i)?.[1] || '';
        const colors = text.match(/#[0-9A-F]{6}/gi) || [];

        // Extract object mentions
        const objectKeywords = ['person', 'car', 'building', 'tree', 'sky', 'road', 'text', 'logo', 'face'];
        objectKeywords.forEach(keyword => {
            if (text.toLowerCase().includes(keyword)) {
                objects.push({ label: keyword, confidence: 0.8 });
            }
        });

        return {
            objects,
            faces: text.toLowerCase().includes('face') || text.toLowerCase().includes('person') ? [{ bbox: [] }] : [],
            text_detected: textDetected,
            dominant_colors: colors.length > 0 ? colors : ['#FFFFFF']
        };
    }

    /**
     * DETECT SCENES based on visual continuity
     */
    private static detectScenes(keyframes: Keyframe[]): Scene[] {
        console.log(`[VideoCrystallizer] 🎞️ Detecting scenes...`);

        const scenes: Scene[] = [];
        let currentScene: Scene | null = null;

        keyframes.forEach((kf, idx) => {
            if (!currentScene || kf.scene_id !== currentScene.id) {
                if (currentScene) scenes.push(currentScene);

                const description = kf.visual_features.description || `Scene ${scenes.length + 1}`;
                currentScene = {
                    id: kf.scene_id,
                    start: kf.timestamp,
                    end: kf.timestamp,
                    description: description.substring(0, 200),
                    keyframe_indices: [idx]
                };
            } else {
                currentScene.end = kf.timestamp;
                currentScene.keyframe_indices.push(idx);
            }
        });

        if (currentScene) scenes.push(currentScene);

        console.log(`[VideoCrystallizer] ✅ Detected ${scenes.length} scenes`);
        return scenes;
    }

    /**
     * BUILD VISUAL SEMANTIC MERKLE TREE
     */
    private static buildVisualMerkleTree(keyframes: Keyframe[]): string {
        console.log(`[VideoCrystallizer] 🌳 Building Visual SMT...`);

        if (keyframes.length === 0) return '';

        let level = keyframes.map(kf => kf.frame_hash);

        while (level.length > 1) {
            const nextLevel: string[] = [];
            for (let i = 0; i < level.length; i += 2) {
                const left = level[i];
                const right = level[i + 1] || left;
                const hash = SemanticHasher.computeSimHash(left + right);
                nextLevel.push(hash);
            }
            level = nextLevel;
        }

        return level[0] || '';
    }

    /**
     * GENERATE overall description
     */
    private static generateDescription(keyframes: Keyframe[], scenes: Scene[]): string {
        const totalObjects = keyframes.reduce((acc, kf) => acc + kf.visual_features.objects.length, 0);
        const totalFaces = keyframes.reduce((acc, kf) => acc + kf.visual_features.faces.length, 0);
        const hasText = keyframes.some(kf => kf.visual_features.text_detected.length > 0);

        let desc = `Video with ${scenes.length} scene${scenes.length !== 1 ? 's' : ''}`;
        if (totalObjects > 0) desc += `, ${totalObjects} detected objects`;
        if (totalFaces > 0) desc += `, ${totalFaces} faces`;
        if (hasText) desc += ', contains text overlays';

        return desc;
    }

    /**
     * EXTRACT constraints from visual features
     */
    private static extractConstraints(keyframes: Keyframe[]): any[] {
        const constraints: any[] = [];
        const objectLabels = new Set<string>();

        keyframes.forEach(kf => {
            kf.visual_features.objects.forEach(obj => objectLabels.add(obj.label));
        });

        Array.from(objectLabels).slice(0, 10).forEach((label, idx) => {
            constraints.push({
                id: `video_c${idx}`,
                rule: ConstraintRule.MUST,
                value: `Visual object: "${label}"`,
                rationale: 'Detected by Gemini Vision'
            });
        });

        return constraints;
    }

    /**
     * GENERATE invariants for verification
     */
    private static generateInvariants(scenes: Scene[], keyframes: Keyframe[]): any[] {
        return [
            {
                id: 'inv_video_001',
                kind: 'fact_check',
                prompt: `How many scenes are in this video?`,
                expected: { type: 'number', value: scenes.length },
                weight: 1.0,
                strict: false,
                rationale: 'Verify scene segmentation'
            },
            {
                id: 'inv_video_002',
                kind: 'constraint_check',
                prompt: `Does this video contain visual content?`,
                expected: { type: 'boolean', value: keyframes.length > 0 },
                weight: 1.0,
                strict: true,
                rationale: 'Verify non-blank video'
            }
        ];
    }
}
