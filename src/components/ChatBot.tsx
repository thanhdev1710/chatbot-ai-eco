"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, XCircle } from "lucide-react";

export default function Chatbot() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Chào mừng bạn đến với chatbot môi trường!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [controller, setController] = useState<AbortController | null>(null);
  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setLoading(true);
    setBotTyping(true);

    const abortController = new AbortController();
    setController(abortController);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error("Lỗi máy chủ");

      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { text: "Yêu cầu đã bị hủy!", sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Lỗi khi lấy dữ liệu từ chatbot.", sender: "bot" },
        ]);
      }
    }

    setLoading(false);
    setBotTyping(false);
    setController(null);
  };

  return (
    <div className="flex flex-col h-svh bg-gradient-to-b from-green-200 to-green-50 p-6 relative">
      <div className="flex items-center justify-center mb-6">
        <MessageCircle className="text-green-700 w-10 h-10" />
        <h1 className="md:text-3xl text-xl font-bold text-green-800 ml-3">
          Chatbot - Môi trường
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 p-4 bg-white rounded-xl shadow-lg border border-green-300">
        {messages.map((msg, index) => (
          <Card
            key={index}
            className={`text-lg font-medium lg:max-w-lg md:max-w-md max-w-sm ${
              msg.sender === "user"
                ? "ml-auto bg-green-200 text-green-900"
                : "text-gray-800"
            }`}
          >
            <CardContent className="break-words whitespace-pre-wrap">
              {msg.text}
            </CardContent>
          </Card>
        ))}
        {botTyping && (
          <Card className="max-w-xs bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md text-lg font-medium">
            <CardContent className="flex space-x-1">
              <span className="animate-[bounce_1s_0.1s_infinite]">.</span>
              <span className="animate-[bounce_1s_0.2s_infinite]">.</span>
              <span className="animate-[bounce_1s_0.3s_infinite]">.</span>
            </CardContent>
          </Card>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-6 flex items-center gap-3"
      >
        <Input
          disabled={loading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border-green-500 px-4 py-2 rounded-lg shadow-inner focus:ring-2 focus:ring-green-600"
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
            onClick={() => {
              if (controller) controller.abort();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        )}
      </form>
    </div>
  );
}
