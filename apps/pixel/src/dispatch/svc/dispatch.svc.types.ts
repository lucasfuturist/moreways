// File: src/dispatch/svc/dispatch.svc.types.ts
// Role: Interface contract for Ad Platform Adapters

import { EventPayload } from '../../ingest/types/ingest.types.payload';

export interface AdPlatformAdapter {
  /**
   * unique identifier for the platform (e.g. 'meta', 'tiktok')
   * Used for logging and database status keys
   */
  key: string; 

  /**
   * Checks if the tenant configuration has the required credentials
   * to enable this platform.
   */
  isEnabled: (config: any) => boolean; 

  /**
   * The core logic to map the internal event format to the external API payload
   * and execute the HTTP request.
   */
  send: (event: EventPayload, config: any, eventId: string) => Promise<any>;
}