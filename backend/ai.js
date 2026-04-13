require('dotenv').config();

const callDoctorAI = async (userMessage) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!API_KEY) {
        console.error("CRITICAL: OPENROUTER_API_KEY is missing.");
        return "Doctor AI is currently misconfigured (Missing API Key on Server).";
    }

    // List of models to try in order of preference (Fastest first)
    const models = [
        "google/gemini-2.0-flash-lite-preview-02-05:free", // Extremely fast
        "mistralai/mistral-7b-instruct-v0.1:free",
        "openrouter/auto" 
    ];

    let lastError = null;

    for (const model of models) {
        try {
            console.log(`Calling OpenRouter API with model: ${model}...`);
            
            // Abort controller to prevent long hangs (15s timeout)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

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
                            "content": "You are a professional doctor AI assistant. Provide structured, easy-to-read medical advice. Use **bold text** for emphasis, bullet points for lists, and clear headings. Always include a disclaimer that you are an AI. Keep responses concise and fast."
                        },
                        {
                            "role": "user",
                            "content": userMessage
                        }
                    ],
                    "max_tokens": 500 // Limit response length for speed
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();
            
            if (response.ok && !data.error) {
                return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
            }

            console.warn(`Model ${model} failed or timed out:`, data.error || `HTTP ${response.status}`);
            lastError = data.error || { message: `HTTP ${response.status}` };
            
        } catch (error) {
            console.error(`Fetch error for model ${model}:`, error.message);
            lastError = error;
        }
    }

    if (lastError?.name === 'AbortError') return "The AI is taking too long to respond. Please try a shorter question.";
    return `AI Service currently unavailable. Please try again in a moment.`;
};

module.exports = { callDoctorAI };
