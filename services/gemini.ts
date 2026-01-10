
import { GoogleGenAI, Type } from "@google/genai";

// Service for interacting with SARA (Study Assistant for Real-time Analysis)
export const getSaraResponse = async (prompt: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context (Discussion & Notes): ${context}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction: "You are SARA (Study Assistant for Real-time Analysis), KIVIA's expert academic AI. You help peer study groups by synthesizing their discussions, explaining concepts from shared materials, and providing encouragement. Keep answers concise, helpful, and academically rigorous but accessible. Always refer to the group's specific context when available.",
        temperature: 1.0,
        // Pro models require a non-zero thinking budget when using the thinking feature
        thinkingConfig: { thinkingBudget: 16384 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I hit a snag in my processing. Could you try rephrasing or focusing on a specific part of your discussion?";
  }
};

export const generateSmartNotes = async (conversation: string) => {
  if (!conversation.trim()) return [];
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Study Group Discussion Transcript:\n${conversation}`,
      config: {
        systemInstruction: "Extract meaningful study notes from this transcript. Focus on definitions, formulas, theories, and key dates. Ignore small talk.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short descriptive concept name" },
              content: { type: Type.STRING, description: "Detailed explanation or formula" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Academic subjects" }
            },
            required: ["title", "content", "tags"],
            propertyOrdering: ["title", "content", "tags"],
          }
        },
        thinkingConfig: { thinkingBudget: 8192 }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Smart Note Generation Error:", error);
    return [];
  }
};

export const generateFlashcards = async (notebookContent: string) => {
  if (!notebookContent.trim()) return [];
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Existing Notebook Concepts:\n${notebookContent}`,
      config: {
        systemInstruction: "Convert these notebook entries into a series of active-recall flashcards. Each card should have a 'term' (the concept/question) and a 'definition' (the answer/explanation). Ensure they are concise and perfect for quick study sessions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING, description: "The concept or question to be tested" },
              definition: { type: Type.STRING, description: "The answer or detailed explanation" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Subject tags" }
            },
            required: ["term", "definition", "tags"],
            propertyOrdering: ["term", "definition", "tags"],
          }
        },
        thinkingConfig: { thinkingBudget: 8192 }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    return [];
  }
};

export const optimizePlanner = async (currentTasks: any[], currentAlarms: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Current Weekly Tasks: ${JSON.stringify(currentTasks)}\nCurrent Alarms: ${JSON.stringify(currentAlarms)}`,
      config: {
        systemInstruction: "You are a world-class academic performance coach. Analyze the user's weekly schedule and provide an optimized plan. Focus on: 1. Deep work blocks (90-120 mins). 2. Regular breaks (Pomodoro style). 3. Spaced repetition review sessions. 4. Strategic time for difficult subjects. Return a full set of tasks for the week that replaces the old one. Keep titles motivating and clear.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              day: { type: Type.INTEGER, description: "0-6 (Sun-Sat)" },
              time: { type: Type.STRING, description: "HH:mm format" },
              category: { type: Type.STRING, enum: ["study", "break", "review"] }
            },
            required: ["title", "day", "time", "category"]
          }
        },
        thinkingConfig: { thinkingBudget: 16384 }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Optimization Error:", error);
    throw error;
  }
};
