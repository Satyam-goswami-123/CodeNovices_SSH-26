
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const apiKey = 'AIzaSyBkBSPbngiATaJG_k61Z5eHxSw1EaCLDOw';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available Models (v1beta):", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
