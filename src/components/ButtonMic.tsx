/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { Mic, StopCircle } from "lucide-react";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";

// Tắt SSR để tránh lỗi Worker không được định nghĩa
const ReactMediaRecorder = dynamic(
  () => import("react-media-recorder").then((mod) => mod.ReactMediaRecorder),
  {
    ssr: false,
  }
);

export default function VoiceRecorderButton({
  setMessages,
  setLoading,
  setBotTyping,
  loading,
  messages,
  setController,
}: {
  setMessages: (
    value: SetStateAction<
      {
        text: string;
        sender: string;
      }[]
    >
  ) => void;
  setLoading: (value: SetStateAction<boolean>) => void;
  setBotTyping: (value: SetStateAction<boolean>) => void;
  loading: boolean;
  messages: {
    text: string;
    sender: string;
  }[];
  setController: (value: SetStateAction<AbortController | null>) => void;
}) {
  const [recording, setRecording] = useState(false);

  const sendVoice = async (audioBlob: Blob) => {
    if (loading) return;

    // Thêm tin nhắn tạm thời để hiển thị đang xử lý
    setMessages([...messages, { text: "Đã gửi giọng nói...", sender: "user" }]);
    setLoading(true);
    setBotTyping(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
      // Tạo FormData để gửi file âm thanh
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voice`, {
        method: "POST",
        body: formData,
        signal: abortController.signal,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) throw new Error("Lỗi máy chủ");

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { text: "Lỗi chatbot!", sender: "bot" }]);
    }

    setLoading(false);
    setBotTyping(false);
    setController(null);
  };

  return (
    <ReactMediaRecorder
      onStop={(_, data) => {
        sendVoice(data); // Gửi blob trực tiếp
      }}
      audio
      render={({ startRecording, stopRecording }) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (recording) {
                stopRecording();
              } else {
                startRecording();
              }
              setRecording(!recording);
            }}
            variant={recording ? "destructive" : "default"}
          >
            {recording ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}
    />
  );
}
