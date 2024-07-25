"use client"

import { StatusText, useUpload } from '@/hooks/useUpload'
import { cn } from '@/lib/utils'
import { CheckCircle, CircleArrowDown, Hammer, Rocket, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'


export const FileUpload = () => {

    const { progress, status, fileId, handleUpload } = useUpload();
    const router = useRouter();

    useEffect(() => {
        if(fileId) {
            router.push(`/dashboard/files/${fileId}`);
        }
    }, [fileId, router])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Do something with the files
        const file = acceptedFiles[0];
        if (file) {
            //upload
            await handleUpload(file);
        } else {
            //do something
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive, isFocused} = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
    })

    const uploadInProgress = progress != null && progress >=0 && progress <= 0;

    const statusIcons: {
        [key in StatusText]: JSX.Element
    } = {
        [StatusText.UPLOADING] : (<Rocket className='h-12 w-12 text-primary'/>),
        [StatusText.UPLOADED] : (<CheckCircle className='h-12 w-12 text-primary'/>),
        [StatusText.SAVING] : (<Save className='h-12 w-12 text-primary'/>),
        [StatusText.GENERATING] : (<Hammer className='h-12 w-12 text-primary'/>),

    }

    return (
        <div className='max-w-7xl mx-auto flex flex-col gap-4 items-center mt-12'>
            
            {uploadInProgress && (
                <div className='mt-16 flex flex-col justify-center items-center gap-4'>
                    <div
                        className={`radial-progress bg-primary/10 text-primary border-primary border-2 ${progress === 100 && "hidden"}`}
                        role='progressbar'
                        style={{
                            //@ts-ignore
                            "--value": progress,
                            "--size": "5rem",
                            "--thickness": "0.7rem"
                        }}
                    >
                        {progress}%
                    </div>

                    
                    {
                        //@ts-ignore
                        statusIcons[status]
                    }

                    <p className='text-primary animate-pulse'>{status as string}</p>
                </div>
            )}

            {!uploadInProgress && (
                <div 
                {...getRootProps()}
                className={cn("p-4 border-primary border-2 rounded-lg border-dashed text-primary flex items-center justify-center h-64 w-72 bg-primary/10", (isDragActive || isFocused && "bg-primary/50"))}
            >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    (
                        <>
                            <Rocket className='h-6 w-6 mr-2'/>
                            <p>Drop the files here ...</p>
                        </>
                    )
                    :
                    (
                        <>
                            <CircleArrowDown className='h-12 w-12 mr-2 animate-bounce'/>
                            <p>Drag and drop some files here, or click to select files</p>
                        </>
                    )
                    
                }
            </div>)}
        </div>
    )
}