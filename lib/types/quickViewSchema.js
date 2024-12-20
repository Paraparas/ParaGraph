const meetingOverviewSchema = {
    name: "meetingOverview", // Name of the schema
    strict: true, // Ensure strict validation
    schema: {
      type: "object",
      properties: {
        key_insights: {
          type: "array",
          items: {
            type: "string",
            description: "A key insight derived from the meeting."
          },
          // minItems: 3,
          // maxItems: 5,
          description: "A list of 3-5 key insights from the meeting."
        },
        action_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              person: {
                type: "string",
                description: "The name or identifier of the person responsible for the task."
              },
              tasks: {
                type: "array",
                items: {
                  type: "string",
                  description: "A task assigned to or suggested for the person."
                },
                // minItems: 1,
                description: "A list of tasks for the person."
              }
            },
            required: ["person", "tasks"],
            additionalProperties: false,
            description: "An action item for a specific person, including their name and tasks."
          },
          description: "A list of action items, one for each person in the meeting."
        }
      },
      required: ["key_insights", "action_items"],
      additionalProperties: false,
      description: "An overview of the meeting, including key insights and action items for participants."
    }
  };
  
  export default meetingOverviewSchema;
  