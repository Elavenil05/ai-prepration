import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import Input from './ui/Input';
import Select from './ui/Select';
import RadioGroup from './ui/RadioGroup';

const StudentInfoForm: React.FC = () => {
  const store = useUserStore();

  const departments = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];
  const companyTypes = ['Mass Hiring (TCS, Infosys, Wipro)', 'Product Based (Amazon, Microsoft)', 'Core Company'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const fears = ['Speaking', 'Coding', 'Technical', 'English', 'Confidence'];

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', store);
    navigate('/roadmap');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <Input label="Name" value={store.name} onChange={(e) => store.setName(e.target.value)} required />
      <Select label="Department" options={departments} value={store.department} onChange={(e) => store.setDepartment(e.target.value)} />
      <RadioGroup label="Target Company Type" name="companyType" options={companyTypes} selectedValue={store.targetCompanyType} onChange={store.setTargetCompanyType} />
      <RadioGroup label="Aptitude Level" name="aptitudeLevel" options={levels} selectedValue={store.aptitudeLevel} onChange={store.setAptitudeLevel} />
      <RadioGroup label="Coding Level" name="codingLevel" options={levels} selectedValue={store.codingLevel} onChange={store.setCodingLevel} />
      <Select label="Biggest Fear" options={fears} value={store.biggestFear} onChange={(e) => store.setBiggestFear(e.target.value)} />

      <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-semibold">
        Generate My Roadmap
      </button>
    </form>
  );
};

export default StudentInfoForm;
