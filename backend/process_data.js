const fs = require('fs');
const path = require('path');

try {
    const rawData = JSON.parse(fs.readFileSync('backend/raw_diseases.json', 'utf8'));
    
    // Process a larger set and improve mapping
    // We filter out duplicates and ensure valid names
    const seenNames = new Set();
    const processed = [];

    for (let item of rawData) {
        const name = item.disease || item.title || item.name;
        if (!name || seenNames.has(name.toLowerCase())) continue;
        seenNames.add(name.toLowerCase());

        const n = name.toLowerCase();
        let icon = "🩺";
        let specialist = "General Physician";

        // Mapping Logic
        if (n.includes("heart") || n.includes("aortic") || n.includes("cardio")) {
            icon = "❤️"; specialist = "Cardiologist";
        } else if (n.includes("skin") || n.includes("derm") || n.includes("acne") || n.includes("rash")) {
            icon = "🧴"; specialist = "Dermatologist";
        } else if (n.includes("cancer") || n.includes("tumor") || n.includes("carcinoma")) {
            icon = "🎗️"; specialist = "Oncologist";
        } else if (n.includes("brain") || n.includes("neuro") || n.includes("head") || n.includes("migraine")) {
            icon = "🧠"; specialist = "Neurologist";
        } else if (n.includes("bone") || n.includes("ortho") || n.includes("joint") || n.includes("arthritis")) {
            icon = "🦴"; specialist = "Orthopedic";
        } else if (n.includes("eye") || n.includes("vision") || n.includes("opthalm")) {
            icon = "👁️"; specialist = "Ophthalmologist";
        } else if (n.includes("stomach") || n.includes("gast") || n.includes("abdominal") || n.includes("digest")) {
            icon = "🥣"; specialist = "Gastroenterologist";
        } else if (n.includes("liver") || n.includes("hepat")) {
            icon = "🧪"; specialist = "Hepatologist";
        } else if (n.includes("lung") || n.includes("pulmon") || n.includes("breath") || n.includes("asthma")) {
            icon = "🫁"; specialist = "Pulmonologist";
        } else if (n.includes("kidney") || n.includes("renal") || n.includes("nephro")) {
            icon = "💧"; specialist = "Nephrologist";
        } else if (n.includes("diabetes") || n.includes("sugar") || n.includes("thyroid")) {
            icon = "🩸"; specialist = "Endocrinologist";
        }

        processed.push({
            id: String(processed.length + 1),
            name: name,
            description: `Comprehensive medical information and AI guide for ${name}. Includes specialist recommendations and precautions.`,
            icon: icon,
            category: specialist.split(" ")[0],
            symptoms: ["Use the AI Checker for detailed analysis."],
            causes: "Environmental and genetic factors.",
            treatment: "Medical intervention and lifestyle adjustment.",
            diet: "Nutritious balanced diet.",
            exercises: "Regular light physical activity.",
            precautions: "Early detection and regular checkups.",
            specialist: specialist
        });

        if (processed.length >= 500) break; // Limit to top 500 for performance
    }

    fs.writeFileSync('public/Data/diseases.json', JSON.stringify(processed, null, 4));
    console.log(`Successfully processed ${processed.length} unique diseases.`);
} catch (err) {
    console.error("Processing error:", err.message);
}
