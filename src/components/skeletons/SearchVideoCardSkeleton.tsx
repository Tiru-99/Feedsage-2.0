import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchVideoCardSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 py-4 px-2">
            {/* Thumbnail */}
            <div className="
        relative w-full
        sm:w-[320px] sm:h-[180px]
        aspect-video
        flex-shrink-0
        rounded-xl
        overflow-hidden
      ">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Info */}
            <div className="flex flex-1 justify-between gap-2 min-w-0">
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <Skeleton className="h-5 w-[80%] rounded-md" />
                    <Skeleton className="h-3 w-[40%]" />

                    <div className="flex items-center gap-2 mt-2">
                        <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                        <Skeleton className="h-3 w-[120px]" />
                    </div>

                    <Skeleton className="hidden sm:block h-3 w-[90%] mt-2" />
                </div>
            </div>
        </div>
    );
}
