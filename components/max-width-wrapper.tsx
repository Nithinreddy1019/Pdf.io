import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
    children: React.ReactNode;
    className: string
}


export const MaxWidthWrapper = ({
    children,
    className
}: MaxWidthWrapperProps) => {
    return (
        <div className={cn("mx-auto max-w-screen-xl px-2.5 w-full md:px-20", className)}>
            {children}
        </div>
    )
}