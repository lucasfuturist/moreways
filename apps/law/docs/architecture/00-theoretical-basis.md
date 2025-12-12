# 00 – Theoretical Basis: Deterministic Legal Retrieval

**Status:** Ratified  
**Version:** 1.0  
**Context:** Core Philosophy

## 1. Abstract: The Problem of Stochastic Retrieval
Standard Retrieval-Augmented Generation (RAG) architectures rely heavily on vector similarity (semantic search). In the domain of jurisprudence, this stochastic approach is fundamentally flawed due to three specific failures:

1.  **Scope Blindness:** Vector search cannot distinguish between a global definition (applies to the whole statute) and a local definition (applies only to a specific paragraph).
2.  **The "Term of Art" Collision:** Legal terms often share lexical tokens with common English but possess divergent definitions. A vector embedding for "Consideration" (thoughtfulness) differs from the legal concept (contractual value).
3.  **Hierarchy Collapse:** Laws are Directed Acyclic Graphs (DAGs) of dependency. A child node (Subsection) is meaningless without the context of its parent (Section) and the authority of its root (Statute). Flattening this into vector chunks destroys the inheritance chain.

## 2. The Solution: A Deterministic Legal State Machine
We reject the "Bag of Words" model in favor of a **Strict Hierarchical Knowledge Graph**. The system parses statutes into a structured, addressable DOM (Document Object Model).

### 2.1 Principle of Addressability
Every atom of law (part, section, paragraph) is assigned a globally unique, immutable Uniform Resource Name (URN). This allows for $O(1)$ lookup complexity and precise citation.

### 2.2 Principle of Inheritance
Logic flows strictly downwards. A child node inherits constraints, definitions, and authority from its ancestor nodes via materialized paths. Validity is calculated, not inferred.

### 2.3 Principle of Temporal Immutability
Law is a function of time, denoted as $L(t)$. The system utilizes Slowly Changing Dimensions (SCD Type 2) to ensure that a query regarding a specific date returns the law *as it existed on that date*, preserving historical integrity.

## 3. The "Anti-Hallucination" Guarantee
We do not ask the LLM "What is the law?" We ask the LLM "Given this specific, deterministically assembled graph of nodes, how does it apply to the user's scenario?"

The **existence** of the law is a database fact; only the **interpretation** is generative.