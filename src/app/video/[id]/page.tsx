"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import VideoComponent from "@/components/video/Video";
import Recommendations from "@/components/video/Recommendations";
import { PromptSubmitProvider } from "@/context/PromptSubmitContext";

export default function VideoPage() {
  const params = useParams();
  // Ensure we handle potential array or undefined (though in file usage it's usually string for [id])
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);


  return (
    <PromptSubmitProvider>
      <PageLayout>
        <div className="flex flex-col gap-6 pb-10">
          <VideoComponent id={id} />
          <hr className="border-gray-800 w-full max-w-7xl mx-auto" />
          <Recommendations />
        </div>
      </PageLayout>
    </PromptSubmitProvider>
  );
}
