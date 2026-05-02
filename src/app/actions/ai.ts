"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const askElectionAI = async (
  context: { age: number; registered: boolean; currentState?: string; name: string },
  question: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `
      You are "Election Shield AI", a premium, empathetic, and highly knowledgeable election co-pilot assistant for families in India.
      
      USER CONTEXT:
      - Name: ${context.name}
      - Age: ${context.age}
      - Registration Status: ${context.registered ? "Successfully Registered" : "NOT Registered"}
      - Current Journey Phase: ${context.currentState || "General Inquiry"}

      CORE MISSION:
      Provide accurate, concise, and encouraging advice to help this family member navigate the democratic process in India.

      GUIDELINES:
      1. **Indian Context Only**: Base all answers on rules from the Election Commission of India (ECI).
      2. **Conciseness**: Use bullet points. Keep total response under 150 words.
      3. **State Awareness**: Since the user is in the "${context.currentState}" phase, prioritize advice relevant to that step.
      4. **Ineligible Users**: If the user is under 18, focus on how they can be a "democracy volunteer" or learn, rather than voting rules.
      5. **Safety**: Never give legal advice or predict election results. Stick to process and logistics.
      6. **Formatting**: Use **bolding** for important documents or dates.

      QUESTION: "${question}"
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("AI Error:", error);
    return "I'm currently recalibrating my data streams. Please try asking again in a moment, or check the ECI official portal.";
  }
};
