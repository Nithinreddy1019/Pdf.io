"use client"

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loader, Loader2Icon } from "lucide-react";
import { askQuestion } from "@/actions/ask-question";
import { ChatMessage } from "./chat-message";
// import { ChatMessage } from "@langchain/core/messages";
// import ChatMessage from "./ChatMessage";


export type Message = {
    id?: string,
    role: "human" | "ai" | "placeholder",
    message: string,
    createdAt: Date
}


export const Chat = ({
    id
}: { id: string }) => {

    const { user } = useUser();

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();

    const bottomchatRef = useRef<HTMLDivElement>(null);

    const [snapshot, loading, error] = useCollection(
        user && 
        query(
            collection(db, "users", user.id, "files", id, "chat"),
            orderBy("createdAt", "asc")
        )
    );

    useEffect(() => {
        bottomchatRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [messages])

    useEffect(() => {
        if(!snapshot) return;

        const lastMessage = messages.pop();
        if(lastMessage?.role === "ai" && lastMessage.message === "Thinking...") {
            return;
        };

        const newMessages = snapshot.docs.map((doc) => {
            const { role, message, createdAt} = doc.data();

            return {
                id: doc.id,
                role,
                message,
                createdAt: createdAt.toDate()
            }

        });
        setMessages(newMessages);



        console.log("upload snapshot", snapshot.docs);
    }, [snapshot])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input;
        setInput("");

        setMessages ((prev) => [
            ...prev,
            {
                role: "human",
                message: q,
                createdAt: new Date()
            },
            {
                role: "ai",
                message: "Thinking...",
                createdAt: new Date()
            }
        ])      

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);


            if(!success) {
                setMessages((prev) => 
                    prev.slice(0, prev.length - 1).concat([
                        {
                            role: "ai",
                            message: `Whoops ...${message}`,
                            createdAt: new Date()
                        }
                    ])
                )
            }
        })

    };

    return (
        <div className="flex flex-col h-full overflow-scroll">
            <div className="flex-1 w-full">

                {loading ? (
                    <div className="flex items-center justify-center">
                        <Loader className="animate-spin h-8 w-8 text-primary mt-16"/>
                    </div>
                ) : (
                    <div className="p-4">
                        {messages.length === 0 && (
                            <ChatMessage 
                                key="placeholder"
                                message={{
                                    role: "ai",
                                    message: "Ask me anything about the document!!",
                                    createdAt: new Date()
                                }}
                            />
                        )}

                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message}/>
                        ))}


                        <div ref={bottomchatRef}/>
                    </div>
                )}

                
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex sticky bottom-0 space-x-2 p-4 bg-primary/20 rounded-b-lg lg:rounded-none lg:rounded-t-lg"
            >
                <Input 
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Button
                    disabled={!input || isPending}
                    type="submit"
                >
                    {isPending ? (
                        <>
                        <Loader className="h-4 w-4 animate-spin mr-2"/>
                        <span>Getting</span>
                        </>
                    ): (
                        "Ask"
                    )}
                </Button>
            </form>
        </div>
    )
}