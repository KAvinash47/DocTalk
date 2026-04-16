const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

/**
 * PulseTalk AI - Powered by NVIDIA & OpenRouter
 */
const callDoctorAI = async (userMessage) => {
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (NVIDIA_API_KEY) {
        const modelsToTry = [
            "google/gemma-4-31b-it", 
            "meta/llama-3.1-405b-instruct",
            "meta/llama-3.1-70b-instruct",
            "meta/llama-3.1-8b-instruct"
        ];

        for (const model of modelsToTry) {
            try {
                console.log(`Calling NVIDIA API with model: ${model}...`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for large models

                const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${NVIDIA_API_KEY.trim()}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            { 
                                "role": "system", 
                                "content": "You are a professional doctor AI assistant. Provide structured medical advice. Use **bold text** for emphasis. Always include a disclaimer that you are an AI." 
                            },
                            { "role": "user", "content": userMessage }
                        ],
                        "max_tokens": 1024,
                        "temperature": 0.7,
                        "chat_template_kwargs": { "enable_thinking": true }
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();
                
                if (response.ok && data.choices?.[0]?.message?.content) {
                    console.log(`NVIDIA API Success with ${model}!`);
                    let content = data.choices[0].message.content;
                    content = content.replace(/<thought>[\s\S]*?<\/thought>/g, '').trim();
                    return content;
                }
                console.warn(`NVIDIA model ${model} failed:`, data.error?.message || response.status);
            } catch (e) {
                console.error(`Error with NVIDIA model ${model}:`, e.message);
            }
            // Small delay before next model
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    if (OPENROUTER_API_KEY) {
        try {
            console.log("Calling OpenRouter Fallback...");
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                    "messages": [
                        { "role": "system", "content": "You are a professional doctor AI assistant. Always include a disclaimer." },
                        { "role": "user", "content": userMessage }
                    ],
                    "max_tokens": 1000
                })
            });

            const data = await response.json();
            if (response.ok && data.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }
        } catch (error) {
            console.error("OpenRouter fallback error:", error.message);
        }
    }

    return "PulseTalk AI is currently unavailable. Please check your internet connection or try again later.";
};

module.exports = { callDoctorAI };
