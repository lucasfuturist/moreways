/**
 * CLEANS LEGAL TEXT FOR PRESENTATION
 * Fixes PDF artifacts without altering legal meaning.
 */
export function formatLegalText(raw: string): string {
    if (!raw) return "";

    let text = raw;

    // 1. Fix Broken Hyphenation across lines
    // "unreason-\nably" -> "unreasonably"
    text = text.replace(/([a-z])-\n([a-z])/g, '$1$2');

    // 2. Fix Hard Line Breaks within sentences
    // "This is a sentence\nthat was split." -> "This is a sentence that was split."
    // Logic: If line ends with a letter/comma and next line starts with lowercase, join them.
    text = text.replace(/([a-zA-Z,])\n([a-zA-Z])/g, '$1 $2');

    // 3. Fix "All Caps" Headers (Optional - Visual Polish)
    // "SECTION 10.05: GOODS AND SERVICES" -> "Section 10.05: Goods And Services"
    // Only applies if the whole line is uppercase and looks like a header
    /* 
    text = text.replace(/^([A-Z0-9\s\.:]+)$/gm, (match) => {
        if (match.length < 5) return match; // Skip short acronyms like "M.G.L."
        return match.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); // Title Case
    });
    */

    // 4. Collapse Multiple Spaces
    text = text.replace(/[ \t]+/g, ' ');

    return text.trim();
}