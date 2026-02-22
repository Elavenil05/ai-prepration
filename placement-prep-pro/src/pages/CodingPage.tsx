import React, { useState } from 'react';
import CodingProblem from '../components/CodingProblem';
import { useUserStore } from '../store/userStore';
import { generateCodingProblem } from '../services/geminiService';

const CodingPage: React.FC = () => {
  const userData = useUserStore((state) => state);
  const [difficulty, setDifficulty] = useState('Medium');
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateProblem = async (level: string) => {
    setDifficulty(level);
    setLoading(true);
    setProblem(null);
    const generatedProblem = await generateCodingProblem(level, userData);
    setProblem(generatedProblem);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Daily Coding Challenges</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Select a difficulty and test your skills.</p>

      <div className="flex justify-center space-x-4 mb-8">
        {['Easy', 'Medium', 'Hard'].map(level => (
          <button 
            key={level} 
            onClick={() => handleGenerateProblem(level)}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              difficulty === level 
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}>
            {level}
          </button>
        ))}
      </div>

      {loading && <div className="text-center">Generating a new problem...</div>}

      {problem && <CodingProblem problem={problem} />}
    </div>
  );
};

export default CodingPage;
