import { ChromaClient } from "chromadb";

const client= new ChromaClient({
    auth:{
        provider: "chroma",
        credentials: process.env.CHROMA_API_KEY!,
    },
    tenant:process.env.CHROMA_TENT!,
    database:process.env.CHROMA_DATABASE!
})
export async function getCollection(){
    try{

        const collection = await client.getOrCreateCollection(
            {
                name:"devscope",
        embeddingFunction: undefined
    }
)
return collection
}
catch (e){
    console.error(e)
}
}