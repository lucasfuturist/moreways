import { describe, it, expect } from 'vitest';
import { IngestParsePdfAsync } from '../../src/ingest/svc/ingest.svc.parsePdf';
import { RawPdfLine } from '../../src/ingest/schema/ingest.schema.pdfInput';
import { v4 as uuidv4 } from 'uuid';

const mockLine = (text: string, page: number = 1, x: number = 1.0): RawPdfLine => ({
    text,
    pageNumber: page,
    bbox: [x, 2.0, 5.0, 0.2] 
});

describe('Ingest Service - PDF Parser (Stack Machine)', () => {
    
    it('should parse a standard MA CMR hierarchy correctly', async () => {
        const lines = [
            mockLine("940 CMR 3.00: GENERAL REGULATIONS", 1, 1.0), 
            mockLine("3.01: Definitions", 1, 1.0),                  
            mockLine("(1) Advertisement.", 1, 1.5),                 
            mockLine("(a) Meaning.", 1, 2.0),      
            mockLine("Any commercial message...", 1, 2.0),
            mockLine("3.02: False Advertising", 1, 1.0)             
        ];

        const job = { 
            jobId: uuidv4(), 
            sourceUrl: 'test', 
            jurisdiction: 'MA' as const, 
            corpus: '940 CMR',
            documentType: 'CONSOLIDATED_REGULATION' as const
        };

        const result = await IngestParsePdfAsync(lines, job);
        const root = result.nodeMap.get(result.rootId);

        // Expect 3 Top-Level Sections: "3.00", "3.01", "3.02"
        expect(root?.children.length).toBe(3); 

        const sec301Id = root?.children[1]!; 
        const sec301 = result.nodeMap.get(sec301Id);
        expect(sec301?.type).toBe('SECTION');
        expect(sec301?.content[0]).toContain("3.01: Definitions");

        const sub1Id = sec301?.children[0]!;
        const sub1 = result.nodeMap.get(sub1Id);
        expect(sub1?.type).toBe('SUBSECTION');
        
        const paraAId = sub1?.children[0]!;
        const paraA = result.nodeMap.get(paraAId);
        expect(paraA?.type).toBe('PARAGRAPH');

        const sec302Id = root?.children[2]!;
        const sec302 = result.nodeMap.get(sec302Id);
        expect(sec302?.type).toBe('SECTION');
    });

    it('should attach loose text to the active node', async () => {
        const lines = [
            mockLine("3.01: Definitions"),
            mockLine("This is a continuation line."),
            mockLine("And another line.")
        ];

        const job = { jobId: uuidv4(), sourceUrl: 'test', jurisdiction: 'MA' as const, corpus: 'test', documentType: 'CONSOLIDATED_REGULATION' as const };
        const result = await IngestParsePdfAsync(lines, job);
        
        const root = result.nodeMap.get(result.rootId);
        const section = result.nodeMap.get(root?.children[0]!);

        expect(section?.content.length).toBe(3);
        expect(section?.content[1]).toBe("This is a continuation line.");
    });
});