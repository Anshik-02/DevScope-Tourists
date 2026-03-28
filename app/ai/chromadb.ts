import { ChromaClient } from "chromadb";
const client = new ChromaClient({path: "https://chroma-latest-shb7.onrender.com"})

let _collection : Awaited<ReturnType<typeof client.getOrCreateCollection>> | null = null

export async function getCollection(){
    if(!_collection){
        _collection= await client.getOrCreateCollection({
            name:"devscope",
            embeddingFunction: undefined,
        })
    }
    return _collection
}