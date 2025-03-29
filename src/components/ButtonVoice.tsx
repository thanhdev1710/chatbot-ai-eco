import { StopCircle, Volume2 } from "lucide-react";
import React, { useRef, useState } from "react";

export default function ButtonVoice({ text }: { text: string }) {
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handlePlay = async (value: string) => {
    try {
      setVoiceLoading(true);
      const response = await fetch("https://gtts-2dfw.onrender.com/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });

      if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }

      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Lỗi phát âm thanh:", error);
      alert("Không thể phát âm thanh!");
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-2 rounded-full border shadow">
      {voiceLoading ? (
        <div className="size-3 border border-black border-t-white rounded-full animate-spin"></div>
      ) : isPlaying ? (
        <div className="cursor-pointer w-full h-full" onClick={handleStop}>
          <StopCircle className="size-3" />
        </div>
      ) : (
        <div
          className="cursor-pointer w-full h-full"
          onClick={() => handlePlay(text)}
        >
          <Volume2 className="size-3" />
        </div>
      )}
    </div>
  );
}
