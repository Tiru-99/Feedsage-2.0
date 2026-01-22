"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import CreateFeedModal from "./home/CreateFeedModal";
import ApiKeyModal from "./home/ApiKeyModal";

export default function PageLayout({ children }: { children: React.ReactNode }) {

    const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-(--background) text-(--foreground)">
            <div className="sticky top-0 z-50">
                <TopBar
                    onOpenFeedModal={() => setIsFeedModalOpen(true)}
                    onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                />
            </div>

            <CreateFeedModal isOpen={isFeedModalOpen} onClose={() => setIsFeedModalOpen(false)} />
            <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
