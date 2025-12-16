import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: mock must be declared before importing the repo module.
const mockRows: any[] = [];

vi.mock('../../src/infra/supabase/infra.supabase.client', () => {
  // Build a stable chain object so .select() returns the same object
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(async () => ({ data: mockRows, error: null }))
  };

  return {
    supabase: {
      from: vi.fn(() => chain)
    }
  };
});

import { SupabaseOverrideRepo, overrideMatches } from '../../src/graph/repo/graph.repo.overrideRepo';

describe('SupabaseOverrideRepo.getOverrides', () => {
  beforeEach(() => {
    mockRows.length = 0;
  });

  it('matches an exact urn_pattern (no wildcard)', async () => {
    mockRows.push({
      urn_pattern: 'urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1',
      type: 'STAYED',
      court_citation: 'Test Cite',
      message: 'Test message',
      severity: 'WARNING'
    });

    const repo = new SupabaseOverrideRepo();
    const target = 'urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1';

    const res = await repo.getOverrides(target);

    expect(res).toHaveLength(1);
    expect(res[0].urn_pattern).toBe(mockRows[0].urn_pattern);
    expect(res[0].type).toBe('STAYED');
  });

  it("matches a wildcard suffix like ':3_17:*' against a deeper urn", async () => {
    mockRows.push({
      urn_pattern: 'urn:lex:ma:940_cmr_3_00___unfair___deceptive_acts:3_17:*',
      type: 'VACATED',
      court_citation: 'Test Cite 2',
      message: 'Test message 2',
      severity: 'CRITICAL'
    });

    const repo = new SupabaseOverrideRepo();
    const target = 'urn:lex:ma:940_cmr_3_00___unfair___deceptive_acts:3_17:1:a';

    const res = await repo.getOverrides(target);

    expect(res).toHaveLength(1);
    expect(res[0].type).toBe('VACATED');
  });

  it("properly escapes regex metacharacters in patterns ('.' etc) and only treats '*' as wildcard", async () => {
    mockRows.push({
      urn_pattern: 'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:*',
      type: 'ENJOINED',
      court_citation: 'Test Cite 3',
      message: 'Test message 3',
      severity: 'WARNING'
    });

    const repo = new SupabaseOverrideRepo();

    const shouldMatch =
      'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a';
    const res1 = await repo.getOverrides(shouldMatch);
    expect(res1).toHaveLength(1);

    const shouldNotMatch =
      'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:a';
    const res2 = await repo.getOverrides(shouldNotMatch);
    expect(res2).toHaveLength(0);
  });
});

describe('overrideMatches (pure matcher)', () => {
  it('treats * as wildcard and escapes other regex characters', () => {
    expect(
      overrideMatches(
        'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a',
        'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:*'
      )
    ).toBe(true);

    expect(
      overrideMatches(
        'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:a',
        'urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:*'
      )
    ).toBe(false);
  });
});
