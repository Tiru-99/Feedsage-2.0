"use client";

import { Key, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const [showKey, setShowKey] = useState(false);
    const [apiKey, setApiKey] = useState<string>("");

    const handleSubmit = async () => {
        //send the request the backend 
        if (!apiKey) {
            console.log("No api key available");
            alert("No api key available");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/api-key`, {
                youtubeApiKey: apiKey
            }
            );

            const { success, message } = response.data;
            alert(message);
            console.log("Successfully saved the api key bro", success);
            onClose();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            const message =
                error.response?.data?.message ??
                "Something went wrong. Please try again.";
            alert(message);
            console.error("API key save failed:", error);
        }

    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-(--secondary) border border-(--border) w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                        <Key className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">API Configuration</h2>
                        <p className="text-sm text-gray-400">Enter your YouTube Data API Key</p>
                    </div>
                </div>

                <div className="relative mb-6">
                    <input
                        value={apiKey}
                        type={showKey ? "text" : "password"}
                        className="w-full bg-(--background) border border-(--border) rounded-lg pl-4 pr-12 py-3 text-(--foreground) placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="AIxaSy..."
                        onChange={(e) => {
                            setApiKey(e.target.value);
                        }}
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 hover:bg-(--secondary-hover) rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
                        onClick={handleSubmit}
                    >
                        Save Key
                    </button>
                </div>
            </div>
        </div>
    );
}
