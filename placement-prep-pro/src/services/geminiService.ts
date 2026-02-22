import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const analyzeStudentAudio = async (audioBlob: Blob) => {
  const model = 'gemini-3-flash-preview'; // A model that supports audio
  const audioBase64 = await blobToBase64(audioBlob);

  const prompt = `
    You are an expert interview coach. A student has recorded their answer to the question: "Tell me about a time you faced a difficult challenge and how you overcame it."
    Analyze the student's audio response based on the following criteria:
    - Clarity and articulation
    - Pace and tone of voice
    - Confidence and energy level
    - Structure of the answer

    Provide constructive feedback and a confidence score out of 100.
    Return the response as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: audioBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return {
      feedback: 'There was an error analyzing your audio. Please try again.',
      confidenceScore: 0,
    };
  }
};

export const generateCodingProblem = async (difficulty: string, studentData: any) => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are a coding challenge generator for a university student preparing for placements.
    The student's profile is:
    - Department: ${studentData.department}
    - Coding Level: ${studentData.codingLevel}
    - Target Company Type: ${studentData.targetCompanyType}

    Generate a ${difficulty}-level coding problem that is relevant for this student.
    The problem should be a typical question asked in technical interviews for the student's target company type.

    Your response must be a JSON object containing:
    - title: A clear and concise title for the problem.
    - description: A detailed description of the problem.
    - example: A simple input/output example.
    - constraints: Any constraints on the input values.
    - optimalApproach: A brief explanation of the optimal way to solve the problem.
    - timeComplexity: The time complexity of the optimal solution (e.g., 'O(n)').
    - spaceComplexity: The space complexity of the optimal solution (e.g., 'O(1)').
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            example: { type: Type.STRING },
            constraints: { type: Type.STRING },
            optimalApproach: { type: Type.STRING },
            timeComplexity: { type: Type.STRING },
            spaceComplexity: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating coding problem:', error);
    return {
      title: 'Error Generating Problem',
      description: 'Could not generate a problem. Please try again.',
      example: '',
      constraints: '',
    };
  }
};

export const generateAptitudeQuiz = async (category: string, studentData: any) => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are an aptitude test generator for a university student preparing for placements.
    The student's profile is:
    - Department: ${studentData.department}
    - Aptitude Level: ${studentData.aptitudeLevel}
    - Target Company Type: ${studentData.targetCompanyType}

    Generate a 5-question quiz on the topic of ${category}.
    The difficulty should be appropriate for the student's aptitude level.
    The questions should be relevant to the type of questions asked by the student's target companies.

    Your response must be a JSON object containing an array of question objects.
    Each question object must have:
    - question: The question text.
    - options: An array of 4 strings representing the multiple-choice options.
    - answer: The correct answer string, which must be one of the options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText).questions;
  } catch (error) {
    console.error('Error generating aptitude quiz:', error);
    return [
      {
        question: 'Error generating quiz. Please try again.',
        options: [],
        answer: '',
      },
    ];
  }
};

const createChatSession = (studentData: any) => {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = `You are an expert HR interviewer conducting a mock interview with a university student. The student's profile is: Department - ${studentData.department}, Target Company - ${studentData.targetCompanyType}, Biggest Fear - ${studentData.biggestFear}. Ask insightful, open-ended questions one at a time. Keep your responses concise and conversational. Start with a greeting and the first question.`;

  return ai.chats.create({
    model: model,
    config: {
        systemInstruction: systemInstruction,
    }
  });
};

export const startHrInterview = async (studentData: any) => {
  const chat = createChatSession(studentData);
  const response = await chat.sendMessage({ message: 'Start Interview' });
  return { response: response.text, chat };
};

export const continueHrInterview = async (chat: any, message: string) => {
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateRoadmap = async (userData: any) => {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are a supportive and expert placement preparation mentor for a university student.
    Based on the following student profile, create a personalized placement preparation roadmap.

    Student Profile:
    - Name: ${userData.name}
    - Department: ${userData.department}
    - Target Company Type: ${userData.targetCompanyType}
    - Aptitude Level: ${userData.aptitudeLevel}
    - Coding Level: ${userData.codingLevel}
    - Biggest Fear: ${userData.biggestFear}

    Your task is to:
    1.  Given these placeholder scores (Aptitude: 75, Coding: 60, Technical: 80, Interview: 70), identify the student's weakest area.
    2.  Suggest exactly 5 actionable and specific improvement steps for that weakest area.
    3.  Generate a concrete and simple practice plan for the very next day.
    4.  Write a short, powerful, and encouraging motivational message for the student.

    Return the response as a JSON object. Do not include any markdown formatting or introductory text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weakestArea: { type: Type.STRING },
            improvementActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextDayPlan: { type: Type.STRING },
            motivationalMessage: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    // Return a fallback object in case of an API error
    return {
      weakestArea: 'API Error',
      improvementActions: ['Could not generate suggestions. Please try again.'],
      nextDayPlan: 'Please try refreshing the page.',
      motivationalMessage: 'There was an error, but don\'t let it stop you. Keep trying!',
    };
  }
};
