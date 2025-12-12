import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 200 }, // Load 200 req/sec (High Traffic)
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<100'], // 95% of requests must be under 100ms
    http_req_failed: ['rate<0.01'], // <1% Failure allowed
  },
};

export default function () {
  const url = 'http://localhost:3000/api/v1/track';
  const payload = JSON.stringify({
    type: 'pageview',
    anonymousId: 'k6-load-test-uuid',
    consent: { ad_storage: 'granted', analytics_storage: 'granted' },
    context: { url: 'https://load-test.com', user_agent: 'K6/LoadRunner' },
    _quality: { score: 100 }
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-key': 'pk_load_test_key', // Ensure this exists in your local DB or mock
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'queued successfully': (r) => r.json('queued') === true,
  });

  sleep(0.1);
}