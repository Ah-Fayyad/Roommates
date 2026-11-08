import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";

interface VoiceRecorderProps {
  onSend: (audioFile: File) => void;
  isUploading?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, isUploading }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert(t("microphone_permission_denied"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handleSend = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      onSend(file);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-2xl animate-pulse flex-1">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-red-600 dark:text-red-400 font-medium tabular-nums flex-1">
          {t("recording")}... {formatTime(recordingTime)}
        </span>
        <button
          onClick={stopRecording}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>
    );
  }

  if (audioUrl) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl flex-1 border border-indigo-100 dark:border-indigo-900/50">
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <button
          onClick={togglePlayback}
          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium tabular-nums flex-1">
          {t("voice_note_ready")}
        </span>
        <button
          onClick={deleteRecording}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <Button
          size="sm"
          onClick={handleSend}
          disabled={isUploading}
          className="rounded-xl px-3"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startRecording}
      className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
    >
      <Mic className="w-5 h-5" />
    </Button>
  );
};

export default VoiceRecorder;
