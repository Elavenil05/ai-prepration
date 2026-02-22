import { create } from 'zustand';

interface Activity {
  type: 'aptitude' | 'coding' | 'interview';
  name: string;
  score: number; // e.g., score/100 for interview, score/5 for quiz
  maxScore: number;
  date: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface UserState {
  name: string;
  department: string;
  targetCompanyType: string;
  aptitudeLevel: string;
  codingLevel: string;
  biggestFear: string;
  hrInterviewHistory: ChatMessage[];
  activities: Activity[];
  setName: (name: string) => void;
  setDepartment: (department: string) => void;
  setTargetCompanyType: (targetCompanyType: string) => void;
  setAptitudeLevel: (aptitudeLevel: string) => void;
  setCodingLevel: (codingLevel: string) => void;
  setBiggestFear: (biggestFear: string) => void;
  setHrInterviewHistory: (history: ChatMessage[]) => void;
  addActivity: (activity: Activity) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  name: '',
  department: 'CSE',
  targetCompanyType: 'Mass Hiring (TCS, Infosys, Wipro)',
  aptitudeLevel: 'Beginner',
  codingLevel: 'Beginner',
  biggestFear: 'Speaking',
  hrInterviewHistory: [],
  activities: [],
  setName: (name) => set({ name }),
  setDepartment: (department) => set({ department }),
  setTargetCompanyType: (targetCompanyType) => set({ targetCompanyType }),
  setAptitudeLevel: (aptitudeLevel) => set({ aptitudeLevel }),
  setCodingLevel: (codingLevel) => set({ codingLevel }),
  setBiggestFear: (biggestFear) => set({ biggestFear }),
  setHrInterviewHistory: (history) => set({ hrInterviewHistory: history }),
  addActivity: (activity) => set({ activities: [...get().activities, activity] }),
}));
