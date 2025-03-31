/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Copy,
  FlagOff,
  MessageCircle,
  Send,
  User,
  XCircle,
} from "lucide-react";
import { ScrollableButtons } from "./ScrollButton";
import ButtonVoice from "./ButtonVoice";
import { questions } from "@/lib/base";
import ButtonCopy from "./ButtonCopy";
import VoiceRecorderButton from "./ButtonMic";

export default function Chatbot() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào tôi là Scrap, trợ lý ảo của công ty ScrapBike!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState({ name: "", value: "" });
  const [controller, setController] = useState<AbortController | null>(null);
  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = async () => {
    if (loading || !input.value.trim()) return;
    setMessages([...messages, { text: input.name, sender: "user" }]);
    setInput({ name: "", value: "" });
    setLoading(true);
    setBotTyping(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ message: input.value }),
        signal: abortController.signal,
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
    <div className="flex flex-col h-screen p-6 relative">
      <div className="flex items-center justify-center mb-6">
        <MessageCircle className="text-green-700 w-10 h-10" />
        <h1 className="md:text-3xl text-xl font-bold text-green-800 ml-3">
          Trợ lý ảo Scrap
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-xl shadow-lg border border-green-300">
        {messages.map((msg, index) => (
          <div className="flex items-center gap-2" key={index}>
            {msg.sender !== "user" && <Bot />}
            <Card
              className={`text-lg relative font-medium max-w-sm p-3 ${
                msg.sender === "user" ? "ml-auto bg-green-200" : "text-gray-800"
              }`}
            >
              <CardContent className="break-words whitespace-pre-wrap">
                {msg.text}
              </CardContent>
              <div
                className={`absolute flex gap-2 -bottom-[36px] ${
                  msg.sender === "user"
                    ? "right-0 flex-row"
                    : "left-0 flex-row-reverse"
                }`}
              >
                <ButtonVoice text={msg.text} />
                <ButtonCopy text={msg.text} />
                <div className="p-2 rounded-full border shadow cursor-pointer">
                  <FlagOff className="size-3" />
                </div>
              </div>
            </Card>

            {msg.sender === "user" && (
              <div className="p-1 size-9 flex items-center justify-center shadow-lg border rounded-full bg-green-200 text-green-900">
                <User />
              </div>
            )}
          </div>
        ))}
        {botTyping && (
          <Card className="max-w-xs bg-gray-100 p-3 rounded-lg shadow-md text-lg font-medium">
            <CardContent className="flex space-x-1">
              <span className="animate-[bounce_1s_0.1s_infinite]">.</span>
              <span className="animate-[bounce_1s_0.2s_infinite]">.</span>
              <span className="animate-[bounce_1s_0.3s_infinite]">.</span>
            </CardContent>
          </Card>
        )}
      </div>
      <ScrollableButtons
        questions={questions}
        sendMessage={sendMessage}
        setInput={setInput}
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage();
        }}
        className="mt-2 flex items-center gap-3"
      >
        <textarea
          disabled={loading}
          value={input.value}
          onChange={(e) =>
            setInput({ name: e.target.value, value: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) {
                setInput((prev) => ({
                  name: prev.name + "\n",
                  value: prev.value + "\n",
                }));
              } else {
                e.currentTarget.form?.requestSubmit();
              }
            }
          }}
          placeholder="Nhập tin nhắn..."
          rows={1}
          className="w-full border px-4 py-2 rounded-lg shadow-inner focus:ring-2 resize-none"
        />
        <VoiceRecorderButton
          loading={loading}
          messages={messages}
          setBotTyping={setBotTyping}
          setController={setController}
          setLoading={setLoading}
          setMessages={setMessages}
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          {loading ? "Đang gửi..." : <Send className="w-5 h-5" />}
        </Button>
        {loading && (
          <Button
            onClick={() => controller?.abort()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        )}
      </form>
    </div>
  );
}
