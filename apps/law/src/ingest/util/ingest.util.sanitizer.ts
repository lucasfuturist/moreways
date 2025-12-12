import { RawPdfLine } from '../schema/ingest.schema.pdfInput';

export function isHeaderFooter(line: RawPdfLine): boolean {
    const y = line.bbox[1];
    const text = line.text.trim();
    const squashed = text.replace(/\s+/g, "");

    // 1. Geometric Check (Relaxed Top)
    // [FIX] Tightened bottom margin to 10.5 (standard 1-inch footer zone on Letter paper)
    if (y < 0.5 || y > 10.5) return true;

    // 2. Page Numbers
    if (/^\d+$/.test(text) || /^page\s+\d+/i.test(text)) return true;
    if (/^\(Mass\. Register #\d+/.test(text)) return true; 

    // 3. Document Noise (Watermarks)
    if (text.includes("enhanced display") || text.includes("up to date as of")) return true;
    if (text.includes("This content is from the eCFR")) return true;
    if (text === "NON-TEXT PAGE") return true;

    // 4. MA CMR Running Headers
    if (text.includes("OFFICE OF THE ATTORNEY GENERAL")) return true;
    if (squashed.includes("OFFICEOFTHEATTORNEYGENERAL")) return true;
    if (squashed.includes("940CMR:OFFICE")) return true;
    
    // 5. Continued Markers
    if (/continued[:.]?$/i.test(text) && (/\d+\.\d+:/.test(text) || text.length < 30)) return true;

    // 6. Federal Running Headers
    // Independent check for squashed CFR headers that skips the Title check
    if (squashed.includes("16CFR310.4")) return true;

    if (text.includes("CFR")) {
        const isTelemarketing = text.includes("Telemarketing Sales Rule");
        const isDelivery = text.includes("Delivery restrictions");

        if (isTelemarketing || isDelivery) {
             if (/CFR\s+\d+\.\d+$/.test(text)) return true; 
             if (/\(\w+\)$/.test(text)) return true;
        }
    }

    return false;
}

export function sanitizeText(text: string): string {
    if (!text) return "";

    let clean = text.normalize("NFKC");

    // Iterative Wide Text Fix
    let prev = "";
    while (clean !== prev) {
        prev = clean;
        // Merge Alphanumerics
        clean = clean.replace(/\b([a-zA-Z0-9]) {1}(?=[a-zA-Z0-9]\b)/g, "$1");
        // Merge Punctuation boundaries
        clean = clean.replace(/([a-zA-Z0-9])\s+([:;.,-])\s+(?=[a-zA-Z0-9])/g, "$1$2");
    }

    clean = clean
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ");

    return clean.trim();
}