import { useState, useRef } from 'react';

export type RecordingStatus = 'inactive' | 'recording' | 'paused' | 'finished';

export const useAudioRecorder = () => {
  const [status, setStatus] = useState<RecordingStatus>('inactive');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (status === 'paused') {
      mediaRecorderRef.current?.resume();
      setStatus('recording');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setStatus('finished');
        stream.getTracks().forEach(track => track.stop()); // Clean up the stream
      };

      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        alert('Microphone permission was denied. Please allow microphone access in your browser settings to use this feature.');
      }
      // Handle permissions error gracefully in the UI
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setStatus('paused');
  };
  
  const resetRecording = () => {
    setStatus('inactive');
    setAudioBlob(null);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }

  return { status, audioBlob, startRecording, stopRecording, pauseRecording, resetRecording };
};
