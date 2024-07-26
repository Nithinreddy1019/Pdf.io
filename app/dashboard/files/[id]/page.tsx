import { Chat } from "@/components/chat";
import { PdfView } from "@/components/pdf-view";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const ChatWithFilePage = async ({
    params: {id}
}: {
    params: {
        id: string
    }
}) => {

    auth().protect();
    const { userId } = await auth();

    const ref = await adminDb.collection("users")
                       .doc(userId as string)
                       .collection("files")
                       .doc(id)
                       .get();
    
    
    const url = ref.data()?.downloadUrl;


    
    return (
        <div className="grid lg:grid-cols-5 h-full overflow-hidden">
            <div className="col-span-5 lg:col-span-2 overflow-y-auto">
                <Chat id={id}/>
            </div>

            <div className="col-span-5 lg:col-span-3 border-r-2 lg:border-primary lg:-order-1 overflow-auto">
                <PdfView url={url}/>
            </div>
        </div>
    );
}
 
export default ChatWithFilePage;