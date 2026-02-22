import React, { useState, useEffect } from 'react';

interface QuizProps {
  questions: any[];
  category: string;
  onComplete: (score: number, totalQuestions: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, category, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 minute per question
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers: string[]) => {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.answer === finalAnswers[index]) {
        score++;
      }
    });
    setIsFinished(true);
    onComplete(score, questions.length);
  };

  if (isFinished) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-lg">You scored {userAnswers.filter((a, i) => a === questions[i].answer).length} out of {questions.length}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{category} Quiz</h2>
        <div className="font-mono text-lg">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1}/{questions.length}</p>
        <p>{currentQuestion.question}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option: string) => (
          <button 
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
