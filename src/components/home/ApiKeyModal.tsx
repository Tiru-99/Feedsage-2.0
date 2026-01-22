"use client";

import { Key, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/Toast";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!apiKey) {
      toast.error("No api key available");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/api-key`,
        { youtubeApiKey: apiKey }
      );

      const { message } = response.data;
      toast.success(message);
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="
          w-full max-w-md 
          rounded-xl border border-[#3f3f3f]
          bg-[#1f1f1f] shadow-2xl 
          animate-in zoom-in-95 duration-200
          p-6
        "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">API Configuration</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">
              YouTube Data API Key
            </label>
            <div className="relative group">
              <input
                value={apiKey}
                type={showKey ? "text" : "password"}
                placeholder="Paste your API key here..."
                onChange={(e) => setApiKey(e.target.value)}
                className="
                  w-full rounded-lg border border-[#3f3f3f]
                  bg-[#0f0f0f]
                  px-4 py-3 pr-12
                  text-sm text-white
                  placeholder:text-gray-600
                  focus:outline-none focus:border-blue-500
                  transition-all duration-200
                "
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Key className="w-3 h-3" />
              Your key is stored securely in our database (encrypted).
            </p>
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <button
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-gray-300 hover:text-white hover:bg-white/5
                transition-colors
              "
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-500
                transition-colors shadow-lg shadow-blue-900/20
              "
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
