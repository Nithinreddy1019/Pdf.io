"use client"

import { useUser } from "@clerk/nextjs"
import { Message } from "./chat"
import Image from "next/image";
import { BotIcon, Loader } from "lucide-react";
import Markdown from "react-markdown";


export const ChatMessage = ({message}: {message: Message}) => {

    const { user } = useUser();
    const isHuman = message.role === "human";



    return (
        <div
            className={`chat ${isHuman ? "chat-end" : "chat-start"}`}
        >
            <div className="chat-image avatar">
                <div className="w-8 rounded-full">
                    {isHuman ? (
                        user?.imageUrl && (
                            <Image 
                                src={user.imageUrl}
                                alt="Profile picture"
                                height={25}
                                width={25}
                                className="rounded-full"
                            />
                        )
                    ): (
                        <div className="h-8 w-8 bg-primary flex items-center justify-center rounded-full">
                            <BotIcon className="text-white  rounded-full h-4 w-4"/>
                        </div>
                    )}
                </div>
            </div>

            <div className={`chat-bubble prose ${isHuman && "bg-primary text-white"}`}>
                {
                    message.message === "Thinking..." ? (
                        <div className="flex items-center justify-center">
                            <Loader className="animate-spin h-4 w-4 text-white"/>
                        </div>
                    ) : (
                        <Markdown>{message.message}</Markdown>
                    )
                }
            </div>
        </div>
    )
}