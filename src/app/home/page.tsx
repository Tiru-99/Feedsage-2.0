"use client";

import PageLayout from "@/components/home/PageLayout";
import { PromptSubmitProvider } from "@/context/PromptSubmitContext";

export default function Home() {
  return (
    <PromptSubmitProvider>
      <PageLayout></PageLayout>
    </PromptSubmitProvider>
  );
}
