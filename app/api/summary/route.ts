import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
    const { code } = await req.json();
    if (!code) {
      throw new Error("No code provided");
    }

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert code analyst. Your job is to explain the code and break it down to the user.
Answer by keeping these points in mind:
1. Explain the functional working of the passed code.
2. Keep the explanation short and brief.
3. Respond in easily understandable language.

Code:
${code}`,
            },
          ],
        },
      ],
    });
    const output = res.text;
    return NextResponse.json({ output });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Something went wrong. Unable to generate the summary." },
      { status: 500 }
    );
  }
}