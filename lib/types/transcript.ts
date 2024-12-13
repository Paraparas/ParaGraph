// Topic configuration type
export interface TopicConfig {
  [key: string]: {
    color: string;     // Color for visualization
    label: string;     // Display label
    subtopics: {
      [key: string]: Subtopic;
    };
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
  speaker_id: string;       // Reference to speaker (required in the new schema)
  topic: string;            // Reference to topic key
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
    tags?: string[];        // Optional meeting tags
  };
  speakers: Speaker[];      // List of speakers
  segments: Segment[];      // Flat array of segments
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


export interface TopicItem {
  label: string;
}

export interface Subtopic {
  label: string;
  items: string[];
}

// New types for TopicView
export interface TopicNode {
id: string;
label: string;
type: 'main' | 'subtopic' | 'item';
parentId?: string;  // For subtopics and items
topicKey: string;   // Reference to main topic (for color)
}

// Connection types
export interface BaseConnection {
source: string;
target: string;
strength?: number;
}

export interface ExplicitConnection extends BaseConnection {
type: 'explicit';
speaker: string;
content: string;  // What was actually said
timestamp?: number;  // When in the meeting this connection was made
}

export interface ImplicitConnection extends BaseConnection {
type: 'implicit';
insight: string;  // LLM's explanation of the connection
importance: string;  // Why this connection matters
confidence?: number;  // LLM's confidence in this connection (0-1)
}

export type TopicConnection = ExplicitConnection | ImplicitConnection;

// Helper type guard
export function isExplicitConnection(connection: TopicConnection): connection is ExplicitConnection {
return connection.type === 'explicit';
}

export function isImplicitConnection(connection: TopicConnection): connection is ImplicitConnection {
return connection.type === 'implicit';
}

export interface TopicViewData {
nodes: TopicNode[];
connections: {
  explicit: ExplicitConnection[];
  implicit: ImplicitConnection[];
};
metadata?: {
  title?: string;
  date?: string;
  duration?: number;
  participants?: number;
};
}