import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { startHrInterview, continueHrInterview } from '../services/geminiService';

const HrInterviewPage: React.FC = () => {
  const { hrInterviewHistory, setHrInterviewHistory } = useUserStore();
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [hrInterviewHistory]);

  const userData = useUserStore();

  useEffect(() => {
    const startInterview = async () => {
      setLoading(true);
      const { response, chat } = await startHrInterview(userData);
      setChatSession(chat);
      setHrInterviewHistory([{ role: 'model' as const, content: response }]);
      setLoading(false);
    };

    if (hrInterviewHistory.length === 0) {
      startInterview();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatSession) return;

    const newHistory = [...hrInterviewHistory, { role: 'user' as const, content: userInput }];
    setHrInterviewHistory(newHistory);
    setUserInput('');
    setLoading(true);

    const response = await continueHrInterview(chatSession, userInput);
    setHrInterviewHistory([...newHistory, { role: 'model' as const, content: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-3xl font-bold mb-2">HR Mock Interview</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Practice your interview skills with our AI-powered HR bot.</p>

      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto mb-4">
        {hrInterviewHistory.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400 font-semibold">
          Send
        </button>
      </div>
    </div>
  );
};

export default HrInterviewPage;
