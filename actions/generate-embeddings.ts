"use server"

import { generateEmbeddingssInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export const generateEmbeddingss = async (docId: string) => {
    auth().protect(); //protect 

    await generateEmbeddingssInPineconeVectorStore(docId);

    revalidatePath("/dashboard");

    return { comlpeted: true }
}