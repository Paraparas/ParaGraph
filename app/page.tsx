import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const WelcomeCard = (
    <div className="p-4 md:p-8 rounded bg-gradient-to-br from-blue-900 to-slate-900 w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4 font-bold text-white">
        Building Para: A Self-Referential Journey
      </h1>
      <p className="text-lg text-blue-100 mb-6">
        Watch Para demonstrate its problem-solving capabilities by guiding you through its own development story
      </p>
      
      <div className="space-y-6">
        <section className="border border-blue-800 rounded-lg p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Story Highlights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">💡</span>
              <span>From vague idea to structured solution</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🔄</span>
              <span>Meta-narrative approach to problem-solving</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🎯</span>
              <span>Step-by-step development journey</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✨</span>
              <span>Interactive feature demonstrations</span>
            </li>
          </ul>
        </section>

        <section className="border border-blue-800 rounded-lg p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">How to Explore</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🤔</span>
              <span>Ask &quot;How can we win this hackathon?&quot;</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">📊</span>
              <span>Follow the development visualization</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🔍</span>
              <span>Explore Para&apos;s problem-solving approach</span>
            </li>
          </ul>
        </section>

        <div className="text-center text-blue-200 bg-blue-900/30 p-4 rounded-lg">
          <p>Start with: &quot;How do we approach building Para for this hackathon?&quot;</p>
        </div>
      </div>
    </div>
  );

  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🌟"
      titleText="Para: Self-Referential Demo"
      placeholder="Ask about building Para..."
      emptyStateComponent={WelcomeCard}
    ></ChatWindow>
  );
}