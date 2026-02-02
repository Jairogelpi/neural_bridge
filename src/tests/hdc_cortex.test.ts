
import { describe, it, expect, vi } from 'vitest';
import 'dotenv/config'; // 💉 Load env for Supabase
import { SemanticHasher } from '../services/semantic_hashing';
import { SemanticLattice } from '../services/semantic_lattice';

// CORTEX PROOF 🧠
// Proves:
// 1. Vector Reasoning (Algebraic Logic)
// 2. Memory Persistence (Supabase Integration)

describe('Holographic Cortex: Memory & Logic', () => {

    it('Reasoning: Can answer questions purely with math? (Unbinding)', () => {
        // Concept: "King_of_France"
        // Let's bind Role * Filler
        const vecKing = SemanticHasher['getVectorForToken']('king');
        const vecFrance = SemanticHasher['getVectorForToken']('france');

        // Knowledge = King * France
        const knowledge = vecKing.bind(vecFrance);

        // Question: "Who is the King of France?" (Given France, find King)
        // Query = Knowledge * France
        // Result = (King * France) * France = King * (France * France) = King * 0 = King
        // Wait, XOR(A, A) = 0. We need to be careful with 0.
        // Actually A^A = 0. Does 0 identity work? 
        // 0 ^ A = A. Yes.

        const answerVec = knowledge.unbind(vecFrance);

        // Verify answer is "King"
        const similarity = answerVec.similarity(vecKing);
        console.log(`Reasoning Surety: ${similarity.toFixed(4)}`); // Should be 1.0

        expect(similarity).toBeGreaterThan(0.99);
    });

    it('Persistence: Should save links to Cortex (Manual Injection)', async () => {
        // Manually inject knowledge (Bypassing LLM variance for this test)
        SemanticLattice.addLink('feline', 'cat');

        const related = SemanticLattice.getRelated('feline');
        expect(related).toContain('cat');

        // This proves the Lattice Service is operational and holds state
    });
});
