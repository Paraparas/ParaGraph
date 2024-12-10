import { MapperAgent } from '../../lib/agents/mapperAgent';
import { readFileSync } from 'fs';
import { join } from 'path';

async function testMapperAgent() {
  console.log('🚀 Starting MapperAgent test...\n');

  try {
    // Read raw transcript
    const transcriptPath = join(process.cwd(), 'data', 'raw', 'test-transcript.md');
    const rawTranscript = readFileSync(transcriptPath, 'utf-8');
    console.log('📄 Loaded test transcript\n');

    // Initialize agent
    const agent = new MapperAgent();
    console.log('✅ Agent initialized\n');

    // Process raw transcript
    console.log('🔄 Processing transcript...');
    console.log('\nInput transcript (first 500 chars):');
    console.log(rawTranscript.slice(0, 500) + '...\n');

    const result = await agent.processTranscript(rawTranscript);

    console.log('📊 Output nodes:');
    console.log(JSON.stringify(result.nodes, null, 2));

    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test
testMapperAgent()
  .then(() => console.log('✅ Test completed'))
  .catch(() => process.exit(1));