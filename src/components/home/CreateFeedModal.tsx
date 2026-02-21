"use client";

import { Sparkles, X, Loader2 } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { usePromptSubmit } from "@/context/PromptSubmitContext";
import { useToast } from "@/components/ui/Toast";

interface CreateFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARS = 200;

export default function CreateFeedModal({
  isOpen,
  onClose,
}: CreateFeedModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { notifyPromptSubmit } = usePromptSubmit();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (prompt.length > MAX_CHARS) {
      toast.error(`Prompt cannot exceed ${MAX_CHARS} characters`);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/prompt`,
        { prompt },
      );

      toast.success(response.data.message);
      notifyPromptSubmit();
      onClose();
      setPrompt("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(
        error.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#181818] border border-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Create New Feed
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            What do you want to watch?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setPrompt(e.target.value);
              }
            }}
            maxLength={MAX_CHARS}
            rows={4}
            placeholder="Indie game dev logs, React tutorials, system design breakdowns..."
            className="
              w-full resize-none rounded-xl
              bg-[#0f0f0f] border border-neutral-700
              px-4 py-3 text-sm text-white
              placeholder-neutral-500
              focus:outline-none focus:ring-2 focus:ring-purple-500
              overflow-y-auto
            "
          />

          <div className="mt-2 text-xs text-neutral-500 text-right">
            {prompt.length}/{MAX_CHARS}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-800 bg-[#121212]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-5 py-2 rounded-lg text-sm font-semibold
              bg-white text-black
              hover:bg-neutral-200
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
