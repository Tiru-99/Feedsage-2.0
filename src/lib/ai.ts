import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ; 

if(!GEMINI_API_KEY){
  throw new Error("Gemini api key not found"); 
}

const genAI = new GoogleGenerativeAI(
  GEMINI_API_KEY
);

export const model = genAI.getGenerativeModel({
     model: "gemini-2.5-flash-lite",
});