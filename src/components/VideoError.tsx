"use client";

import { AlertTriangle } from "lucide-react";

interface VideoErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function VideoError({
  title = "Something went wrong",
  message,
  onRetry,
}: VideoErrorProps) {
  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#ff4e45] mx-auto" />

        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        <p className="text-sm text-[#aaaaaa]">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-[#f1f1f1] transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
