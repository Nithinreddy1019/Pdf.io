"use client"

import { generateEmbeddingss } from "@/actions/generate-embeddings";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { v4 as uuidv4 } from "uuid";


export enum StatusText {
    UPLOADING="Uploading file...",
    UPLOADED="File uploaded successfully",
    SAVING="Saving file to the database...",
    GENERATING="Generating AI embeddings, this will take a few seconds..."
}
export type Status = StatusText[keyof StatusText]


export const useUpload = () => {

    const router = useRouter();

    const [progress, setProgress] = useState<number | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);

    const { user } = useUser();


    const handleUpload = async (file: File) => {
        if(!file || !user) return;

        //WIP: implement free plan restrictions
        const fileIdToUploadTo = uuidv4();

        //location where you wnat the file
        const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`);
        //uploading to that location
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setStatus(StatusText.UPLOADING);
            setProgress(percent);
        }, (error) => {
            console.log("Error uploading the file", error);
        }, async () => {
            setStatus(StatusText.UPLOADED);

            //upload to storage
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setStatus(StatusText.SAVING);

            //store the link in database
            await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
                name: file.name,
                size: file.size,
                type: file.type,
                downloadUrl: downloadUrl,
                ref: uploadTask.snapshot.ref.fullPath,
                createdAt: new Date()
            })
        });

        setStatus(StatusText.GENERATING);
        //Generate embeddings...
        await generateEmbeddingss(fileIdToUploadTo);

        setFileId(fileIdToUploadTo);

    }


    return { progress, fileId, status, handleUpload }
}