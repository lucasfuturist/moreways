import { describe, it, expect } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine, IngestJob } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a massive document programmatically.
 * 10,000 pages ~ 200,000 lines.
 */
function generateMassiveDoc(pageCount: number): RawPdfLine[] {
    const lines: RawPdfLine[] = [];
    
    for (let i = 1; i <= pageCount; i++) {
        // Add a Header (should be stripped)
        lines.push({ text: `Page ${i} of ${pageCount}`, pageNumber: i, bbox: [0.5, 0.2, 5, 0.2] });
        
        // Add a Section
        lines.push({ text: `${i}.00: Massive Section`, pageNumber: i, bbox: [1, 1, 5, 0.2] });
        
        // Add 20 Paragraphs per page
        for (let j = 0; j < 20; j++) {
            lines.push({ 
                text: `(${j}) This is a legal paragraph with enough text to consume memory strings.`, 
                pageNumber: i, 
                bbox: [1.5, 1.2 + (j * 0.1), 5, 0.2] 
            });
        }
    }
    return lines;
}

describe('Stress Testing - Memory & Scaling', () => {

    // Increase timeout to 30 seconds for the big run
    it('should ingest 5,000 pages without blowing the Heap limit', async () => {
        
        const PAGE_COUNT = 5000;
        console.log(`[Memory] Generating ${PAGE_COUNT} pages of raw data...`);
        
        const bigDoc = generateMassiveDoc(PAGE_COUNT);
        const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        
        console.log(`[Memory] Baseline Heap: ${startMemory.toFixed(2)} MB`);
        console.log(`[Memory] Input Size: ${bigDoc.length} lines`);

        const job: IngestJob = {
            jobId: uuidv4(),
            sourceUrl: 'stress://memory',
            jurisdiction: 'MA',
            corpus: 'stress-test',
            documentType: 'CONSOLIDATED_REGULATION'
        };

        const startTime = Date.now();
        
        // --- THE HEAVY LIFT ---
        const result = await IngestParsePdfAsync(bigDoc, job);
        // ----------------------

        const endTime = Date.now();
        const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        
        console.log(`[Memory] Post-Ingest Heap: ${endMemory.toFixed(2)} MB`);
        console.log(`[Memory] Delta: +${(endMemory - startMemory).toFixed(2)} MB`);
        console.log(`[Memory] Time: ${(endTime - startTime)}ms`);
        console.log(`[Memory] Nodes Created: ${result.nodeMap.size}`);

        // ASSERTIONS
        
        // 1. Efficiency Check: Should handle ~10k lines per second (adjust based on machine)
        // 5000 pages * 20 lines = 100,000 lines. Should take < 5 seconds ideally.
        expect(endTime - startTime).toBeLessThan(10000); 

        // 2. Leak Check: 
        // 100k nodes shouldn't take more than ~200MB of extra Heap if strict.
        // If this is 1GB+, we have a problem.
        const usedMB = endMemory - startMemory;
        expect(usedMB).toBeLessThan(500); 
    }, 30000); // Set test timeout
});