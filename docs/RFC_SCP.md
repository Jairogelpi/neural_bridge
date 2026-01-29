# RFC 0001: Semantic Context Protocol (SCP)

## Status: PROPOSED STANDARD

**Internet Engineering Task Force (Conceptual)**  
**Category: Standards Track**  
**Version: 1.0**  
**Date: January 2026**

---

## Abstract

This document specifies the Semantic Context Protocol (SCP), a protocol for verified transfer of conversational context between Large Language Models (LLMs). SCP provides a method for compressing, transmitting, and verifying semantic information such that a receiving model can continue tasks originally started with a different model.

---

## Status of This Memo

This document specifies a protocol for the AI community and requests discussion and suggestions for improvements.

---

## 1. Introduction

### 1.1 Purpose

SCP addresses a fundamental problem in the multi-model AI era: how to transfer conversational context between different LLMs with formal guarantees of semantic preservation.

### 1.2 Scope

This specification defines:
- Wire format for context representations (Crystals)
- Verification protocol for fidelity testing
- State machine for transfer lifecycle
- Compliance requirements for implementations

### 1.3 Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

---

## 2. Terminology

| Term | Definition |
|------|------------|
| **Crystal** | Compressed semantic representation of a conversation |
| **Invariant** | Testable predicate that must hold after transfer |
| **Source Model** | LLM from which context originates |
| **Target Model** | LLM to which context is transferred |
| **Fidelity** | Degree of semantic preservation (0.0 - 1.0) |
| **Ladder** | Escalating retry strategy with increasing prompt complexity |

---

## 3. Protocol Overview

### 3.1 Architecture

```
┌─────────────────┐     COMPILE      ┌─────────────────┐
│  Conversation   │ ───────────────► │     Crystal     │
│    (Source)     │                  │   + Invariants  │
└─────────────────┘                  └────────┬────────┘
                                              │
                                         TRANSFER
                                              │
                                              ▼
┌─────────────────┐     VERIFY       ┌─────────────────┐
│  Target Model   │ ◄─────────────── │ Challenge Tests │
│   (Receiver)    │                  │   (Invariants)  │
└─────────────────┘                  └─────────────────┘
         │
         │ RESULT
         ▼
   ┌───────────┐
   │  ACCEPT   │  (fidelity ≥ threshold)
   │    OR     │
   │   FAIL    │  (fidelity < threshold)
   └───────────┘
```

### 3.2 Protocol Phases

1. **COMPILE**: Generate Crystal and Invariants from source conversation
2. **TRANSFER**: Inject Crystal into target model context
3. **VERIFY**: Test Invariants against target model responses
4. **DECIDE**: Accept or escalate based on score

---

## 4. Wire Format

### 4.1 Crystal Structure

```
Crystal := {
    "scp_version": "1.0",
    "context_id": UUID,
    "canonical_hash": String,
    "created_at": ISO8601,
    "source_model": ModelIdentifier,
    "content": CrystalContent,
    "invariants": [Invariant],
    "metadata": Metadata
}

CrystalContent := {
    "entities": [Entity],
    "relations": [Relation],
    "intents": [Intent],
    "constraints": [Constraint],
    "state": State,
    "narrative": String
}

Entity := {
    "id": String,
    "type": EntityType,
    "value": Any,
    "confidence": Float
}

Relation := {
    "subject": EntityID,
    "predicate": String,
    "object": EntityID | Value
}

Intent := {
    "type": IntentType,
    "description": String,
    "priority": Integer
}

Constraint := {
    "type": "must" | "must_not" | "should" | "prefer",
    "condition": String
}

State := {
    "current_step": Integer,
    "total_steps": Integer,
    "pending_tasks": [String],
    "completed_tasks": [String]
}
```

### 4.2 Invariant Structure

