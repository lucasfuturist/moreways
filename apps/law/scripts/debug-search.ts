import { HybridSearchService } from '../src/retrieve/svc/retrieve.svc.hybridSearch';
import { OpenAiClient } from '../src/infra/openai/infra.openai.client';
import { env } from '../src/infra/config/infra.config.env';

// Force the process to use the Production table if your code defaults to it
// (The HybridSearchService usually reads env vars or defaults, ensure it hits the right DB)

async function main() {
    const query = process.argv.slice(2).join(' ');
    if (!query) {
        console.error("Usage: npx ts-node scripts/debug-search.ts \"<your prompt>\"");
        process.exit(1);
    }

    console.log(`🧠 Vectorizing Prompt: "${query}"...`);
    
    // Initialize Service
    const searcher = new HybridSearchService();
    
    // Execute Search (Top 5)
    const results = await searcher.search(query, 5);

    if (results.length === 0) {
        console.log("❌ No semantic matches found.");
        return;
    }

    console.log(`\n🏆 Top 5 Matches:\n`);

    results.forEach((r, index) => {
        const isDefinition = r.urn.includes('10_01') && !r.urn.endsWith('10_01'); // Simple check for our new nodes
        const icon = index === 0 ? '🥇' : '🥈';
        
        console.log(`${icon} [${(r.score * 100).toFixed(1)}%] ${r.urn}`);
        console.log(`   Type: ${isDefinition ? 'ATOMIC DEFINITION 🟢' : 'Standard Node ⚪'}`);
        console.log(`   Vector: ${r.vector_score.toFixed(4)} | Keyword: ${r.keyword_score.toFixed(4)}`);
        console.log(`   "${r.content_text.substring(0, 100).replace(/\n/g, ' ')}..."`);
        console.log('----------------------------------------------------------------');
    });
}

main().catch(console.error);