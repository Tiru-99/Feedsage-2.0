"use client";

import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";

interface CreateFeedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateFeedModal({
    isOpen,
    onClose,
}: CreateFeedModalProps) {
    const [prompt, setPrompt] = useState<string>("");

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/prompt`,
                { prompt }
            );

            const { message } = response.data;
            alert(message);
            onClose();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            const message =
                error.response?.data?.message ??
                "Something went wrong. Please try again.";

            alert(message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-(--secondary) border border-(--border) w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-(--border)">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Create New Feed
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-(--secondary-hover) text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        What do you want to watch?
                    </label>

                    {/* INPUT instead of textarea */}
                    <input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        autoFocus
                        placeholder="Indie game dev logs, History of Rome..."
                        className="w-full bg-(--background) border border-(--border) rounded-md p-3 text-(--foreground) placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm h-12"
                    />
                </div>

                <div className="p-4 border-t border-(--border) flex justify-end gap-2 bg-(--background)/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 hover:bg-(--secondary-hover) rounded-md text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-md text-sm font-bold transition-colors"
                        onClick={handleSubmit}
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
}

