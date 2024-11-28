// Topic configuration type
export interface TopicConfig {
    [key: string]: {
      color: string;     // Color for visualization
      label: string;     // Display label
    };
  }
  
  // Speaker information
  export interface Speaker {
    id: string;         // Unique identifier
    name: string;       // Display name
    initials?: string;  // Optional initials for avatar/display
    role?: string;      // Optional role information
  }
  
  // Individual segment of speech
  export interface Segment {
    speakerId?: string;         // Reference to speaker (optional for flexibility)
    topic: string;             // Reference to topic key
    start: number;            // Start time in seconds
    duration: number;         // Duration in seconds
    content: string;          // Original speech content
    briefSummary?: string;    // One-line summary (2-3 words)
    detailedSummary?: string[]; // Bullet points for detailed view
    sentiment?: number;       // Optional sentiment score (-1 to 1)
    confidence?: number;      // Optional confidence score for ASR
    keywords?: string[];      // Optional keywords for search/filter
  }
  
  // Complete meeting data structure
  export interface MeetingData {
    id?: string;              // Unique identifier for the meeting
    metadata?: {
      title?: string;         // Meeting title
      date?: string;          // Meeting date
      duration?: number;      // Total duration in seconds
      participants?: number;  // Number of participants
      tags?: string[];       // Optional meeting tags
    };
    speakers: Speaker[];
    segments: Record<string, Segment[]>; // Segments organized by speaker ID
    summary?: {
      key_points?: string[];    // Main takeaways
      action_items?: string[];  // Action items identified
      decisions?: string[];     // Key decisions made
    };
  }
  
  // Statistics for visualization
  export interface SpeakerStats {
    speakerId: string;
    totalDuration: number;
    segmentCount: number;
    topicDistribution: Record<string, number>;
    averageSegmentDuration: number;
  }
  
  // Analysis results
  export interface MeetingAnalysis {
    speakerStats: Record<string, SpeakerStats>;
    dominantTopics: Array<{
      topic: string;
      duration: number;
      segmentCount: number;
    }>;
    timeline: Array<{
      startTime: number;
      endTime: number;
      mainTopic: string;
      speakers: string[];
    }>;
    interactions: Array<{
      speaker1: string;
      speaker2: string;
      count: number;
    }>;
  }
  
  // Processing status for async operations
  export interface ProcessingStatus {
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress?: number;
    error?: string;
    lastUpdated?: string;
  }