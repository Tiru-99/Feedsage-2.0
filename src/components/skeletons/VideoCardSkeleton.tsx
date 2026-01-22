import { Skeleton } from "@/components/ui/Skeleton";

export default function VideoCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 group">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Info */}
            <div className="flex gap-3 items-start">
                {/* Avatar */}
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />

                {/* Text lines */}
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-4 w-[90%] rounded-md" />
                    <Skeleton className="h-3 w-[60%] rounded-md" />
                </div>
            </div>
        </div>
    );
}
