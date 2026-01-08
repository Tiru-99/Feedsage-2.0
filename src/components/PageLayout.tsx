"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import CreateFeedModal from "./CreateFeedModal";
import ApiKeyModal from "./ApiKeyModal";


export default function PageLayout({ children }: { children: React.ReactNode }) {

    const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);


    return (
        <div className="flex flex-col min-h-screen bg-(--background) text-(--foreground)">
            <TopBar
                onOpenFeedModal={() => setIsFeedModalOpen(true)}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            />
            <div className="flex flex-1">
                <main className={`flex-1 p-4 sm:p-6 overflow-x-hidden w-full`}>
                    {children}
                </main>
            </div>

            <CreateFeedModal isOpen={isFeedModalOpen} onClose={() => setIsFeedModalOpen(false)} />
            <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
        </div>
    );
}
