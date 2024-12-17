// lib/types/meetingOverview.ts


export interface ActionItem {
    person: string; // The name or identifier of the person responsible for the task.
    tasks: string[]; // A list of tasks for the person.
  }
  
  export interface QuickViewData {
    key_insights: string[]; // A list of 3-5 key insights from the meeting.
    action_items: ActionItem[]; // A list of action items, one for each person in the meeting.
  }
  