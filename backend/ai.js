require('dotenv').config();

const callDoctorAI = async (userMessage) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!API_KEY) {
        console.error("CRITICAL: OPENROUTER_API_KEY is missing from environment variables.");
        return "Doctor AI is currently misconfigured (Missing API Key).";
    }

    try {
        console.log("Calling OpenRouter API...");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173", // Required by some OpenRouter models
                "X-Title": "DocTalk"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional doctor AI assistant. Give helpful, safe, and simple medical advice. Do not provide dangerous or illegal suggestions. Keep responses short and clear. Always include a disclaimer that you are an AI."
                    },
                    {
                        "role": "user",
                        "content": userMessage
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok || data.error) {
            console.error("OpenRouter API Error:", data.error || `HTTP ${response.status}`);
            return "Doctor AI is currently busy. Please try again in a moment.";
        }

        return data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error("OpenRouter Connection Error:", error.message);
        return "I'm having trouble connecting to the AI engine. Please try again later.";
    }
};

module.exports = { callDoctorAI };
