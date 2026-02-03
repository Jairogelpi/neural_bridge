/**
 * EXPORT SERVICE 📤
 * 
 * Provides multiple export formats for crystals:
 * - JSON (raw data)
 * - Markdown (readable documentation)
 * - PDF (printable reports)
 * - Anki (flashcard deck)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export class ExportService {
    /**
     * Export crystal to JSON
     */
    static async toJSON(crystalId: string): Promise<string> {
        const { data: crystal } = await supabase
            .from('crystals')
            .select('*')
            .eq('context_id', crystalId)
            .single();

        if (!crystal) {
            throw new Error('Crystal not found');
        }

        return JSON.stringify(crystal, null, 2);
    }

    /**
     * Export crystal to Markdown
     */
    static async toMarkdown(crystalId: string): Promise<string> {
        const { data: crystal } = await supabase
            .from('crystals')
            .select('*')
            .eq('context_id', crystalId)
            .single();

        if (!crystal) {
            throw new Error('Crystal not found');
        }

        const md = `# ${crystal.intent?.primary || 'Untitled Crystal'}

**Domain:** ${crystal.domain}  
**Author:** ${crystal.author || 'Unknown'}  
**Created:** ${new Date(crystal.created_at).toLocaleDateString()}

## Intent

${crystal.intent?.primary || 'No intent described'}

${crystal.intent?.secondary?.map((s: string) => `- ${s}`).join('\n') || ''}

## Constraints

${crystal.constraints?.map((c: any) => `- ${c.rule || c}`).join('\n') || 'No constraints'}

## Metadata

- **Context ID:** \`${crystal.context_id}\`
- **Tier:** ${crystal.metadata?.tier || 'flash'}
- **Generation:** ${crystal.metadata?.genealogy?.generation || 0}
- **Reputation:** ${crystal.reputation || 0}

## Tags

${crystal.tags?.map((t: string) => `\`${t}\``).join(', ') || 'No tags'}

---

*Exported from Neural Bridge*
`;

        return md;
    }

    /**
     * Export crystal to Anki deck format
     */
    static async toAnki(crystalId: string): Promise<string> {
        const { data: crystal } = await supabase
            .from('crystals')
            .select('*')
            .eq('context_id', crystalId)
            .single();

        if (!crystal) {
            throw new Error('Crystal not found');
        }

        // Create flashcards from constraints and intent
        const cards: string[] = [];

        // Main intent card
        cards.push(`"${crystal.domain} - Primary Intent";"${crystal.intent?.primary}"`);

        // Constraint cards
        crystal.constraints?.forEach((constraint: any, idx: number) => {
            const rule = typeof constraint === 'string' ? constraint : constraint.rule;
            cards.push(`"${crystal.domain} - Constraint ${idx + 1}";"${rule}"`);
        });

        // Secondary intent cards
        crystal.intent?.secondary?.forEach((intent: string, idx: number) => {
            cards.push(`"${crystal.domain} - Secondary ${idx + 1}";"${intent}"`);
        });

        // Generate Anki CSV format
        const header = '"Front";"Back"\n';
        return header + cards.join('\n');
    }

    /**
     * Export crystal to PDF (simulated - returns HTML for PDF conversion)
     */
    static async toPDF(crystalId: string): Promise<string> {
        const md = await this.toMarkdown(crystalId);

        // Return HTML that can be converted to PDF by a service
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Neural Bridge Crystal Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
        pre { background: #1f2937; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
        ul { padding-left: 24px; }
        strong { color: #374151; }
    </style>
</head>
<body>
    ${this.markdownToHTML(md)}
</body>
</html>
`;
        return html;
    }

    /**
     * Simple Markdown to HTML converter
     */
    private static markdownToHTML(md: string): string {
        return md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|u|p])(.*$)/gim, '<p>$1</p>');
    }

    /**
     * Batch export multiple crystals
     */
    static async exportBatch(crystalIds: string[], format: 'json' | 'markdown'): Promise<string> {
        const exports = await Promise.all(
            crystalIds.map(async (id) => {
                try {
                    if (format === 'json') {
                        return await this.toJSON(id);
                    } else {
                        return await this.toMarkdown(id);
                    }
                } catch (err) {
                    return `Error exporting ${id}: ${(err as Error).message}`;
                }
            })
        );

        if (format === 'json') {
            return `[\n${exports.join(',\n')}\n]`;
        } else {
            return exports.join('\n\n---\n\n');
        }
    }
}

/**
 * WEBHOOK SERVICE 🔗
 * 
 * Provides webhook integrations for external services
 */
export class WebhookService {
    /**
     * Send webhook to Zapier
     */
    static async sendToZapier(webhookUrl: string, crystal: any): Promise<void> {
        const payload = {
            event: 'crystal.created',
            data: {
                id: crystal.context_id,
                title: crystal.intent?.primary,
                domain: crystal.domain,
                author: crystal.author,
                created_at: crystal.created_at,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/crystals/${crystal.context_id}`
            }
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.statusText}`);
        }
    }

    /**
     * Generic webhook dispatcher
     */
    static async dispatch(url: string, event: string, data: any): Promise<void> {
        const payload = {
            event,
            data,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Neural-Bridge/1.0'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Webhook dispatch failed: ${response.statusText}`);
        }
    }
}
