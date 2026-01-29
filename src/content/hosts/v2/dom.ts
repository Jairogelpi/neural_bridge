// DOM Utilities for Host Adapters V2

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function qs<T extends Element>(sel: string, root: ParentNode = document): T | null {
    return root.querySelector<T>(sel);
}

export function qsa<T extends Element>(sel: string, root: ParentNode = document): T[] {
    return Array.from(root.querySelectorAll<T>(sel));
}

export function isVisible(el: Element | null): el is HTMLElement {
    if (!el) return false;
    const he = el as HTMLElement;
    const r = he.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(he).visibility !== "hidden";
}

export function inViewport(el: Element | null): boolean {
    if (!el) return false;
    const r = (el as HTMLElement).getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.bottom <= (window.innerHeight || 0) + 40;
}

export function textContentSafe(el: Element | null): string {
    if (!el) return "";
    return (el.textContent || "").trim();
}

export function firstVisible<T extends Element>(els: T[]): T | null {
    for (const e of els) if (isVisible(e)) return e;
    return null;
}

export function normalizeWS(s: string): string {
    return s.replace(/\s+/g, " ").trim();
}

export function trySelectors<T extends Element>(selectors: string[]): T | null {
    for (const sel of selectors) {
        const el = qs<T>(sel);
        if (el && isVisible(el)) return el;
    }
    return null;
}

export function trySelectorsAll<T extends Element>(selectors: string[]): T[] {
    for (const sel of selectors) {
        const els = qsa<T>(sel).filter(e => isVisible(e));
        if (els.length > 0) return els;
    }
    return [];
}
