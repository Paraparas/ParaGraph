import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const topicMappingTool = new DynamicStructuredTool({
  name: "map_topics",
  description: "Map topics and subtopics from meeting content",
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
    return JSON.stringify(nodes);
  },
});