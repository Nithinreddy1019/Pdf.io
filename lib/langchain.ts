import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { PineconeStore } from "@langchain/pinecone"
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";

import { auth } from "@clerk/nextjs/server";

import { adminDb } from "@/firebaseAdmin";
import pineconeClient from "./pinecone";

const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o"
});


export const indexName = "pdfio";

const fetchmessageFrom = async (docId: string) => {
    const { userId} = await auth();
    if(!userId) {
        throw new Error("User not found")
    }

    console.log("----  fetching chat hiostory ---");
    const chats = await adminDb.collection("users")
                                .doc(userId)
                                .collection("files")
                                .doc(docId)
                                .collection("chat")
                                .orderBy("createdAt", "desc")
                                .get()

    const chatHistory = chats.docs.map((doc) => 
        doc.data().role === "human"
            ? new HumanMessage(doc.data().message)
            : new AIMessage(doc.data().message)
    )


    console.log("---- fetched chat hoistory ----")

    console.log(chatHistory.map((msg) => msg.content.toString()));

    return chatHistory;

}


const namespaceExists = async (index: Index<RecordMetadata>, namespace: string) => {
    if (namespace === null) throw new Error("No namespace value provided");

    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;

};


export const generateDocs = async (docId: string) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("User not found")
    };

    console.log("---Fetching the download URL from firebase ----");

    const firebaseRef = await adminDb.collection("users")
                                     .doc(userId)
                                     .collection("files")
                                     .doc(docId)
                                     .get();

    const downloadUrl = firebaseRef.data()?.downloadUrl;

    if(!downloadUrl) {
        throw new Error("download Url not found")
    }
    console.log("---- Download Url fetched successfully ----");

    //fetch the pdf
    const response = await fetch(downloadUrl);

    //load the pdf into a pdf Doc object
    const data = await response.blob();


    //load the pdf doc from the specified path 
    console.log("--- Loading pdf document ---");
    const loader = new PDFLoader(data);
    const docs = await loader.load();


    //split the document into smaller parts for easier processing
    console.log("---- splittign document into smaller parts ----");
    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`--- Split into ${splitDocs.length} parts ---`);


    return splitDocs;
}


export const generateEmbeddingssInPineconeVectorStore = async (docId: string) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("User not found");
    }

    let pineconeVectorStore;

    //generate embeddings for split docs
    console.log("-----generate embeddings for split docs------");
    const embeddings = new OpenAIEmbeddings();

    const index = await pineconeClient.index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if (namespaceAlreadyExists) {
        console.log("---- Namespace already exists, reusing existing embeddings ----");

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId
        });

        return pineconeVectorStore;
    } else {
        // If namespace does not exist, download PDF from firestore and then generate embeddings and store them in pinecone vector store.

        const splitDocs = await generateDocs(docId);

        console.log(` --- Storing the embeddings in namespace ${docId} in the ${indexName} pinecone vector store`);

        pineconeVectorStore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: docId
            }
        );

        return pineconeVectorStore;
    }
}


const generateLangchainCompletion = async (docId: string, question: string) => {
    let pineconeVectorStore;

    pineconeVectorStore = await generateEmbeddingssInPineconeVectorStore(docId);


    if(!pineconeVectorStore) {
        throw new Error("Pinecone vector store not found")
    }

    console.log("---- retriever cration ----");
    const retriever = pineconeVectorStore.asRetriever();

    //fetch chat histiry from db
    const chatHistory = await fetchmessageFrom(docId);

    console.log(" ---- creating promt templet ----");
    const historyAwareprompt = ChatPromptTemplate.fromMessages([
        ...chatHistory,

        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
        ],

    ]);

    console.log(" --- hiostory aware retrieval chain ----")
    const historyAwareRetrievalChain = await createHistoryAwareRetriever({
        llm: model,
        retriever,
        rephrasePrompt: historyAwareprompt,
    });

    console.log("---- define a prompt templat e for answeriong questions ----");
    const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "Answer the user's questions based on the below context:\n\n{context}",
        ],

        ...chatHistory,

        ["user", "{input}"],
    ]);



    console.log("---- Creating a document combnining chain ----");
    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt: historyAwareRetrievalPrompt
    });


    console.log("---- Creating the main retrieval chain ----");
    const conversationalRetrievalchain = await createRetrievalChain({
        retriever: historyAwareRetrievalChain,
        combineDocsChain: historyAwareCombineDocsChain
    });


    console.log("---- Runnign the chain with a sample conversation ----");
    const reply = await conversationalRetrievalchain.invoke({
        chat_history: chatHistory,
        input: question
    });


    console.log(reply.answer);
    return reply.answer;

};


export { model, generateLangchainCompletion };
