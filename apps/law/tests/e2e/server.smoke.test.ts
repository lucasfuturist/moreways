import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/server'; 

describe('E2E - API Server', () => {
    
    it('should respond to health check', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('should reject invalid search payloads with 400', async () => {
        const res = await request(app)
            .post('/api/v1/search')
            .send({ jurisdiction: 'MA' }); // Missing 'query'
        
        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Validation");
    });
});