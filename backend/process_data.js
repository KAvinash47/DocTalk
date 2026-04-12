const fs = require('fs');
const path = require('path');

try {
    const rawData = JSON.parse(fs.readFileSync('backend/raw_diseases.json', 'utf8'));
    
    // Correct mapping for {"disease": "..."} structure
    const processed = rawData.slice(0, 200).map((item, index) => {
        const name = item.disease || "Unknown Condition";
        const description = `Comprehensive medical information and AI guide for ${name}. Learn about symptoms, causes, and recommended treatments.`;
        
        // Dynamic icon assignment based on keywords
        let icon = "🩺";
        const n = name.toLowerCase();
        if (n.includes("heart") || n.includes("aortic") || n.includes("arrhythmia")) icon = "❤️";
        else if (n.includes("skin") || n.includes("boil") || n.includes("rash") || n.includes("acne")) icon = "🧴";
        else if (n.includes("brain") || n.includes("head") || n.includes("migraine")) icon = "🧠";
        else if (n.includes("fever") || n.includes("flu") || n.includes("infection")) icon = "🤒";
        else if (n.includes("bone") || n.includes("joint") || n.includes("arthritis") || n.includes("back")) icon = "🦴";
        else if (n.includes("eye") || n.includes("vision")) icon = "👁️";
        else if (n.includes("stomach") || n.includes("abdominal") || n.includes("digest") || n.includes("pain")) icon = "🥣";
        else if (n.includes("liver") || n.includes("hepatitis")) icon = "🧪";
        else if (n.includes("vaginal") || n.includes("menstrual") || n.includes("uterus")) icon = "🚺";

        // Dynamic specialist assignment
        let specialist = "General Physician";
        if (n.includes("heart") || n.includes("blood") || n.includes("aortic") || n.includes("arrhythmia")) specialist = "Cardiologist";
        else if (n.includes("skin") || n.includes("derm") || n.includes("boil")) specialist = "Dermatologist";
        else if (n.includes("brain") || n.includes("neuro") || n.includes("migraine")) specialist = "Neurologist";
        else if (n.includes("eye") || n.includes("vision")) specialist = "Ophthalmologist";
        else if (n.includes("digest") || n.includes("stomach") || n.includes("abdominal") || n.includes("pain")) specialist = "Gastroenterologist";
        else if (n.includes("sugar") || n.includes("diabet")) specialist = "Endocrinologist";
        else if (n.includes("liver") || n.includes("hepatitis")) specialist = "Hepatologist";
        else if (n.includes("vaginal") || n.includes("menstrual") || n.includes("uterus") || n.includes("abortion")) specialist = "Gynecologist";

        return {
            id: String(index + 1),
            name: name,
            description: description,
            icon: icon,
            category: specialist.split(" ")[0],
            symptoms: ["Check with CompileXBot for a detailed symptom analysis."],
            causes: "Varies by patient history, genetics, and environment.",
            treatment: "Consult a specialist for a personalized treatment plan.",
            diet: "Maintain a balanced diet suitable for your condition.",
            exercises: "Light physical activity as recommended by your doctor.",
            precautions: "Regular monitoring and professional medical consultation.",
            specialist: specialist
        };
    });

    fs.writeFileSync('public/Data/diseases.json', JSON.stringify(processed, null, 4));
    console.log(`Successfully processed ${processed.length} diseases.`);
} catch (err) {
    console.error("Processing error:", err.message);
}
