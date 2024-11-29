const fs = require('fs/promises');
const path = require('path');
const { TranscriptProcessor } = require('../lib/utils/llmProcessor');

async function testProcessing() {
  try {
    // Read the test transcript
    const transcriptPath = path.join(process.cwd(), 'data', 'raw', 'test-transcript.md');
    const rawTranscript = await fs.readFile(transcriptPath, 'utf-8');

    // Initialize processor
    const processor = new TranscriptProcessor();
    
    console.log('Starting transcript processing...');
    const result = await processor.processTranscript(rawTranscript);

    if (result.success) {
      console.log('Processing completed successfully!');
      console.log('Processing time:', result.processingTime, 'ms');
      console.log('Processed data:', JSON.stringify(result.data, null, 2));
    } else {
      console.error('Processing failed:', result.error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testProcessing();