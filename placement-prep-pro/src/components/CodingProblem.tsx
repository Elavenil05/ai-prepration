import React from 'react';

interface CodingProblemProps {
  problem: {
    title: string;
    description: string;
    example: string;
    constraints: string;
    optimalApproach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
  };
}

const CodingProblem: React.FC<CodingProblemProps> = ({ problem }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">{problem.title}</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{problem.description}</p>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Example:</h3>
        <code className="font-mono text-sm text-gray-900 dark:text-gray-100">{problem.example}</code>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Constraints:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{problem.constraints}</p>
      </div>

      {problem.optimalApproach && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Optimal Approach</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{problem.optimalApproach}</p>
          <div className="flex space-x-8 text-sm">
            <p><strong>Time Complexity:</strong> {problem.timeComplexity}</p>
            <p><strong>Space Complexity:</strong> {problem.spaceComplexity}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingProblem;
