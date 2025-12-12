import { IDatabaseClient } from '../../src/graph/repo/graph.repo.nodeRepo';
import { LegalNodeRecord } from '../../src/graph/schema/graph.schema.nodes';

export class MockDbClient implements IDatabaseClient {
  public storedRecords: LegalNodeRecord[] = [];

  async bulkInsertNodes(records: LegalNodeRecord[]): Promise<void> {
    this.storedRecords.push(...records);
  }

  async fetchActiveNodes(urns: string[]): Promise<LegalNodeRecord[]> {
    return this.storedRecords.filter(r => 
      urns.includes(r.urn) && r.validity_range.endsWith(',)')
    );
  }

  async expireNodes(ids: string[], expiryDate: string): Promise<void> {
    this.storedRecords.forEach(r => {
      if (ids.includes(r.id)) {
        const start = r.validity_range.split(',')[0];
        r.validity_range = `${start},${expiryDate.split('T')[0]})`;
      }
    });
  }
}