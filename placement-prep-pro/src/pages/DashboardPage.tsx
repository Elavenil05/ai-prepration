import React from 'react';
import { useUserStore } from '../store/userStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage: React.FC = () => {
  const { activities, name } = useUserStore();

  const calculateAverage = (type: 'aptitude' | 'interview') => {
    const relevantActivities = activities.filter(a => a.type === type);
    if (relevantActivities.length === 0) return 0;
    const totalScore = relevantActivities.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0);
    return totalScore / relevantActivities.length;
  };

  const aptitudeAvg = calculateAverage('aptitude');
  const interviewAvg = calculateAverage('interview');

  const chartData = [
    { name: 'Aptitude', score: aptitudeAvg.toFixed(0) },
    { name: 'Interview', score: interviewAvg.toFixed(0) },
    { name: 'Coding', score: 0 }, // Placeholder
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {name}!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Here's a summary of your performance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Aptitude Avg.</h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{aptitudeAvg.toFixed(0)}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Interview Avg.</h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{interviewAvg.toFixed(0)}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Coding Avg.</h3>
          <p className="text-4xl font-bold text-gray-400 dark:text-gray-600">N/A</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-y-auto h-72">
            {activities.length > 0 ? (
              <ul className="space-y-4">
                {[...activities].reverse().map((activity, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <div>
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{activity.score}/{activity.maxScore}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 mt-12">No activities completed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
