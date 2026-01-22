"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    icon?: React.ReactNode;
}

export default function ErrorDisplay({
    title = "Something went wrong",
    message,
    onRetry,
    icon,
}: ErrorDisplayProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#121212] rounded-2xl border border-neutral-800 max-w-lg mx-auto mt-10">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
                {icon || <AlertTriangle className="w-8 h-8 text-red-500" />}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-neutral-400 mb-6">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="
            flex items-center gap-2 px-5 py-2.5 
            bg-white text-black font-semibold rounded-lg
            hover:bg-neutral-200 transition-colors
          "
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
}
