import { describe, it, expect } from 'vitest';
import { isHeaderFooter, sanitizeText } from '../../src/ingest/util/ingest.util.sanitizer';
import { RawPdfLine } from '../../src/ingest/schema/ingest.schema.pdfInput';

describe('Sanitizer & Header Detection Debug', () => {

    // Helper to create a mock line
    const makeLine = (text: string, y: number = 5.0): RawPdfLine => ({
        text,
        pageNumber: 1,
        bbox: [1.0, y, 10.0, 0.2],
        confidence: 1.0
    });

    describe('isHeaderFooter (Noise Killer)', () => {
        
        it('should detect MA Running Headers (Standard)', () => {
            const line = makeLine("940 CMR: OFFICE OF THE ATTORNEY GENERAL", 1.0);
            expect(isHeaderFooter(line)).toBe(true);
        });

        it('should detect MA Running Headers (Squashed/Merged)', () => {
            // This is likely what is happening: "Wide Text" merging removes spaces
            const line = makeLine("940CMR:OFFICEOFTHEATTORNEYGENERAL", 1.0);
            
            // This test is expected to FAIL currently, revealing the bug
            expect(isHeaderFooter(line)).toBe(true); 
        });

        it('should detect "continued" markers', () => {
            expect(isHeaderFooter(makeLine("3.01: continued"))).toBe(true);
            expect(isHeaderFooter(makeLine("Section 3.01: continued"))).toBe(true);
        });

        it('should detect "continued" markers even if squashed', () => {
            expect(isHeaderFooter(makeLine("3.01:continued"))).toBe(true);
        });

        it('should detect Federal headers in middle of text', () => {
            const line = makeLine("Telemarketing Sales Rule 16 CFR 310.4", 5.0);
            expect(isHeaderFooter(line)).toBe(true);
        });
        
        it('should NOT kill valid Federal Definitions', () => {
            const line = makeLine("47 CFR 64.1200 Delivery restrictions.", 5.0);
            expect(isHeaderFooter(line)).toBe(false);
        });
    });

    describe('sanitizeText (Text Cleaning)', () => {
        
        it('should merge Wide Text (Capitalized)', () => {
            const input = "T I T L E";
            expect(sanitizeText(input)).toBe("TITLE");
        });

        it('should merge Wide Text (Mixed Case)', () => {
            // "Telemarketing" spaced out
            const input = "T e l e m a r k e t i n g";
            expect(sanitizeText(input)).toBe("Telemarketing");
        });

        it('should NOT merge valid separate words', () => {
            const input = "I am a lawyer";
            expect(sanitizeText(input)).toBe("I am a lawyer");
        });

        it('should handle the specific garbled CMR header if possible', () => {
            // Simulating the merged header found in your JSON
            const input = "9 4 0 C M R : O F F I C E";
            expect(sanitizeText(input)).toBe("940CMR:OFFICE"); 
            // Note: If sanitizeText runs BEFORE isHeaderFooter, 
            // the header detector must handle "940CMR:OFFICE..."
        });
    });
});