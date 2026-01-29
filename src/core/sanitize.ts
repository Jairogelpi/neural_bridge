export function wrapDataBlock(label: string, data: string): string {
    return `<<<DATA ${label}>>>\n${data}\n<<<END ${label}>>>`;
}
