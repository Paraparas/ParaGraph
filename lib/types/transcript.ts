// Topic configuration type
export interface TopicConfig {
    [key: string]: {
      color: string;
      label: string;
    };
  }
  
  // Speaker information
  export interface Speaker {
    id: string;
    name: string;
  }
  
  // Individual segment of speech
  export interface Segment {
    topic: string;
    start: number;    // in seconds
    duration: number; // in seconds
    content: string;
    briefSummary?: string;    // Optional one-liner summary
    detailedSummary?: string[]; // Optional bullet points for detailed view
  }
  
  // Complete meeting data structure
  export interface MeetingData {
    speakers: Speaker[];
    segments: Record<string, Segment[]>;
  }