import { describe, it, expect } from 'vitest';
import { isHeaderFooter, sanitizeText } from '../../src/ingest/util/ingest.util.sanitizer';
import { RawPdfLine } from '../../src/ingest/schema/ingest.schema.pdfInput';

describe('🛡️ Sanitizer "Torture Chamber" Test Suite', () => {

    // Helper: Create a mock PDF line with defaults
    const makeLine = (text: string, y: number = 5.0): RawPdfLine => ({
        text,
        pageNumber: 1,
        bbox: [1.0, y, 10.0, 0.2], // Standard body location
        confidence: 1.0
    });

    // =========================================================================
    // 1. TEXT CLEANING & WIDE TEXT REASSEMBLY
    // =========================================================================
    describe('sanitizeText() - The Reassembler', () => {
        
        it('should merge standard uppercase wide text', () => {
            // "T I T L E" -> "TITLE"
            const input = "T I T L E";
            expect(sanitizeText(input)).toBe("TITLE");
        });

        it('should merge mixed-case wide text (The "Lateral" Bug)', () => {
            // "L a t e r a l" -> "Lateral"
            const input = "L a t e r a l";
            expect(sanitizeText(input)).toBe("Lateral");
        });

        it('should merge wide text with numbers', () => {
            // "S e c t i o n  1 0 1" -> "Section 101"
            const input = "S e c t i o n  1 0 1";
            expect(sanitizeText(input)).toBe("Section 101");
        });

        it('should handle the "Garbled Header" (Punctuation Boundaries)', () => {
            // This was the specific 940 CMR bug: "C M R : O F F I C E"
            // The colon was breaking the alphanumeric merge.
            const input = "9 4 0 C M R : O F F I C E";
            expect(sanitizeText(input)).toBe("940CMR:OFFICE");
        });

        it('should collapse multiple spaces', () => {
            const input = "This    has    too    many    spaces.";
            expect(sanitizeText(input)).toBe("This has too many spaces.");
        });

        it('should normalize smart quotes and dashes', () => {
            const input = "“Hello” – World"; // Smart quotes + En-dash
            expect(sanitizeText(input)).toBe('"Hello" - World');
        });

        it('should NOT merge valid single-letter words', () => {
            // "I am a lawyer" -> "I am a lawyer"
            const input = "I am a lawyer"; 
            expect(sanitizeText(input)).toBe("I am a lawyer");
        });
    });

    // =========================================================================
    // 2. HEADER & FOOTER DETECTION
    // =========================================================================
    describe('isHeaderFooter() - The Executioner', () => {

        describe('📐 Geometry Checks', () => {
            it('should kill text too high (Top Margin)', () => {
                const line = makeLine("Valid looking text", 0.4); // y < 0.5
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill text too low (Bottom Margin)', () => {
                const line = makeLine("Valid looking footer", 11.6); // y > 11.5
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should keep text in the safe zone', () => {
                const line = makeLine("Valid body text", 1.0);
                expect(isHeaderFooter(line)).toBe(false);
            });
        });

        describe('🏛️ MA CMR Specifics', () => {
            it('should kill the standard Running Header', () => {
                const line = makeLine("940 CMR: OFFICE OF THE ATTORNEY GENERAL");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill the Garbled/Squashed Running Header', () => {
                // This simulates what happens after sanitizeText merges it
                const line = makeLine("940CMR:OFFICEOFTHEATTORNEYGENERAL");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill "continued" markers (Standard)', () => {
                const line = makeLine("3.01: continued");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill "continued" markers (Section prefix)', () => {
                const line = makeLine("Section 3.01: continued");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill "continued" markers (Garbled/Squashed)', () => {
                const line = makeLine("3.01:continued");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should NOT kill a valid Section definition', () => {
                const line = makeLine("3.01: Definitions");
                expect(isHeaderFooter(line)).toBe(false);
            });
        });

        describe('🦅 Federal CFR Specifics', () => {
            it('should kill Federal Running Headers (Citation at End)', () => {
                // "Telemarketing Sales Rule 16 CFR 310.4"
                const line = makeLine("Telemarketing Sales Rule 16 CFR 310.4");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill Federal Running Headers (With Parens)', () => {
                // "Delivery restrictions 47 CFR 64.1200(a)(3)"
                const line = makeLine("Delivery restrictions 47 CFR 64.1200(a)(3)");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should kill Squashed Federal Headers', () => {
                const line = makeLine("16CFR310.4");
                expect(isHeaderFooter(line)).toBe(true);
            });

            it('should NOT kill valid Federal Section Titles', () => {
                // Valid: "47 CFR 64.1200 Delivery restrictions."
                const line = makeLine("47 CFR 64.1200 Delivery restrictions.");
                expect(isHeaderFooter(line)).toBe(false);
            });

            it('should NOT kill valid Section symbols', () => {
                const line = makeLine("§ 310.4 Abusive telemarketing acts.");
                expect(isHeaderFooter(line)).toBe(false);
            });
        });

        describe('🗑️ General Noise', () => {
            it('should kill Page Numbers', () => {
                expect(isHeaderFooter(makeLine("21"))).toBe(true);
                expect(isHeaderFooter(makeLine("Page 21 of 50"))).toBe(true);
            });

            it('should kill MA Register Footers', () => {
                expect(isHeaderFooter(makeLine("(Mass. Register #1420 6/26/20)"))).toBe(true);
            });

            it('should kill eCFR Watermarks', () => {
                expect(isHeaderFooter(makeLine("This content is from the eCFR..."))).toBe(true);
            });
        });
    });
});