```
Invariant := {
    "id": String,
    "kind": InvariantKind,
    "prompt": String,
    "expected": Expected,
    "weight": Float,
    "strict": Boolean
}

InvariantKind := "fact" | "constraint" | "boundary" | "state" | "objective" | "preference"

Expected := {
    "type": ExpectedType,
    "value": Any,
    "tolerance": Float?
}

ExpectedType := "exact" | "contains" | "regex" | "numeric_range" | "boolean" | "one_of"
```

### 4.3 Transfer Message

```
TransferMessage := {
    "scp_version": "1.0",
    "message_type": "TRANSFER",
    "crystal": Crystal,
    "transfer_options": TransferOptions
}

TransferOptions := {
    "accept_threshold": Float,      // Default: 0.85
    "max_attempts": Integer,        // Default: 3
    "ladder_enabled": Boolean,      // Default: true
    "timeout_ms": Integer           // Default: 30000
}
```

### 4.4 Verification Response

```
VerificationResponse := {
    "scp_version": "1.0",
    "message_type": "VERIFY_RESULT",
    "context_id": UUID,
    "decision": "ACCEPT" | "FAIL",
    "score": Float,
    "confidence_interval": [Float, Float],
    "passed_invariants": [InvariantID],
    "failed_invariants": [FailedInvariant],
    "ladder_level": Integer,
    "total_attempts": Integer
}

FailedInvariant := {
    "id": InvariantID,
    "expected": Any,
    "actual": Any,
    "reason": String
}
```

---

## 5. State Machine

### 5.1 States

```
States := {
    IDLE,           // No transfer in progress
    COMPILING,      // Generating Crystal
    TRANSFERRING,   // Injecting into target
    VERIFYING,      // Testing invariants
    ESCALATING,     // Moving to higher ladder level
    ACCEPTED,       // Transfer successful (terminal)
    FAILED          // Transfer failed (terminal)
}
```

### 5.2 Transitions

```
IDLE ──────compile()─────► COMPILING
COMPILING ──compiled()───► TRANSFERRING
COMPILING ──error()──────► FAILED

TRANSFERRING ──injected()─► VERIFYING
TRANSFERRING ──error()────► FAILED

VERIFYING ──score≥θ───────► ACCEPTED
VERIFYING ──score<θ,L<max─► ESCALATING
VERIFYING ──score<θ,L=max─► FAILED

ESCALATING ──escalated()──► VERIFYING
```

### 5.3 State Diagram

```
                    ┌─────────┐
                    │  IDLE   │
                    └────┬────┘
                         │ compile()
                         ▼
                    ┌─────────┐
              ┌─────│COMPILING│─────┐
              │     └────┬────┘     │
         error()         │ compiled() error()
              │          ▼          │
              │    ┌───────────┐    │
              │    │TRANSFERRING│    │
              │    └─────┬─────┘    │
              │          │ injected()
              │          ▼          │
              │    ┌───────────┐    │
              │ ┌──│ VERIFYING │◄─┐ │
              │ │  └─────┬─────┘  │ │
              │ │        │        │ │
              │ │ score<θ│score≥θ │ │
              │ │ L<max  │        │ │
              │ │        │        │ │
              │ │   ┌────┴────┐   │ │
              │ │   ▼         ▼   │ │
              │ │┌──────┐ ┌──────┐│ │
              │ ││ESCAL-│ │ACCEPT││ │
              │ ││ATING │ │ ED   ││ │
              │ │└──┬───┘ └──────┘│ │
              │ │   │ escalated() │ │
              │ │   └─────────────┘ │
              │ │ score<θ, L=max    │
              │ ▼                   │
              │┌────────┐           │
              └│ FAILED │◄──────────┘
               └────────┘
```

---

## 6. Algorithms

### 6.1 Crystal Generation Algorithm

