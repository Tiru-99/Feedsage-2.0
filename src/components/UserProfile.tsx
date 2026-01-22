"use client";

import { useUser } from "@/context/UserContext";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 flex items-center justify-center"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt="User avatar"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover border border-[--border]"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-[--secondary] flex items-center justify-center border border-[--border]">
            <span className="text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5
                     z-50 w-28 rounded-md
                     border border-gray-300/20
                     bg-[--background]
                     shadow-sm"
        >
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-1.5
                       px-2.5 py-1.5 text-xs
                       text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
