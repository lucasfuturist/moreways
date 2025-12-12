# 03 – Ingestion Protocol & Parsing Algorithm

**Status:** Ratified  
**Version:** 1.0  
**Context:** Parsing Logic

## 1. Overview
The ingestion pipeline is an "Adversarial" process. It combines strict Layout Analysis (Regex/Coordinate) with Semantic Analysis (LLM) to verify data integrity before commitment.

## 2. The Parsing Stack Machine
Legal text parsing is state-dependent. The meaning of `(a)` depends entirely on the parent section. We implement a **Pushdown Automaton (Stack Machine)**.

**Algorithm:**
```typescript
Initialize Stack = [RootNode]

For each Line in Document:
  1. Sanitize: Normalize Unicode (NFC), strip ligatures.
  2. Detect Level: Compare Line against Profile Regex (e.g., /^\(\d\)/).
  
  If Level Detected:
     CurrentDepth = Level.depth
     StackDepth = Stack.last().depth
     
     // Pop until we find the valid parent
     While StackDepth >= CurrentDepth:
       Pop Stack (Close current node)
       
     Parent = Stack.last()
     NewNode = CreateNode(Line, Parent)
     Parent.AddChild(NewNode)
     Push NewNode to Stack
     
  Else:
     Stack.last().AppendText(Line)
```

## 3. Integrity Gates
No data enters the `PUBLISHED` state without passing three gates:

*   **Gate A: The Linter.**
    *   *Check:* Do all cross-references (e.g., "see Section 3.05") point to existing URNs?
    *   *Action:* If target missing -> Flag Warning.
*   **Gate B: The Golden Set.**
    *   *Check:* Does the parsed output of a known control file match the cryptographically signed Expected Output?
    *   *Action:* If mismatch -> Abort Commit.
*   **Gate C: The Zoning Filter.**
    *   *Check:* Is the detected page a Table of Contents or Index?
    *   *Action:* If density of "....." > threshold -> Discard Page.
