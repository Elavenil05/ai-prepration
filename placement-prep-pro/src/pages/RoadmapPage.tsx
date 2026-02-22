import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { generateRoadmap } from '../services/geminiService';



const RoadmapPage: React.FC = () => {
  const userData = useUserStore((state) => state);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dummy scores
  const scores = { Aptitude: 75, Coding: 60, Technical: 80, Interview: 70 };
  const overallScore = (scores.Aptitude + scores.Coding + scores.Technical + scores.Interview) / 4;

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      const content = await generateRoadmap(userData);
      setRoadmap(content);
      setLoading(false);
    };
    fetchRoadmap();
  }, [userData]);

  if (loading) {
    return <div className="text-center">Generating your personalized roadmap...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">Your Personalized Roadmap, {userData.name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Based on your profile, here is a plan to get you placement-ready.</p>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Placement Readiness</h2>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{overallScore.toFixed(0)}/100</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Weakest Area</h2>
          <p className="text-4xl font-bold text-red-500">{roadmap.weakestArea}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5 Steps to Improve Your {roadmap.weakestArea} Skills</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          {roadmap.improvementActions.map((action: string, index: number) => <li key={index}>{action}</li>)}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Practice Plan for Tomorrow</h2>
        <p className="text-gray-700 dark:text-gray-300">{roadmap.nextDayPlan}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">A Message for You</h2>
        <p className="italic text-indigo-600 dark:text-indigo-400">"{roadmap.motivationalMessage}"</p>
      </div>
    </div>
  );
};

export default RoadmapPage;
