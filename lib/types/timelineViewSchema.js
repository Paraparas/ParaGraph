const timelineSchema = {
    name: "meeting_summary",
    strict: true,
    schema: {
      type: "object",
      properties: {
        speakers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              role: { type: "string" }
            },
            required: ["id", "name", "role"],
            additionalProperties: false
          }
        },
        segments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              speaker_id: { type: "string" },
              topic: { type: "string" },
              start: { type: "integer" },
              duration: { type: "integer" },
              content: { type: "string" },
              briefSummary: { type: "string" },
              detailedSummary: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["speaker_id", "topic", "start", "duration", "content", "briefSummary", "detailedSummary"],
            additionalProperties: false
          }
        }
      },
      required: ["speakers", "segments"],
      additionalProperties: false
    }
  };
  
  export default transcriptSchema;
  