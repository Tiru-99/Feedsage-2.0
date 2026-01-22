"use client";

import { useState } from "react";
import TopBar from "../TopBar";
import CreateFeedModal from "./CreateFeedModal";
import ApiKeyModal from "./ApiKeyModal";
import FeedGrid from "./FeedGrid";


export default function PageLayout() {

    const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);


    return (
        <>
            <div className="flex flex-col bg-(--background) text-(--foreground)">
                <TopBar
                    onOpenFeedModal={() => setIsFeedModalOpen(true)}
                    onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                />

                <CreateFeedModal isOpen={isFeedModalOpen} onClose={() => setIsFeedModalOpen(false)} />
                <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
            </div>

            <div className="max-w-[80vw] mx-auto">
                <FeedGrid ></FeedGrid>
            </div>
        </>
    );
}
