import React, { useState, useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Mic, Square, Pause, Play, Trash2, Send } from 'lucide-react';

import { analyzeStudentAudio } from '../services/geminiService';
import { useUserStore } from '../store/userStore';

const VoiceAiPage: React.FC = () => {
  const { addActivity } = useUserStore();
  const { status, audioBlob, startRecording, stopRecording, pauseRecording, resetRecording } = useAudioRecorder();
  const [feedback, setFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'recording') {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [status]);

  const handleReset = () => {
    resetRecording();
    setFeedback(null);
    setTimer(0);
  }

  const handleAnalyze = async () => {
    if (audioBlob) {
      setIsAnalyzing(true);
      setFeedback(null);
      const result = await analyzeStudentAudio(audioBlob);
      setFeedback(result);
      setIsAnalyzing(false);
      addActivity({
        type: 'interview',
        name: 'Voice AI Practice',
        score: result.confidenceScore,
        maxScore: 100,
        date: new Date().toISOString(),
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Voice AI Confidence Builder</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Practice your interview answers and get instant feedback.</p>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Interview Question:</h2>
        <p className="text-lg italic text-indigo-600 dark:text-indigo-400 mb-6">"Tell me about a time you faced a difficult challenge and how you overcame it."</p>

        <div className="flex items-center justify-center space-x-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
          {status !== 'recording' && status !== 'paused' && (
            <button onClick={startRecording} className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><Mic size={24} /></button>
          )}
          {status === 'recording' && (
            <button onClick={pauseRecording} className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"><Pause size={24} /></button>
          )}
           {status === 'paused' && (
            <button onClick={startRecording} className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"><Play size={24} /></button>
          )}
          {(status === 'recording' || status === 'paused') && (
            <button onClick={stopRecording} className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><Square size={24} /></button>
          )}
          <div className="text-2xl font-mono font-semibold text-gray-800 dark:text-gray-200 w-24 text-center">{formatTime(timer)}</div>
        </div>

        {audioBlob && (
          <div className="space-y-4">
            <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
            <div className="flex space-x-4">
              <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-semibold flex items-center justify-center">
                <Send size={18} className="mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze My Answer'}
              </button>
              <button onClick={handleReset} className="bg-gray-300 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors font-semibold flex items-center justify-center">
                <Trash2 size={18} className="mr-2" />
                Record Again
              </button>
            </div>
          </div>
        )}

        {feedback && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold mb-4">AI Feedback</h3>
            <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 mb-4">{feedback.feedback}</p>
              <p className="font-semibold">Confidence Score: <span className="text-indigo-600 dark:text-indigo-400">{feedback.confidenceScore}/100</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAiPage;
