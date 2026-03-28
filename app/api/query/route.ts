import { GoogleGenAI } from "@google/genai";
import { getEmbeddings } from "@/app/ai/embed";
import { getCollection } from "@/app/ai/chromadb";
import { NextResponse } from "next/server";
export const POST=async (req:Response)=>{
    try{
        const collection =await getCollection()
        const ai= new GoogleGenAI({
            apiKey:process.env.GEMINI_API_KEY!,
        })
        const {query}= await req.json()
        const queryEmbedd=await getEmbeddings(query)
        const result= await collection?.query({
            queryEmbeddings:[queryEmbedd],
            nResults: 5
        })
        const docs=result?.documents?.[0]
        // const context= docs.join("/n/n")
        if(!docs){
            return NextResponse.json({msg:"No relevant answers found"})
        }
        const ans= ai.models.generateContent({
            model:'gemini-2.5-flash',
            contents:[
                {
                    role:'user',
                    parts:[{
                        text:`You are a professional senior software engineer and you have to help user by answering their queries and analysing the code provided.
                        While answeing make sure to keep the following points in considerations

                        1. Keep the answer brief and short.
                        2. Make sure to answer what user asks.
                        3. If possible mention the work flow.
                        4. If code looks weak, point it out.

                        Query : ${query}

                        Code : ${docs.join("/n/n")}
                        `
                    }]
                }
                
            ]
        })
        if(!ans){
            return NextResponse.json({msg: "Unable to answer the query right now"})
        }
        return ans
    }
    catch(e){
        console.error(e)
        throw new Error("Internal error")
    }
}