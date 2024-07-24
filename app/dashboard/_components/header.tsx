import { Button } from "@/components/ui/button"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { FilePlus } from "lucide-react"
import Link from "next/link"


export const Header = () => {
    return (
        <div className="flex justify-between p-2 px-4 shadow-sm bg-opacity-55 bg-white">
            <Link href={"/dashboard"} className="text-primary font-bold text-xl">
                Pdf.io
            </Link>

            <SignedIn>
                <div className="flex items-center">
                    <Button asChild variant="link" className="hidden md:flex">
                        <Link href={"/dashboard/upgrade"}>
                            Pricing
                        </Link>
                    </Button>

                    <Button asChild size="sm" className="hidden md:flex">
                        <Link href={"/dashboard"}>
                            My documents
                        </Link>
                    </Button>

                    <Button asChild size="sm" className="hidden md:flex ml-4">
                        <Link href={"/dashboard/upload"}>
                            <FilePlus className="h-4 w-4"/>
                        </Link>
                    </Button>

                    <div className="ml-4">
                    <UserButton />
                    </div>
                </div>
            </SignedIn>
        </div>
    )
}