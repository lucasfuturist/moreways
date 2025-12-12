import { Request, Response, NextFunction } from 'express';
import { SupabaseGraphReader } from '../../infra/supabase/infra.supabase.reader';
import { z } from 'zod';
import { formatLegalText } from '../../shared/utils/formatter';

const NodeRequestSchema = z.object({
    id: z.string().min(1)
});

export class NodeController {
    constructor(private readonly reader: SupabaseGraphReader) {}

    public handleGetNode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = NodeRequestSchema.parse(req.params);
            
            console.log(`[API] 🔍 Fetching node: ${id}`);

            let node = null;
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

            if (isUuid) {
                node = await this.reader.getNodeById(id);
            } else {
                const decodedUrn = decodeURIComponent(id);
                node = await this.reader.getNodeByUrn(decodedUrn);
            }

            if (!node) {
                return res.status(404).json({ error: "Node not found" });
            }

            let fullText = node.content_text;
            
            // [FIX] Logic Update:
            // 1. We now pass 'node.urn' to getChildren to use the robust prefix match.
            // 2. We allow grabbing children for any non-leaf node (Section, Subsection, etc.)
            if (node.structure_type !== 'PARAGRAPH' && node.structure_type !== 'SUBPARAGRAPH' && node.structure_type !== 'DEFINITION') {
                
                // Pass node.urn as the 2nd argument to trigger the new logic
                const children = await this.reader.getChildren(node.citation_path, node.urn);
                
                if (children.length > 0) {
                    const childrenText = children
                        .filter(c => c.id !== node.id) // Exclude self if returned
                        .map(c => c.content_text)
                        .join('\n\n');
                    
                    if (childrenText) {
                        fullText = `${fullText}\n\n${childrenText}`;
                    }
                }
            }

            const response = {
                data: {
                    ...node,
                    content_text: formatLegalText(fullText),
                    meta: {
                        is_definition: node.structure_type === 'DEFINITION',
                        depth: node.citation_path.split('.').length
                    }
                }
            };

            return res.json(response);

        } catch (error) {
            next(error);
        }
    }
}