import { IGraphReader } from '../../retrieve/svc/retrieve.svc.contextAssembler';
import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';
import { supabase } from './infra.supabase.client';

export class SupabaseGraphReader implements IGraphReader {
  
  async getNodeByUrn(urn: string): Promise<LegalNodeRecord | null> {
    const { data, error } = await supabase
      .from('legal_nodes')
      .select('*')
      .eq('urn', urn)
      .single();
    
    if (error || !data) return null;
    return data as LegalNodeRecord;
  }

  async getNodeById(id: string): Promise<LegalNodeRecord | null> {
    const { data, error } = await supabase
      .from('legal_nodes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return data as LegalNodeRecord;
  }

  async getAncestors(citationPath: string, targetUrn?: string): Promise<LegalNodeRecord[]> {
    const { data } = await supabase
      .from('legal_nodes')
      .select('*')
      .filter('citation_path', 'cs', citationPath)
      .order('citation_path');

    let ancestors = (data || []).filter(this.isActive);

    if (targetUrn) {
        ancestors = ancestors.filter(ancestor => 
            targetUrn.startsWith(ancestor.urn + ':') || 
            targetUrn === ancestor.urn
        );
    }
    return ancestors as LegalNodeRecord[];
  }

  // [FIX] CHANGED STRATEGY: Use URN Prefixing (Like the Reconstruction Script)
  // We added an optional 'urn' parameter to support this robust lookup.
  async getChildren(citationPath: string, parentUrn?: string): Promise<LegalNodeRecord[]> {
    
    // If we have the URN, use the "Reconstruction Script" logic (Reliable)
    if (parentUrn) {
        console.log(`[Reader] Fetching children via URN prefix: ${parentUrn}`);
        const { data } = await supabase
            .from('legal_nodes')
            .select('*')
            // Find everything that starts with "parent_urn:"
            .ilike('urn', `${parentUrn}:%`) 
            // Sort by path so they appear in reading order
            .order('citation_path', { ascending: true })
            .limit(100);

        return (data || []).filter(this.isActive) as LegalNodeRecord[];
    }

    // Fallback to Ltree (Old way)
    const ltreePattern = `${citationPath}.*{1,}`; 
    const { data } = await supabase
      .from('legal_nodes')
      .select('*')
      .filter('citation_path', 'match', ltreePattern)
      .limit(50); 
    
    return (data || []).filter(this.isActive) as LegalNodeRecord[];
  }

  async getSiblings(citationPath: string, targetUrn: string): Promise<LegalNodeRecord[]> {
    const segments = citationPath.split('.');
    if (segments.length <= 2) return [];

    const parentPath = segments.slice(0, -1).join('.');
    const ltreePattern = `${parentPath}.*{1}`;

    const { data } = await supabase
        .from('legal_nodes')
        .select('*')
        .filter('citation_path', 'match', ltreePattern)
        .order('citation_path')
        .limit(20);

    const parts = targetUrn.split(':');
    const corpusPrefix = parts.length >= 4 ? parts.slice(0, 4).join(':') : targetUrn;

    const active = (data || []).filter(n => {
        if (!this.isActive(n)) return false;
        return n.urn.startsWith(corpusPrefix);
    });

    return active as LegalNodeRecord[];
  }

  async getScopedDefinitions(ancestorIds: string[]): Promise<LegalNodeRecord[]> {
    if (ancestorIds.length === 0) return [];
    const { data } = await supabase
      .from('legal_nodes')
      .select('*')
      .in('parentId', ancestorIds)
      .ilike('content_text', '%mean%'); 
    return (data || []).filter(this.isActive) as LegalNodeRecord[];
  }

  private isActive(node: any): boolean {
    const range = node.validity_range;
    if (typeof range !== 'string') return true; 
    return range.endsWith(',)') || range.toLowerCase().includes('infinity');
  }
}