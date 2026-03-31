import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateContent(prompt: string, model: string = "gemini-3-flash-preview") {
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });
  return response.text || "No response from AI.";
}

export async function generateSvg(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a clean, minimal SVG icon code for: "${prompt}". 
    Return ONLY the raw SVG code, starting with <svg> and ending with </svg>. 
    Do not include any markdown formatting or conversational text.`,
  });
  return response.text?.replace(/```svg|```/g, '').trim() || "";
}
