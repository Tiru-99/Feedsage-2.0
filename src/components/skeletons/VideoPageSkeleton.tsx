import { Skeleton } from "@/components/ui/Skeleton";

export default function VideoPageSkeleton() {
    return (
        <div className="min-h-screen w-full bg-[#0f0f0f] text-white font-sans">
            <div className="mx-auto max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] px-4 sm:px-6 py-6">
                {/* Video Player Skeleton */}
                <div className="w-full rounded-xl overflow-hidden bg-black mb-4">
                    <div
                        className="relative w-full mx-auto overflow-hidden sm:max-h-[70vh]"
                        style={{
                            aspectRatio: "16 / 9",
                            maxWidth: "100%",
                        }}
                    >
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>

                {/* Video Info Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-7 w-[70%]" />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-[220px] flex-1">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Skeleton className="h-9 w-24 rounded-full" />
                            <Skeleton className="h-9 w-20 rounded-full" />
                            <Skeleton className="h-9 w-10 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Description Skeleton */}
                <div className="mt-4 p-4 rounded-xl bg-[#272727]/50">
                    <Skeleton className="h-4 w-48 mb-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-[80%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
