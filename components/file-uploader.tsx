"use client"

import { cn } from '@/lib/utils'
import { CircleArrowDown, Rocket } from 'lucide-react'
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'


export const FileUpload = () => {


    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])

    const {getRootProps, getInputProps, isDragActive, isFocused} = useDropzone({onDrop})



    return (
        <div className='max-w-7xl mx-auto flex flex-col gap-4 items-center mt-12'>
            <div 
                {...getRootProps()}
                className={cn("p-4 border-primary border-2 rounded-lg border-dashed text-primary flex items-center justify-center h-64 w-72 bg-primary/10", (isDragActive || isFocused && "bg-primary"))}
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
            </div>
        </div>
    )
}