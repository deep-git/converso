import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Safety settings configuration
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];

// Initialize Google Generative AI
let genAI;
try {
    genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
} catch (error) {
    console.error("Error initializing GoogleGenerativeAI:", error);
}

// Fetch generative model with safety settings
let model;
try {
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
} catch (error) {
    console.error("Error fetching generative model:", error);
}

export default model;