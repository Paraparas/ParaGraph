import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const topicMappingTool = new DynamicStructuredTool({
  name: "map_topics",
  description: `Extract topics and subtopics from meeting content. Available main topics:
  - VISION: Project vision, goals, overview
  - TECH: Technical implementation details
  - VIZ: Visualization features and design
  - PLAN: Task coordination and planning 
  
  Output should be an array of nodes, where each node has:
  - id: unique string identifier
  - label: descriptive text
  - type: either 'main' or 'subtopic'
  - parentId: (required for subtopics) ID of parent topic
  - topicKey: reference to main topic category`,
  schema: z.object({
    nodes: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['main', 'subtopic']),
      parentId: z.string().optional(),
      topicKey: z.string()
    }))
  }),
  func: async ({ nodes }) => {
    // Currently just passing through - we should validate here
    return JSON.stringify({ nodes });
  },
});