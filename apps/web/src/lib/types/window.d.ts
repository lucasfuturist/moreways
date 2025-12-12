export {};

declare global {
  interface Window {
    MW_CONFIG?: {
      publicKey: string;
      endpoint: string;
      autoCapture?: boolean;
    };
    moreways?: {
      init: (config: any) => void;
      consent: (policy: { ad_storage?: 'granted' | 'denied'; analytics_storage?: 'granted' | 'denied' }) => void;
      track: (event: string, data?: any) => void;
    };
  }
}