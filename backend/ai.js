require('dotenv').config();

const callDoctorAI = async (userMessage) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!API_KEY) {
        console.error("CRITICAL: OPENROUTER_API_KEY is missing.");
        return "Doctor AI is currently misconfigured (Missing API Key on Server).";
    }

    // List of models to try in order of preference
    const models = [
        "google/gemini-2.0-flash-lite-preview-02-05:free",
        "mistralai/mistral-7b-instruct-v0.1:free",
        "openrouter/auto" // Last resort auto-routing
    ];

    let lastError = null;

    for (const model of models) {
        try {
            console.log(`Calling OpenRouter API with model: ${model}...`);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://doctalk-compilecrew.vercel.app", 
                    "X-Title": "DocTalk"
                },
                body: JSON.stringify({
                    "model": model,
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
            
            if (response.ok && !data.error) {
                return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
            }

            console.warn(`Model ${model} failed:`, data.error || `HTTP ${response.status}`);
            lastError = data.error || { message: `HTTP ${response.status}` };
            
            // If it's a 404, we definitely want to try the next model
            // If it's a 429 (Rate Limit), we might as well stop or try another
            if (response.status !== 404 && response.status !== 429) {
                // For other errors, we still try the next model in our list
                continue;
            }
        } catch (error) {
            console.error(`Fetch error for model ${model}:`, error.message);
            lastError = error;
        }
    }

    // If we get here, all models failed
    if (lastError?.code === 429 || lastError?.message?.includes('429')) {
        return "Doctor AI is receiving too many requests right now. Please try again in a minute.";
    }
    if (lastError?.code === 401 || lastError?.message?.includes('401')) {
        return "Doctor AI Authentication failed. Please check the server configuration.";
    }
    
    return `AI Service currently unavailable (Last Error: ${lastError?.message || 'Unknown'}). Please try again later.`;
};

module.exports = { callDoctorAI };
