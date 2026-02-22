import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import { useUserStore } from '../store/userStore';
import { generateAptitudeQuiz } from '../services/geminiService';

const AptitudePage: React.FC = () => {
  const { addActivity } = useUserStore();
  const userData = useUserStore((state) => state);
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');

  const handleStartQuiz = async (quizCategory: string) => {
    setCategory(quizCategory);
    setLoading(true);
    setQuiz(null);
    const generatedQuiz = await generateAptitudeQuiz(quizCategory, userData);
    setQuiz(generatedQuiz);
    setLoading(false);
  };

  const quizCategories = [
    { name: 'Quantitative Aptitude', key: 'Quantitative' },
    { name: 'Logical Reasoning', key: 'Logical' },
    { name: 'Verbal Ability', key: 'Verbal' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Aptitude Practice</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Sharpen your skills with our AI-generated quizzes.</p>

      {!quiz && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizCategories.map(cat => (
            <div key={cat.key} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">{cat.name}</h2>
              <button 
                onClick={() => handleStartQuiz(cat.key)}
                disabled={loading && category === cat.key}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-semibold">
                {loading && category === cat.key ? 'Generating...' : 'Start Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}

      {quiz && <Quiz questions={quiz} category={category} onComplete={(score, maxScore) => {
        addActivity({
          type: 'aptitude',
          name: `${category} Quiz`,
          score,
          maxScore,
          date: new Date().toISOString(),
        });
        // Maybe show a summary before quiz disappears
        // setQuiz(null);
      }} />}
    </div>
  );
};

export default AptitudePage;
