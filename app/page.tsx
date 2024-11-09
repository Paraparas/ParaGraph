import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const WelcomeCard = (
    <div className="p-4 md:p-8 rounded bg-gradient-to-br from-blue-900 to-slate-900 w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4 font-bold text-white">
        Para Research Navigator
      </h1>
      <p className="text-lg text-blue-100 mb-6">
        Explore Geoffrey Hinton's groundbreaking AI journey through an interactive experience
      </p>
      
      <div className="space-y-6">
        <section className="border border-blue-800 rounded-lg p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Journey Highlights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">📚</span>
              <span>From Psychology to AI: Early influences and transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🔬</span>
              <span>Persistence through the AI Winter period</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">💡</span>
              <span>Breakthrough: Development of backpropagation</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🌟</span>
              <span>Legacy and impact on modern deep learning</span>
            </li>
          </ul>
        </section>

        <section className="border border-blue-800 rounded-lg p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">How to Explore</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">💬</span>
              <span>Chat with Para to explore different aspects of Hinton's journey</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">📊</span>
              <span>View interactive visualizations of research impact</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🔄</span>
              <span>Follow the story progression through key milestones</span>
            </li>
          </ul>
        </section>

        <div className="text-center text-blue-200 bg-blue-900/30 p-4 rounded-lg">
          <p>Try asking: "Tell me about Geoffrey Hinton's early research interests"</p>
        </div>
      </div>
    </div>
  );

  return (
    <ChatWindow
      endpoint="api/chat"
      emoji="🧠"
      titleText="Para Research Navigator"
      placeholder="Ask about Geoffrey Hinton's research journey..."
      emptyStateComponent={WelcomeCard}
    ></ChatWindow>
  );
}
