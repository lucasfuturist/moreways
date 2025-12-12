import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/server'; // Imports the app directly

describe('Live API Debugging', () => {
    
    // Increase timeout to 20s because OpenAI + Database can be slow
    it('should answer the Do Not Call question correctly', async () => {
        
        console.log("🚀 Sending Request to In-Memory Server...");

        const response = await request(app)
            .post('/api/v1/search')
            .send({ 
                query: "can I call someone who is on the do not call list?" 
            });

        // 1. Log the Raw Output for debugging
        console.log('\n================ API RESPONSE ================');
        console.log(JSON.stringify(response.body, null, 2));
        console.log('==============================================\n');

        // 2. Assertions
        expect(response.status).toBe(200);
        
        // This is the check that is currently failing for you
        const answer = response.body.data?.answer || "";
        expect(answer).not.toContain("I cannot answer based on the provided laws");
        
        // Ensure we actually got context
        expect(response.body.data.context.ancestry.length).toBeGreaterThan(0);
    }, 20000); 
});