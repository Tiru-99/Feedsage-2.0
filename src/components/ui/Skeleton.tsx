function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`animate-pulse rounded-md bg-[#272727] ${className || ""}`}
            {...props}
        />
    );
}

export { Skeleton };
