# ParaGraph Team Meeting Transcript
Date: December 1, 2024
Duration: ~52 minutes
Participants: Kinan (K), Muhammad (M), Qi (Q)

## Transcript with Timestamps

[00:00-00:45] Q: "Getting back to Kinan's question about the ASR module. We need to decide today if we want to include it. Users can currently start from their transcript, so while ASR would be better, if implementation takes a few days, that's too much. We want to focus on OpenAI integration and better visualization. Since we're ASR researchers, we can always integrate it later. We need you to decide if it's manageable now or should be done later."

[00:45-02:15] K: "The ASR integration is definitely possible. We could pass the entire audio into a model like Whisper. However, speaker diarization might be harder - identifying who is speaking when. With Google Meet's API, they record each person's audio individually, making speaker identification easier. Since Muhammad left temporarily, they can more easily identify speakers in real-time."

[02:15-03:30] Q: "If we use Google Meet, we get speaker diarization and identification for free. Later, when we make this a product, we'll want to integrate with all major meeting platforms - Zoom, Google Meet, Microsoft Teams. For now, we really need you to focus on large language model integration. I have some more advanced features in mind, but we should focus on the demo first."

[03:30-03:45] M: "Yes, sorry. Had some internet connection issues."

[03:45-04:30] K: "To summarize, I'll investigate tools to convert raw recordings to transcripts. Even without perfect speaker identification, the model might deduce speakers from context. It doesn't have to be perfect for the demo. I'll look into it and let you know."

[04:30-05:15] Q: "Our entire pipeline goes from either recording or transcript to the large language model, then parses and labels the data for visualization. As long as we have quality processed data after the LLM, we don't care about the source. We're fine with either option as long as we can feed reliable parsed data to the visualization module."

[05:15-07:30] K: "About the LLM integration, I was looking at the existing repo with the test meeting transcription and example JSON file. I implemented structured outputs functionality using GPT-4, which guarantees valid JSON output following our schema. The main difference is in how speaker IDs are handled, but this ensures we get properly formed JSON for visualization. Would you like me to show my screen?"

[07:30-09:00] Q: "For our final three-minute demo, we'll need a 20-minute meeting script to feed into the OpenAI model. We should think carefully about format - whether to include speaker names clearly in every speech, or use a simpler version. Let's prepare the script based on your prompts and data structure. With a longer meeting, we might discover issues we haven't seen in the five-minute tests."

[09:00-12:00] Q: "Let me show you the current implementation on Vercel. Here's our landing page where we can upload recordings and transcripts. We have some issues to fix - for example, some speech segments are overlapping incorrectly. We need to ensure our language model can clearly parse, label, and summarize based on our script. This needs to be clearly demonstrated in the three-minute demo."

[12:00-13:30] K: "I should look at the Google Meet transcripts to understand their format. That would help with the implementation."

[13:30-14:30] Q: "Muhammad, you can create or modify test scripts similar to Google Meet transcripts that work with Kinan's OpenAI integration. We want to make our demo script reflect real discussions. What are your actual questions and interests in this project?"

[14:30-16:00] K: "With the current version on Vercel, we have a good MVP that clearly shows the progression from transcript to time-segmented summarizations. Are there other features you're thinking of adding, or should we focus on this main functionality?"

[16:00-19:30] Q: "Let me show you the visualization layers. The first page is a timeline with four speakers. Each person's topics are color-coded - Muhammad discussed three topics, Kinan three topics, and others discussed visualization and planning. Users can focus on specific speakers and see brief overviews with detailed bullet points. We need more concrete summaries that provide context and background, not just high-level points."

[19:30-20:30] K: "That's a good point, but it might depend on the transcript length. This conversation is only 5 minutes with short segments. In a 20-minute meeting with longer idea descriptions, the same summarization might be more meaningful."

