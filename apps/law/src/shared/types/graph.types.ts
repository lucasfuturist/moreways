export interface LegalNode {
    id: string; // Internal UUID
    urn: string; // Canonical Name
    parentId: string | null;
    jurisdiction: "MA" | "FED";
    content_text: string;
    citation: string;
    structure_type: "PART" | "SECTION" | "SUBSECTION" | "PARAGRAPH" | "ROOT";
    citation_path: string; // ltree format
    source_file_hash: string;
    logic_summary?: Record<string, any>;
}