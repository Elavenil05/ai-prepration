import React from 'react';
import StudentInfoForm from '../components/StudentInfoForm';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Welcome to Placement Prep Pro</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Let's get started by understanding your goals. Please fill out the form below.
      </p>
      <StudentInfoForm />
    </div>
  );
};

export default HomePage;
