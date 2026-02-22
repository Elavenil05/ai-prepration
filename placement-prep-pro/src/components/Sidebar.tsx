import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, MessageSquare, Briefcase, Target, Award, BrainCircuit, Users } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BarChart2, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Voice AI', path: '/voice-ai' },
    { icon: Briefcase, label: 'Company Mode', path: '/company-mode' },
    { icon: Target, label: 'Daily Challenges', path: '/challenges' },
    { icon: Award, label: 'Coding', path: '/coding' },
    { icon: BrainCircuit, label: 'Aptitude', path: '/aptitude' },
    { icon: Users, label: 'HR Interview', path: '/hr-interview' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-10">Prep Pro</h1>
        <nav>
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label} className="mb-4">
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="text-center text-xs text-gray-500">
        <p>&copy; 2024 Placement Prep Pro</p>
      </div>
    </aside>
  );
};

export default Sidebar;
