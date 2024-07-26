"use client"

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";import { Button } from "./ui/button";
import { useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfView: React.FC<{ url: string }> = ({ url }) => {

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
                }
                const file = await response.blob();
                setFile(file);
            } catch (err) {
                setError(err as string);
            }
          };

        fetchFile();
    }, [url]);


    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
    }


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="sticky top-0 z-50 p-2 rounded-b-lg bg-gray-200">
                <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pageNumber === 1}
                        onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1);
                            }
                        }}
                    >
                        Previous
                    </Button>
                    <p className="flex items-center justify-center text-sm">
                        {pageNumber} of {numPages}
                    </p>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pageNumber === numPages}
                        onClick={() => {
                            if (numPages) {
                                if(pageNumber < numPages) {
                                    setPageNumber(pageNumber + 1);
                                }
                            }
                        }}
                    >
                        Next
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setRotation(( rotation + 90) % 360)}
                    >
                        <RotateCw className="h-4 w-4"/>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={scale >= 1.5}
                        onClick={() => {
                            setScale(scale * 1.2)
                        }}
                    >
                        <ZoomInIcon className="h-4 w-4"/>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={scale <= 0.75}
                        onClick={() => {
                            setScale(scale/1.2)
                        }}
                    >
                        <ZoomOutIcon className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            {!file ? (
                <Loader2Icon className="animate-spin h-12 w-12 text-primary mt-16"/>
            ) : (
                <Document
                    loading={null}
                    file={file}
                    rotate={rotation}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="m-2 overflow-scroll"
                >
                    <Page 
                        className="shadow-md"
                        scale={scale}
                        pageNumber={pageNumber}
                    />
                </Document>
            )}
            
        </div>
    )
}