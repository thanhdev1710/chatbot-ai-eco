/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageCircle, Send, User, XCircle } from "lucide-react";
import { ScrollableButtons } from "./ScrollButton";

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
  const questions = [
    {
      name: "Giới thiệu về công ty",
      value: "ScrapBike là công ty gì? Thông tin chi tiết về công ty?",
    },
    {
      name: "Bảng giá phế liệu",
      value: "Danh sách giá thu mua và giá bán phế liệu hiện tại?",
    },
    {
      name: "Quy trình thu mua phế liệu",
      value: "ScrapBike thu mua phế liệu theo quy trình nào?",
    },
    {
      name: "Điều kiện thu mua phế liệu",
      value: "Công ty có yêu cầu gì khi thu mua phế liệu không?",
    },
    {
      name: "Loại phế liệu thu mua",
      value: "ScrapBike thu mua những loại phế liệu nào?",
    },
    {
      name: "Phương thức thanh toán",
      value: "Công ty thanh toán như thế nào khi thu mua phế liệu?",
    },
    {
      name: "Vận chuyển phế liệu",
      value: "ScrapBike có hỗ trợ vận chuyển phế liệu không?",
    },
    {
      name: "Liên hệ thu mua",
      value: "Làm thế nào để liên hệ với ScrapBike để bán phế liệu?",
    },
  ];
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
    <div className="flex flex-col h-svh p-6 relative">
      <div className="flex items-center justify-center mb-6">
        <MessageCircle className="text-green-700 w-10 h-10" />
        <h1 className="md:text-3xl text-xl font-bold text-green-800 ml-3">
          Trợ lý ảo Scrap
        </h1>
      </div>
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex-1 overflow-y-auto  overflow-x-hidden space-y-4 p-4 bg-white rounded-xl shadow-lg border border-green-300"
      >
        {messages.map((msg, index) => (
          <div className="flex items-center gap-2" key={index}>
            {msg.sender !== "user" && (
              <div
                className={`p-1 size-9 flex items-center justify-center shadow-lg border rounded-full text-gray-800`}
              >
                <Bot />
              </div>
            )}
            <Card
              className={`text-lg font-medium lg:max-w-lg md:max-w-md max-w-sm flex items-center gap-2 p-3 ${
                msg.sender === "user"
                  ? "ml-auto bg-green-200 text-green-900 flex-row-reverse"
                  : "text-gray-800"
              }`}
            >
              <CardContent className="break-words whitespace-pre-wrap">
                {msg.text}
              </CardContent>
            </Card>
            {msg.sender === "user" && (
              <div
                className={`p-1 size-9 flex items-center justify-center shadow-lg border rounded-full bg-green-200 text-green-900`}
              >
                <User />
              </div>
            )}
          </div>
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
                // Shift + Enter để xuống dòng
                setInput((prev) => {
                  return { name: prev.name + "\n", value: prev.value + "\n" };
                });
              } else {
                e.currentTarget.form?.requestSubmit();
              }
            }
          }}
          placeholder="Nhập tin nhắn..."
          rows={1} // Giữ chiều cao ban đầu giống input
          className="w-full border border-green-500 px-4 py-2 rounded-lg shadow-inner focus:ring-2 focus:ring-green-600 resize-none overflow-hidden"
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
