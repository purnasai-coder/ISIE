"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Sparkles,
  X,
  Volume2,
  Copy,
  Check,
  BookmarkPlus,
  Loader2,
  AlertCircle,
  Radio,
  FileText,
  Clock,
  Trash2,
} from "lucide-react";
import { TacticalBadge } from "../ui/TacticalBadge";
import { TacticalButton } from "../ui/TacticalButton";
import { useAuth } from "@/lib/auth/AuthContext";
import { addTacticalLog, subscribeTacticalLogs, TacticalLogItem } from "@/lib/firebase/client";

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [recentLogs, setRecentLogs] = useState<TacticalLogItem[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Subscribe to real-time tactical voice logs in Firestore
  useEffect(() => {
    if (!user?.id || !isOpen) return;
    const unsub = subscribeTacticalLogs(user.id, (logs) => {
      setRecentLogs(logs.filter((l) => l.source === "VOICE_TRANSCRIPTION" || l.source === "FIELD_NOTE"));
    });
    return () => {
      if (unsub) unsub();
    };
  }, [user?.id, isOpen]);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (isRecording) {
        stopRecording();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      setError(null);
      setTranscriptionText(null);
      setAudioBlob(null);
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        setAudioBlob(finalBlob);
        setAudioUrl(URL.createObjectURL(finalBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError(err?.message || "Failed to access microphone. Please allow audio permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setError(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: audioBlob.type || "audio/webm",
            prompt: "Transcribe this tactical situation dispatch accurately, capturing emergency codes, sector locations, and operational numbers.",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to transcribe audio.");
        }

        setTranscriptionText(data.text);
        setIsTranscribing(false);
      };
    } catch (err: any) {
      setError(err?.message || "Failed to process audio transcription.");
      setIsTranscribing(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!user || !transcriptionText) return;
    const logId = await addTacticalLog(user.id, {
      title: `Voice Dispatch (${new Date().toLocaleTimeString()})`,
      content: transcriptionText,
      source: "VOICE_TRANSCRIPTION",
      sector: "Tactical Situation Room",
    });
    if (logId) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleCopy = () => {
    if (!transcriptionText) return;
    navigator.clipboard.writeText(transcriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-isie-panel border border-white/20 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-isie-panel-light/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                  TACTICAL VOICE DISPATCH & AUDIO TRANSCRIBE
                </span>
                <TacticalBadge variant="orange" size="sm">
                  gemini-3.5-transcribe
                </TacticalBadge>
              </div>
              <p className="text-[10px] font-mono text-isie-text-dim">
                Real-time microphone capture & military-grade speech-to-text intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-isie-text-muted hover:text-white rounded-xs hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Controller Banner */}
        <div className="p-6 border-b border-white/10 bg-isie-bg-deep/70 flex flex-col items-center justify-center gap-4">
          {/* Waveform / Visualizer simulation */}
          <div className="flex items-center justify-center gap-1 h-12">
            {[40, 65, 80, 50, 95, 70, 85, 60, 90, 45, 75, 55, 85].map((h, i) => (
              <span
                key={i}
                style={{
                  height: isRecording ? `${h}%` : "15%",
                  transition: "height 0.15s ease",
                  animationDelay: `${i * 0.08}s`,
                }}
                className={`w-1.5 rounded-full ${
                  isRecording ? "bg-amber-400 animate-pulse" : "bg-white/15"
                }`}
              />
            ))}
          </div>

          {/* Timer Readout */}
          <div className="font-mono text-xl font-bold tracking-widest text-white flex items-center gap-2">
            {isRecording && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
            <span>{formatSeconds(recordingSeconds)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>START RECORDING</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all animate-pulse"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP RECORDING</span>
              </button>
            )}

            {audioBlob && !isRecording && (
              <TacticalButton
                variant="primary"
                size="sm"
                onClick={handleTranscribe}
                disabled={isTranscribing}
                icon={isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              >
                {isTranscribing ? "TRANSCRIBING..." : "TRANSCRIBE WITH GEMINI"}
              </TacticalButton>
            )}
          </div>

          {/* Audio Playback Preview */}
          {audioUrl && (
            <div className="w-full max-w-sm pt-2">
              <audio controls src={audioUrl} className="w-full h-8 opacity-80" />
            </div>
          )}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xs text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isTranscribing && (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-amber-400 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs uppercase tracking-widest">
                TRANSCRIBING AUDIO VIA GEMINI-3.5-TRANSCRIBE...
              </span>
            </div>
          )}

          {transcriptionText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white font-semibold">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                  TRANSCRIPTION OUTPUT
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] text-isie-text-muted hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "COPIED" : "COPY TEXT"}</span>
                  </button>
                  <button
                    onClick={handleSaveToFirestore}
                    disabled={savedSuccess}
                    className="inline-flex items-center gap-1 text-[10px] text-isie-cyan hover:underline"
                  >
                    {savedSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <BookmarkPlus className="w-3 h-3" />}
                    <span>{savedSuccess ? "SAVED IN FIRESTORE" : "SAVE TO FIRESTORE"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xs text-white leading-relaxed whitespace-pre-wrap select-text">
                {transcriptionText}
              </div>
            </div>
          )}

          {/* Recent Firestore Voice Logs */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-isie-text-dim">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                HISTORICAL FIRESTORE VOICE LOGS ({recentLogs.length})
              </span>
              <span className="text-[10px] text-emerald-400">FIRESTORE SYNC ACTIVE</span>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-[10px] text-isie-text-dim italic">
                No previous voice logs recorded. Record and save to build your situational field dossier.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-isie-panel-light/40 border border-white/5 hover:border-white/15 rounded-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white truncate max-w-[240px]">{log.title}</span>
                      <span className="text-isie-text-dim">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-isie-text-secondary leading-snug line-clamp-2">
                      {log.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-white/10 bg-isie-panel-light/40 flex items-center justify-between">
          <div className="text-[10px] font-mono text-isie-text-dim flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>OPERATOR: {user?.name || "STRATEGIC OPERATOR"}</span>
          </div>
          <TacticalButton variant="ghost" size="sm" onClick={onClose}>
            CLOSE
          </TacticalButton>
        </div>
      </div>
    </div>
  );
};
