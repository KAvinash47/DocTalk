const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

/**
 * PulseTalk AI - Final Stabilized Version
 */
const callDoctorAI = async (userMessage) => {
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (NVIDIA_API_KEY) {
        // Prioritize the model that was verified to work locally first, 
        // then try the larger ones to avoid "Unavailable" messages.
        const modelsToTry = [
            "meta/llama-3.1-8b-instruct", // High reliability
            "google/gemma-4-31b-it",      // User's specific request
            "meta/llama-3.1-405b-instruct"
        ];

        for (const model of modelsToTry) {
            try {
                console.log(`PulseTalk: Attempting ${model}...`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s per attempt

                const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${NVIDIA_API_KEY.trim()}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            { "role": "system", "content": "You are a professional doctor AI assistant. Be concise and accurate." },
                            { "role": "user", "content": userMessage }
                        ],
                        "max_tokens": 1024,
                        "temperature": 0.7
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();
                
                if (response.ok && data.choices?.[0]?.message?.content) {
                    console.log(`PulseTalk: Success with ${model}`);
                    return data.choices[0].message.content;
                }
                console.warn(`PulseTalk: ${model} failed with status ${response.status}`);
            } catch (e) {
                console.error(`PulseTalk: ${model} error: ${e.message}`);
            }
        }
    }

    // Secondary Fallback: OpenRouter
    if (OPENROUTER_API_KEY) {
        try {
            console.log("PulseTalk: Falling back to OpenRouter...");
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                    "messages": [{ "role": "user", "content": userMessage }]
                })
            });

            const data = await response.json();
            if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
        } catch (e) {
            console.error("PulseTalk: OpenRouter fallback failed:", e.message);
        }
    }

    return "AI Service temporarily overloaded. Please try again in a few seconds.";
};

module.exports = { callDoctorAI };
