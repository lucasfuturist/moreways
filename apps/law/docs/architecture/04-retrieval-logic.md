# 04 – Retrieval Logic & Scoped Context Resolution

**Status:** Ratified  
**Version:** 1.0  
**Context:** Search Logic

## 1. The Theory of Scoped Context
A legal rule is an atomic unit of logic that exists within an inheritance tree. To evaluate a rule $R$, we must reconstruct its context $C(R)$ deterministically. The output of this function is not a probability; it is a rigid set of constraints.

$$C(R) = R \cup Ancestors(R) \cup Definitions(R) \cup Exceptions(R)$$

## 2. The Retrieval Algorithm
The system executes a deterministic sequence to construct $C(R)$. This pipeline replaces the standard "Top-K Vector Search" found in generic RAG applications.

### Step 1: Entry Point Discovery (Hybrid)
*   **Input:** User Query (e.g., "Landlord didn't pay interest on security deposit.")
*   **Process:**
    1.  **Keyword Extraction:** Identify Terms of Art ("Landlord", "Interest", "Security Deposit").
    2.  **Vector Search:** Find nodes semantically close to the query embedding.
    3.  **Keyword Boosting:** heavily weight nodes that contain exact matches for statutory terms defined in the `legal_synonyms` table.
*   **Result:** A set of candidate Rule URNs (e.g., `urn:lex:ma:940cmr:3.17:4`).

### Step 2: Ancestry Resolution (`ltree`)
*   **Query:** Fetch the "Vertical Slice" of the law.
    ```sql
    SELECT * FROM legal_nodes WHERE citation_path @> 'root.part_3.sec_17.sub_4'
    ```
*   **Result:** Returns the specific Paragraph, the Regulation (3.17), the Section (3.00), and the enabling Statute (93A). This captures global intent and authority.

### Step 3: Variable Shadowing (Definition Resolution)
*   **Query:** Find all nodes of type `DEFINITION` that are ancestors of the target.
*   **Logic:** Implement "Variable Shadowing" (closest ancestor wins).
    *   *Global Def:* "Owner" = Title Holder (Section 3.00).
    *   *Local Def:* "Owner" = Title Holder OR Property Manager (Section 3.17).
    *   *Resolution:* For this query, the Local Definition shadows the Global one.
*   **Result:** A precise dictionary of terms applicable *only* to this specific rule.

### Step 4: Preemption & Override Check
*   **Query:** Check `judicial_overrides` and `federal_preemption` tables for the target URN.
*   **Logic:** 
    *   If status is `VOID` or `ENJOINED`, halt execution and return "Legal Override active."
    *   If a Federal node overlaps (e.g., 16 CFR 310 vs 940 CMR), flag a "Supremacy Clause Warning."

### Step 5: LLM Synthesis
*   **Prompt:** Construct a rigid prompt containing **ONLY** the deterministically resolved Context $C(R)$ and the User Scenario.
*   **Constraint:** "Answer strictly based on the provided context. Do not use outside knowledge. Cite specific URNs for every assertion."

## 3. Response Guarantee
By forcing the LLM to operate solely on the deterministically assembled $C(R)$, we eliminate hallucination regarding the *existence* of laws. The model's role is restricted to **logical inference**, not **knowledge retrieval**.