```
ALGORITHM GenerateCrystal(conversation, task):
    INPUT:  conversation C, task description T
    OUTPUT: Crystal σ
    
    1. entities ← ExtractEntities(C)
       // Named entities, values, references
    
    2. relations ← ExtractRelations(C, entities)
       // Subject-predicate-object triples
    
    3. intents ← ClassifyIntents(C)
       // Goals, questions, commands
    
    4. constraints ← ExtractConstraints(C)
       // Must/must-not/should conditions
    
    5. state ← ExtractState(C)
       // Progress, pending tasks
    
    6. narrative ← GenerateNarrative(entities, relations, intents)
       // Human-readable summary
    
    7. invariants ← GenerateInvariants(entities, relations, intents, constraints)
       // Testable predicates
    
    8. RETURN Crystal(entities, relations, intents, constraints, state, narrative, invariants)
```

### 6.2 Verification Algorithm

```
ALGORITHM Verify(target_model, crystal, threshold):
    INPUT:  target model M, crystal σ, threshold θ
    OUTPUT: (decision, score, details)
    
    1. weighted_sum ← 0
    2. total_weight ← 0
    3. failures ← []
    
    4. challenge ← BuildChallenge(σ.invariants)
       // Construct prompt testing all invariants
    
    5. response ← Query(M, challenge)
       // Get model response
    
    6. answers ← ParseResponse(response)
       // Extract individual answers
    
    7. FOR EACH (invariant, answer) IN Zip(σ.invariants, answers):
         match ← Evaluate(answer, invariant.expected)
         weighted_sum ← weighted_sum + invariant.weight × match
         total_weight ← total_weight + invariant.weight
         
         IF NOT match AND invariant.strict:
             failures.append(invariant)
    
    8. score ← weighted_sum / total_weight
    
    9. IF score ≥ θ AND failures.isEmpty():
         RETURN (ACCEPT, score, {})
       ELSE:
         RETURN (FAIL, score, failures)
```

### 6.3 Ladder Escalation Algorithm

```
ALGORITHM ExecuteLadder(target_model, crystal, threshold, max_levels):
    INPUT:  target model M, crystal σ, threshold θ, max levels L
    OUTPUT: (decision, score, level)
    
    1. FOR level FROM 1 TO L:
         prompt ← BuildPrompt(σ, level)
         // Level 1: compact, Level 2: redundant, Level 3: sectioned
         
         (decision, score, failures) ← Verify(M, σ with prompt, θ)
         
         IF decision = ACCEPT:
             RETURN (ACCEPT, score, level)
         
         IF level < L:
             σ ← Adapt(σ, failures)
             // Strengthen prompt based on failures
    
    2. RETURN (FAIL, score, L)
```

---

## 7. Compliance Requirements

### 7.1 MUST Requirements

1. Implementations MUST support Crystal version 1.0 format
2. Implementations MUST support all 6 invariant kinds
3. Implementations MUST implement the verification algorithm
4. Implementations MUST respect threshold parameters
5. Implementations MUST terminate within specified timeout
6. Implementations MUST report decision with score

### 7.2 SHOULD Requirements

1. Implementations SHOULD implement retry ladder
2. Implementations SHOULD report confidence intervals
3. Implementations SHOULD log all verification attempts
4. Implementations SHOULD support adaptive prompting

### 7.3 MAY Requirements

1. Implementations MAY compute semantic distance via embeddings
2. Implementations MAY implement additional invariant kinds
3. Implementations MAY optimize Crystal compression

---

## 8. Security Considerations

### 8.1 Prompt Injection

Crystal content SHOULD be sanitized to prevent prompt injection attacks on the target model.

### 8.2 Information Leakage

Crystal transmission SHOULD use encrypted channels to prevent context interception.

### 8.3 Model Fingerprinting

Verification responses MAY reveal model behavior patterns; implementations SHOULD limit exposure.

---

## 9. IANA Considerations

### 9.1 Media Type Registration

```
Type name: application
Subtype name: scp+json
Required parameters: none
Optional parameters: version (default "1.0")
Encoding considerations: UTF-8
```

### 9.2 URI Scheme

```
scp://[host]:[port]/[context_id]
```

---

## 10. References

### 10.1 Normative References

