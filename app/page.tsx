import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function Home() {
    return (
        <>
            <MaxWidthWrapper className="mt-28 mb-12 sm:mt-40 flex flex-col items-center justify-center text-center">
                <div className="mx-auto mb-4 max-w-fit px-7 py-2 flex items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-300 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
                    <p className="text-sm font-semibold text-gray-600 ">Use Pdf.io now!</p>
                </div>
                <h1 className="max-w-4xl font-bold text-5xl md:text-6xl lg:text-7xl">
                    Chat with your
                    <span className="text-primary px-2">documents</span>
                    in seconds.
                </h1>
                <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
                    We allow you to chat with your pdf. Upload your file and ask questions right away.
                </p>

                <Link
                    href={"/dashboard"}
                    target="_blank"
                    className={buttonVariants({
                        className: "mt-5",
                    })}
                >
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2"/>
                </Link>
            </MaxWidthWrapper>

        </>  
    );
}
