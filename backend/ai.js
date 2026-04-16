require('dotenv').config();

/**
 * PulseTalk AI - Powered by NVIDIA (Gemma 4 31B) & OpenRouter
 */
const callDoctorAI = async (userMessage) => {
    const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    // 1. Try NVIDIA Gemma-4-31B first (Primary)
    if (NVIDIA_API_KEY) {
        try {
            console.log("Calling NVIDIA API with model: google/gemma-4-31b-it...");
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for thinking model

            const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemma-4-31b-it",
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
                    "max_tokens": 4096, // Reduced from 16k for faster response in web app
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "stream": false,
                    "chat_template_kwargs": { "enable_thinking": true }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();
            
            if (response.ok && data.choices?.[0]?.message?.content) {
                let content = data.choices[0].message.content;
                // Optional: Remove thinking tags if they appear in the final output
                content = content.replace(/<thought>[\s\S]*?<\/thought>/g, '').trim();
                return content;
            }
            console.warn("NVIDIA API failed, falling back to OpenRouter:", data.error || `HTTP ${response.status}`);
        } catch (error) {
            console.error("NVIDIA API error:", error.message);
        }
    }

    // 2. Fallback to OpenRouter (Secondary)
    if (OPENROUTER_API_KEY) {
        const models = [
            "google/gemini-2.0-flash-lite-preview-02-05:free",
            "mistralai/mistral-7b-instruct-v0.1:free"
        ];

        for (const model of models) {
            try {
                console.log(`Calling OpenRouter Fallback with model: ${model}...`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://doctalk-compilecrew.vercel.app", 
                        "X-Title": "DocTalk"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional doctor AI assistant. Provide structured, easy-to-read medical advice. Use **bold text** for emphasis, bullet points for lists, and clear headings. Always include a disclaimer that you are an AI."
                            },
                            {
                                "role": "user",
                                "content": userMessage
                            }
                        ],
                        "max_tokens": 1000
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const data = await response.json();
                
                if (response.ok && data.choices?.[0]?.message?.content) {
                    return data.choices[0].message.content;
                }
            } catch (error) {
                console.error(`OpenRouter fallback error for ${model}:`, error.message);
            }
        }
    }

    return "PulseTalk AI is currently unavailable. Please check your internet connection or try again later.";
};

module.exports = { callDoctorAI };
