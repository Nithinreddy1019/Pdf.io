"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"


export const Placeholder = () => {

    const router = useRouter();

    const handleClick = () => {
        router.push("/dashboard/upload")
    }

    return (
        <Button
            onClick={handleClick}
            className="flex drop-shadow-md"
        >
            <PlusCircle className="h-4 w-4 mr-2"/>
            <p>Add a document</p>
        </Button>
    )
}