[20:30-22:30] Q: "Let's have Muhammad prepare different versions - 5 minutes, 10 minutes, 20 minutes - with various speaking patterns. We need to test edge cases and adjust our UI/UX accordingly. The next visualization is the topic wheel, using consistent color coding. This helps users familiar with the colors understand relationships between topics."

[22:30-25:00] Q: "The topic wheel shows how ideas connect across speakers. We track explicit links from actual speech and implicit links that show conceptual connections. This helps surface hidden insights and patterns in team discussions."

[25:00-27:00] M: "I notice different colors representing speakers. For four speakers in this meeting, where is the fourth one represented?"

[27:00-28:30] Q: "There's an issue with this visualization - we should show all four speakers. This version uses prepared data, but the concept is to show both explicit connections from speech and implicit connections from shared concepts."

[28:30-31:00] K: "This is a good approach. We can create concept maps for each person's topics and draw connections between them. We need to consider how to generate these topic maps programmatically and ensure the LLM output provides sufficient data for visualization."

[31:00-34:00] Q: "Let me show you the current data structure. We have main topics and subtopics represented by different node sizes, with explicit connections from speaker statements and implicit connections found by our language models. We'll need a meta-GPT to manage smaller models looking for connections, with only verified insights appearing on the board."

[34:00-36:00] K: "We could process the transcript into JSON first, then generate different visualization formats from that structure. That seems like a good feature to focus on implementing programmatically rather than hardcoding."

[36:00-38:30] Q: "We could use LangGraph to coordinate multiple AI agents in a workflow. We could show this workflow in our demo to explain how we process and connect information. It's ambitious for our timeline, but would be impressive to judges."

[38:30-39:15] M: "LangGraph is great technology, but given our limited time, let's focus on core functionality first. We can add LangGraph if time permits."

[39:15-41:30] Q: "Since we're using a LangChain template, LangGraph integration might be easier. Let's aim to decide by next Sunday. If we can't integrate it, we can still mention our experiments and future plans while showing our working pipeline. The final visualization layer will be a dashboard showing meeting metadata, topic coverage, and flow analysis."

[41:30-44:30] Q: "A key value proposition is transforming vague meeting content into measurable, trackable information. Companies want to quantify their meetings and knowledge sharing. We're providing tools to measure and analyze team knowledge exchange."

[44:30-46:00] K: "It's good to implement different features broadly, even if not perfectly. We never know which functionality might resonate most strongly with users."

[46:00-47:30] Q: "We need to explicitly show we're using advanced AI, not just creating visualizations. That's another reason to demonstrate LangGraph - showing the AI agents working under the hood to create these connections and insights."

[47:30-50:00] Q: "For next week's deliverables: Kinan, decide on ASR integration and continue LLM integration for topic mapping. By next week, we want no hardcoded data - everything should be processed by language models. Muhammad, continue preparing test scripts of varying lengths. If anyone makes progress on LangGraph, share on Slack."

[50:00-52:00] K: "Thanks for directing the meeting, Qi. Having a clear plan is helpful."

[52:00-52:19] Q: "We're getting more efficient with our meetings. I'll share the transcript, recording, and papers on Slack. Let's maintain close communication there for feedback and progress updates."

## Key Topics Covered
1. ASR Integration Decision
2. LLM Processing Pipeline
3. Data Structure and JSON Format
4. Visualization Layers
   - Timeline View
   - Topic Wheel
   - Dashboard (planned)
5. Demo Strategy
6. Future Development Plans

## Action Items
1. Kinan:
   - Investigate ASR options and decide on integration
   - Continue LLM integration for topic mapping
2. Muhammad:
   - Prepare test scripts of varying lengths
   - Test different speaker patterns and scenarios
3. Team:
   - Consider LangGraph integration if time permits
   - Ensure no hardcoded data by next week
4. Qi:
   - Continue work on visualization layers
   - Implement dashboard view
   - Coordinate overall pipeline integration

## Next Steps
- Decision deadline for ASR integration: December 2
- Complete working pipeline by: December 8
- Focus on removal of hardcoded data
- Maintain communication via Slack for updates