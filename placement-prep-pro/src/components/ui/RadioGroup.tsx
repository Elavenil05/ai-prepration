import React from 'react';

interface RadioGroupProps {
  label: string;
  name: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-800 dark:text-gray-200">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
