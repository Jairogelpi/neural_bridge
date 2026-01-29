// Input Handle Factories for V2 Adapters
// Supports textarea and contenteditable inputs

import type { InputHandle } from "./types";
import { isVisible } from "./dom";

export function makeTextareaHandle(el: HTMLTextAreaElement): InputHandle {
    return {
        kind: "textarea",
        el,
        setText(text: string) {
            el.value = text;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        },
        getText() {
            return el.value;
        },
        focus() {
            el.focus();
        }
    };
}

export function makeContentEditableHandle(el: HTMLElement): InputHandle {
    return {
        kind: "contenteditable",
        el,
        setText(text: string) {
            el.focus();

            // Clear existing content
            el.textContent = "";

            // Use Selection API for reliable insertion
            const sel = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);

            // insertText works in most modern browsers
            document.execCommand("insertText", false, text);
            el.dispatchEvent(new Event("input", { bubbles: true }));
        },
        getText() {
            return (el.textContent || "").trim();
        },
        focus() {
            el.focus();
        }
    };
}

export function isEditableCandidate(el: Element): el is HTMLElement {
    if (!isVisible(el)) return false;
    const he = el as HTMLElement;
    if (he.tagName.toLowerCase() === "textarea") return true;
    const ce = he.getAttribute("contenteditable");
    return ce === "true" || ce === "";
}

export function findBestInput(
    textareaCandidates: HTMLTextAreaElement[],
    contentEditableCandidates: HTMLElement[]
): InputHandle | null {
    // Prefer visible textarea
    for (const ta of textareaCandidates) {
        if (isVisible(ta)) return makeTextareaHandle(ta);
    }

    // Fallback to contenteditable
    for (const ce of contentEditableCandidates) {
        if (isVisible(ce)) return makeContentEditableHandle(ce);
    }

    return null;
}