[RFC2119] Bradner, S., "Key words for use in RFCs", BCP 14, RFC 2119, March 1997.

### 10.2 Informative References

[SHANNON1948] Shannon, C.E., "A Mathematical Theory of Communication", Bell System Technical Journal, 1948.

[VALIANT1984] Valiant, L.G., "A Theory of the Learnable", Communications of the ACM, 1984.

[HOARE1969] Hoare, C.A.R., "An Axiomatic Basis for Computer Programming", Communications of the ACM, 1969.

---

## 11. Acknowledgements

This specification was developed by the Neural Bridge research team.

---

## 13. Advanced Features

### 13.1 Context Mesh (Live Sync)

Mesh mode enables real-time synchronization between multiple LLM hosts. 
- **Broadcast**: Source model updates Crystal as conversation progresses.
- **Listen**: Target models receive Crystal updates via broadcast channel.
- **Merge**: Conflicting updates are merged using a Conflict-free Replicated Knowledge (CRK) algorithm.

### 13.2 Semantic Branching (Checkpoints)

Allows users to save and resume context state at specific points.
- **Snapshot**: Save immutable Crystal with unique Tag.
- **Rebase**: Apply changes from Model A's context onto Model B's base.
- **Cherry-pick**: Transfer specific Invariants or Entities without the full Crystal.

### 13.3 Hallucination Guard

Real-time monitoring of model output against Crystal Invariants.
- **Warning**: Triggered when output violates a `strict` invariant.
- **Auto-Correction**: Injecting a "re-alignment" prompt when violation detected.

## Appendix A: Example Crystal

```json
{
  "scp_version": "1.0",
  "context_id": "550e8400-e29b-41d4-a716-446655440000",
  "canonical_hash": "sha256:a1b2c3d4...",
  "created_at": "2026-01-27T22:00:00Z",
  "source_model": "gpt-4",
  "content": {
    "entities": [
      {"id": "e1", "type": "person", "value": "Alice", "confidence": 1.0},
      {"id": "e2", "type": "project", "value": "Neural Bridge", "confidence": 0.95}
    ],
    "relations": [
      {"subject": "e1", "predicate": "works_on", "object": "e2"}
    ],
    "intents": [
      {"type": "build", "description": "Create LLM transfer protocol", "priority": 1}
    ],
    "constraints": [
      {"type": "must", "condition": "Use TypeScript for extension"},
      {"type": "must_not", "condition": "Share API keys in code"}
    ],
    "state": {
      "current_step": 15,
      "total_steps": 20,
      "pending_tasks": ["Dashboard", "Tests"],
      "completed_tasks": ["Compiler", "Verifier", "Ladder"]
    },
    "narrative": "Alice is building Neural Bridge, an LLM context transfer protocol. Currently at step 15 of 20, with dashboard and tests remaining."
  },
  "invariants": [
    {
      "id": "inv_001",
      "kind": "fact",
      "prompt": "What is the user's name?",
      "expected": {"type": "exact", "value": "Alice"},
      "weight": 1.0,
      "strict": true
    },
    {
      "id": "inv_002",
      "kind": "state",
      "prompt": "What step are we on?",
      "expected": {"type": "exact", "value": 15},
      "weight": 0.8,
      "strict": false
    }
  ]
}
```

---

## Appendix B: Compliance Test Suite

A compliant implementation MUST pass the following tests:

1. **CRYSTAL_PARSE**: Parse valid Crystal JSON without error
2. **CRYSTAL_INVALID**: Reject malformed Crystal with error
3. **VERIFY_PASS**: Accept when all strict invariants pass
4. **VERIFY_FAIL**: Reject when strict invariant fails
5. **LADDER_ESCALATE**: Escalate on soft failure
6. **LADDER_LIMIT**: Stop at max level
7. **TIMEOUT**: Terminate before timeout expires
8. **SCORE_RANGE**: Score always in [0.0, 1.0]

---

*End of RFC 0001*
