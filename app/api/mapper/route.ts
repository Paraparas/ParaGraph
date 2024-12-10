import { MapperGraphAgent } from '@/lib/agents/mapperAgent/langGraph';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { meetingData } = await request.json();
        
        console.log('In route: Initializing MapperGraphAgent...');
        const agent = new MapperGraphAgent();
        
        console.log('In route: Processing transcript...');
        const result = await agent.processTranscript(meetingData);
        console.log('In route: Processing complete:', result);

        return NextResponse.json({
            success: true,
            nodes: result.nodes,
            trace: result.trace
        });

    } catch (error) {
        console.error('Error in mapper route:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to process meeting data',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}