"use client";
import { Copy, Check } from "lucide-react";
import React, { useState } from "react";

export default function ButtonCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Sau 1s, đổi lại icon Copy
    });
  };

  return (
    <div
      onClick={handleCopy}
      className="p-2 rounded-full border shadow cursor-pointer transition-all duration-300"
    >
      {copied ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <Copy className="size-3" />
      )}
    </div>
  );
}
