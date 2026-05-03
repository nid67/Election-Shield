"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const askElectionAI = async (
  context: { age: number; registered: boolean; currentState?: string; name: string },
  question: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
    }
...
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini AI API Error:", {
      message: error.message,
      stack: error.stack,
      status: error.status
    });
    return "I'm currently recalibrating my data streams. Please try asking again in a moment, or check the ECI official portal.";
  }
};
