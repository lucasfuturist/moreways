import { ParsingProfile } from '../../shared/types/ingest.types';

export type RegexProfile = { name: string; regex: RegExp; depth: number }[];

export function getProfileForJurisdiction(jurisdiction: 'MA' | 'FED'): RegexProfile {
    if (jurisdiction === 'MA') return MA_CMR_Profile.levels;
    if (jurisdiction === 'FED') return US_CFR_Profile.levels;
    // Fallback/Default
    return US_CFR_Profile.levels;
}

export const MA_CMR_Profile: ParsingProfile = {
    jurisdiction: "MA",
    levels: [
        // Level 1: SECTION
        // Matches "10.01: Definitions" or "Section 105"
        { 
            name: "SECTION", 
            regex: /^\s*(?:Section\s+|(?:\d{1,4}\s+CMR\s+)?)?(\d{1,3}\.\d{2,}|\d+[A-Z]*)(?:[:\s]).*?$/i,  
            depth: 1 
        },
        
        // [NEW] Level 2: DEFINITIONS
        // Matches "Contractor: means..." or "Act: shall mean..."
        // We map this to 'DEFINITION' instead of 'SUBSECTION' for better semantics.
        { 
            name: "DEFINITION", 
            regex: /^\s*([A-Z][a-zA-Z0-9\s\-\/]{1,50}):\s+(?:means|shall|is defined)/, 
            depth: 2 
        },

        // Level 2: Standard Subsections (e.g. "(1)")
        { name: "SUBSECTION", regex: /^\s*\(\d{1,2}\)/, depth: 2 },
        
        // Level 3: Paragraphs (e.g. "(a)")
        { name: "PARAGRAPH", regex: /^\s*\([a-z]\)/, depth: 3 },
        
        // Level 4: Subparagraphs (e.g. "1.")
        { name: "SUBPARAGRAPH", regex: /^\s*\d{1,2}\./, depth: 4 },
        
        // Level 5: Items (e.g. "(i)")
        { name: "ITEM", regex: /^\s*\([ivx]+\)/i, depth: 5 } 
    ]
};

export const US_CFR_Profile: ParsingProfile = {
    jurisdiction: "FED",
    levels: [
        // Level 1: Federal Sections (e.g. "§ 310.4", "310.4", "15 U.S.C. 1692")
        { 
            name: "SECTION", 
            regex: /^\s*(?:§|Sec\.|Section|Part)?\s*(\d+[\.-]\d+|15\s+U\.?S\.?C\.?\s+(?:§\s*)?[\d\w]+|[IVX]+\.).*?$/i,
            depth: 1 
        },
        // Federal hierarchy typically goes (a) -> (1) -> (i)
        { name: "PARAGRAPH", regex: /^\s*\([a-z]\)/, depth: 2 },
        { name: "SUBPARAGRAPH", regex: /^\s*\(\d{1,2}\)/, depth: 3 },
        { name: "ITEM", regex: /^\s*\([ivx]+\)/i, depth: 4 }
    ]
};