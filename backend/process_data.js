const fs = require('fs');
const path = require('path');

try {
    const rawData = JSON.parse(fs.readFileSync('backend/raw_diseases.json', 'utf8'));
    
    // The raw data is an array of strings or simple objects depending on the source.
    // Let's assume it's an array of { title, description } or similar.
    // We will take the first 100 and map them to our format.
    
    const processed = rawData.slice(0, 100).map((item, index) => {
        const name = typeof item === 'string' ? item : (item.title || item.name || "Unknown Condition");
        const description = item.description || `Medical information and guide for ${name}.`;
        
        // Dynamic icon assignment based on keywords
        let icon = "🩺";
        if (name.toLowerCase().includes("heart")) icon = "❤️";
        else if (name.toLowerCase().includes("skin")) icon = "🧴";
        else if (name.toLowerCase().includes("brain") || name.toLowerCase().includes("head")) icon = "🧠";
        else if (name.toLowerCase().includes("fever") || name.toLowerCase().includes("flu")) icon = "🤒";
        else if (name.toLowerCase().includes("bone") || name.toLowerCase().includes("joint")) icon = "🦴";
        else if (name.toLowerCase().includes("eye")) icon = "👁️";
        else if (name.toLowerCase().includes("stomach") || name.toLowerCase().includes("digest")) icon = "🥣";

        // Dynamic specialist assignment
        let specialist = "General Physician";
        if (name.toLowerCase().includes("heart") || name.toLowerCase().includes("blood")) specialist = "Cardiologist";
        else if (name.toLowerCase().includes("skin") || name.toLowerCase().includes("derm")) specialist = "Dermatologist";
        else if (name.toLowerCase().includes("brain") || name.toLowerCase().includes("neuro")) specialist = "Neurologist";
        else if (name.toLowerCase().includes("eye")) specialist = "Ophthalmologist";
        else if (name.toLowerCase().includes("digest") || name.toLowerCase().includes("stomach")) specialist = "Gastroenterologist";
        else if (name.toLowerCase().includes("sugar") || name.toLowerCase().includes("diabet")) specialist = "Endocrinologist";

        return {
            id: String(index + 1),
            name: name,
            description: description,
            icon: icon,
            category: specialist.replace(" Specialist", "").split(" ")[0], // Simplistic categorization
            symptoms: ["Check with CompileXBot for a detailed symptom analysis."],
            causes: "Varies by patient history and environment.",
            treatment: "Consult a specialist for a personalized treatment plan.",
            diet: "Maintain a balanced diet suitable for your condition.",
            exercises: "Light physical activity as recommended by your doctor.",
            precautions: "Regular monitoring and professional consultation.",
            specialist: specialist
        };
    });

    fs.writeFileSync('public/Data/diseases.json', JSON.stringify(processed, null, 4));
    console.log("Successfully processed 100 diseases.");
} catch (err) {
    console.error("Processing error:", err.message);
}
