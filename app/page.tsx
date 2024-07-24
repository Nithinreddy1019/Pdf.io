import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features } from "../constants/features";


export default function Home() {
    return (
        <>
            <MaxWidthWrapper className="mt-28 mb-12 sm:mt-40 flex flex-col items-center justify-center text-center">
                <div className="mx-auto mb-4 max-w-fit px-7 py-2 flex items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-300 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
                    <p className="text-sm font-semibold text-gray-600 ">Use Pdf.io now!</p>
                </div>
                <h1 className="max-w-4xl font-bold text-4xl md:text-6xl lg:text-7xl">
                    Chat with your
                    <span className="text-primary px-2">documents</span>
                    in seconds.
                </h1>
                <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
                    We allow you to chat with your pdf. Upload your file and ask questions right away.
                </p>

                <Link
                    href={"/sign-in"}
                    className={buttonVariants({
                        className: "mt-5",
                    })}
                >
                    Get started
                    <ArrowRight className="h-4 w-4 ml-2"/>
                </Link>

                
                <div className="relative mx-auto max-w-fit px-7 py-2">
                    <div className="mt-12">
                        <Image 
                            alt="Document"
                            src={"/landing.jpeg"}
                            height={650}
                            width={950}
                            className="border rounded-xl shadow-2xl mb-[-0%]"
                        />
                    </div>
                    <div className="relative mx-auto max-w-fit" aria-hidden={true}>
                        <div className="absolute bg-gradient-to-t from-white/90 pt-[5%] -inset-x-32 bottom-0"/>
                    </div>
                </div>


                <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8 sm:mt-20 md:mt-24">
                    <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                        {features.map((feature) => (
                            <div className="md:pl-9 relative" key={feature.name}>
                                <dt className="inline text-gray-900 font-semibold">
                                    <feature.icon 
                                        aria-hidden={true}
                                        className="absolute left-1/2 -top-6 h-5 w-5 text-primary"
                                    />
                                </dt>

                                <dd>{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </MaxWidthWrapper>

        </>  
    );
}
