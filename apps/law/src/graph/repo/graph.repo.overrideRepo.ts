import { supabase } from '../../infra/supabase/infra.supabase.client';

export interface JudicialOverride {
  urn_pattern: string; // e.g. "urn:lex:ma:940cmr:3.17:*" (Wildcard support)
  type: 'ENJOINED' | 'VACATED' | 'STAYED' | 'PREEMPTED';
  court_citation: string; // "Google v. Oracle, 123 U.S. 456"
  message: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface IOverrideRepo {
  getOverrides(urn: string): Promise<JudicialOverride[]>;
}

/**
 * Escape regex metacharacters EXCEPT '*' (we treat '*' as a wildcard).
 */
export function overrideMatches(targetUrn: string, urnPattern: string): boolean {
  // Escape everything that has meaning in regex, leaving '*' alone for later replacement.
  // Note: we escape: . + ? ^ $ { } ( ) | [ ] \ 
  const escaped = urnPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  // Now convert wildcard '*' into '.*'
  const regex = new RegExp('^' + escaped.replace(/\*/g, '.*') + '$');
  return regex.test(targetUrn);
}

export class SupabaseOverrideRepo implements IOverrideRepo {
  async getOverrides(targetUrn: string): Promise<JudicialOverride[]> {
    const { data, error } = await supabase
      .from('judicial_overrides')
      .select('*')
      .eq('active', true);

    if (error || !data) return [];

    return (data as any[])
      .filter((o: any) => overrideMatches(targetUrn, o.urn_pattern))
      .map((o: any) => ({
        urn_pattern: o.urn_pattern,
        type: o.type,
        court_citation: o.court_citation,
        message: o.message,
        severity: o.severity
      }));
  }
}

// Mock for Testing / Local
export class MockOverrideRepo implements IOverrideRepo {
  private overrides: JudicialOverride[] = [];

  addOverride(o: JudicialOverride) {
    this.overrides.push(o);
  }

  async getOverrides(targetUrn: string): Promise<JudicialOverride[]> {
    return this.overrides.filter(o => overrideMatches(targetUrn, o.urn_pattern));
  }
}
