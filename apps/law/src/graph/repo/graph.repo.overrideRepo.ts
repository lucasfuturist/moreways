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

export class SupabaseOverrideRepo implements IOverrideRepo {
  
  async getOverrides(targetUrn: string): Promise<JudicialOverride[]> {
    // Logic: Find any override where the target URN matches the pattern.
    // In SQL, this is often `targetUrn LIKE pattern`.
    // Since we are checking if a specific URN is covered by a broader ban:
    // We fetch all active overrides and check regex in memory (for speed/simplicity in this layer)
    // or rely on Postgres pattern matching.
    
    // Simplification: We fetch *all* overrides for the jurisdiction/corpus 
    // and filter in memory to handle the glob matching "3.17:*"
    
    const { data, error } = await supabase
      .from('judicial_overrides')
      .select('*')
      .eq('active', true);

    if (error || !data) return [];

    return data.filter((o: any) => {
        // Convert SQL-like glob "3.17:*" to Regex "^3.17:.*"
        const regex = new RegExp('^' + o.urn_pattern.replace('*', '.*') + '$');
        return regex.test(targetUrn);
    }).map((o: any) => ({
        urn_pattern: o.urn_pattern,
        type: o.type,
        court_citation: o.court_citation,
        message: o.message,
        severity: o.severity
    }));
  }
}

// Mock for Testing
export class MockOverrideRepo implements IOverrideRepo {
  private overrides: JudicialOverride[] = [];

  addOverride(o: JudicialOverride) {
    this.overrides.push(o);
  }

  async getOverrides(targetUrn: string): Promise<JudicialOverride[]> {
    return this.overrides.filter(o => {
        const regex = new RegExp('^' + o.urn_pattern.replace(/\*/g, '.*') + '$');
        return regex.test(targetUrn);
    });
  }
}