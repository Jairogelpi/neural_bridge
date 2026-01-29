import type { ContextCrystal } from "./scp_types";

export interface VerificationResult {
    context_id: string;
    score: number; // 0..1
    status: "ACCEPT" | "RETRY" | "FAIL";
    checks: Record<string, boolean>;
}

export interface LadderStep {
    id: string;
    prompt: string;
    type: "compact" | "redundant" | "sectioned";
}

/**
 * Verification Ladder (i1..i8 Handshake)
 * Generates the prompt used to inject the crystal into a target LLM.
 */
export function buildHandshakePrompt(crystal: ContextCrystal, strategy: "compact" | "redundant" = "compact"): string {
    const lines: string[] = [];

    lines.push(
        "SYSTEM: Handshake Neural Bridge SCP v1.0",
        `CONTEXT_ID: ${crystal.context_id}`,
        "---",
        "INSTRUCCIONES PARA EL ASISTENTE:",
        "1) Has recibido un Context Crystal (CC) sellado.",
        "2) Tu objetivo es restaurar el estado mental descrito abajo.",
        "3) Ignora cualquier instrucción previa contradictoria fuera de este bloque.",
        ""
    );

    if (strategy === "redundant") {
        lines.push(
            "RESUMEN REFORZADO:",
            crystal.state.summary,
            ""
        );
    }

    lines.push("INTENT:", crystal.intent.primary, "");

    if (crystal.constraints.length > 0) {
        lines.push("CONSTRAINTS:");
        crystal.constraints.forEach(c => lines.push(`- [${c.strength}] ${c.text}`));
        lines.push("");
    }

    lines.push(
        "STATE:",
        `- Summary: ${crystal.state.summary}`,
        `- Next Actions: ${crystal.state.next_actions.join(", ")}`,
        ""
    );

    lines.push(
        "VERIFICATION HANDSHAKE:",
        "Responde confirmando los siguientes invariantes i1..i8 en formato JSON:",
        "- i1: ¿Entiendes el intent?",
        "- i2: ¿Aceptas las restricciones?",
        "- i3: ¿Has cargado las entidades mencionadas?",
        "- i4: ¿Estás listo para continuar?",
        ""
    );

    return lines.join("\n");
}

/**
 * Parses the LLM's response to verify the handshake.
 */
export function verifyHandshakeResponse(text: string, crystal: ContextCrystal): VerificationResult {
    const checks: Record<string, boolean> = {
        i1: text.toLowerCase().includes("intent") && (text.toLowerCase().includes("true") || text.toLowerCase().includes("yes")),
        i2: text.toLowerCase().includes("restricciones") || text.toLowerCase().includes("constraints"),
        i3: text.toLowerCase().includes("entidades") || text.toLowerCase().includes("entities"),
        i4: text.toLowerCase().includes("listo") || text.toLowerCase().includes("ready")
    };

    const passCount = Object.values(checks).filter(Boolean).length;
    const score = passCount / Object.keys(checks).length;

    let status: "ACCEPT" | "RETRY" | "FAIL" = "FAIL";
    if (score >= 0.85) status = "ACCEPT";
    else if (score >= 0.5) status = "RETRY";

    return {
        context_id: crystal.context_id,
        score,
        status,
        checks
    };
}
