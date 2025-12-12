export interface ParsingLevel {
    name: string;
    regex: RegExp;
    depth: number;
}

export interface ParsingProfile {
    jurisdiction: "MA" | "FED";
    levels: ParsingLevel[];
}

export interface IngestedNode {
    id: string; // UUID
    urn: string;
    text: string;
    type: string;
    citation: string;
    parentId: string | null;
    source_file_hash: string;
    metadata?: Record<string, any>;
}