import { auth } from "@clerk/nextjs/server"
import { Placeholder } from "./placeholder"
import { adminDb } from "@/firebaseAdmin";
import { Document } from "./document";



export const Documents = async () => {

    auth().protect();
    const { userId } = await auth();

    if(!userId) {
        throw new Error("user not found")
    };

    const documentsSnapshot = await adminDb.collection("users")
                                            .doc(userId)
                                            .collection("files")
                                            .get();
                                        
    

    return (
        <div className="flex flex-wrap justify-center p-4 lg:justify-start gap-4 rounded-sm max-w-7xl mx-auto">

            {documentsSnapshot.docs.map((doc) => {
                const { name, downloadUrl, size } = doc.data();

                return (    
                    <Document 
                        key={doc.id}
                        id={doc.id}
                        name={name}
                        size={size}
                        downloadUrl={downloadUrl}
                    />
                )
            })}

            <Placeholder />
        </div>
    )
}