require('dotenv').config();

const callDoctorAI = async (userMessage) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!API_KEY) {
        console.error("CRITICAL: OPENROUTER_API_KEY is missing.");
        return "Doctor AI is currently misconfigured (Missing API Key on Server).";
    }

    try {
        // Try a very stable free model
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://doctalk-compilecrew.vercel.app", 
                "X-Title": "DocTalk"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional doctor AI assistant. Give helpful, safe, and simple medical advice. Always include a disclaimer that you are an AI and not a substitute for professional medical help."
                    },
                    {
                        "role": "user",
                        "content": userMessage
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("OpenRouter Error Response:", data);
            if (response.status === 429) return "Doctor AI is receiving too many requests. Please wait a minute.";
            if (response.status === 401) return "Doctor AI Authentication failed (Invalid API Key).";
            return `AI Service Error (HTTP ${response.status}). Please try again later.`;
        }

        if (data.error) {
            console.error("OpenRouter Logic Error:", data.error);
            return "The AI engine reported an error. Please try again in a moment.";
        }

        return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Fetch/Network Error:", error.message);
        return "Network error connecting to AI. Please check server logs.";
    }
};

module.exports = { callDoctorAI };
