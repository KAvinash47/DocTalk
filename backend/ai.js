require('dotenv').config();

const callDoctorAI = async (userMessage) => {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat:free",
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
        
        if (data.error) {
            console.error("OpenRouter API Error Details:", data.error);
            return "Doctor AI is currently unavailable. Please try again.";
        }

        return data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error("OpenRouter Connection Error:", error);
        return "Doctor AI is currently unavailable. Please try again.";
    }
};

module.exports = { callDoctorAI };
