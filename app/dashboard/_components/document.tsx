"use client"

import byteSize from "byte-size";
import { useRouter } from "next/navigation";

export const Document = ({
   id,
   name,
   size,
   downloadUrl 
}: {
    id: string,
    name: string,
    size: number,
    downloadUrl: string
}) => {

    
    const router = useRouter()


    return (
        <div className="flex flex-col w-24 h-32 rounded-xl drop-shadow-md bg-primary/15 justify-between p-2 transition-all transform hover:scale-105 hover:bg-primary/75 hover:text-white cursor-pointer group">
            <div
                className="flex-1"
                onClick={() => {
                    router.push(`/dashboard/files/${id}`)
                }}
            >
                <p className="font-semibold text-xs line-clamp-2">{name}</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-200">
                    {byteSize(size).value} KB
                </p>
            </div>
        </div>
    )
}