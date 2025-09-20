import { clsx, type ClassValue } from "clsx"
import humanizeDuration from "humanize-duration"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        units: ["h", "m", "s"],
        round: true,
    })
}


/**
 * Ce fichier contient des fonctions utilitaires pures et des constantes
 * utilisées à travers l'application.
 */

// Mapping des cultures et maladies - Cohérent avec l'implémentation Python
export const CROP_DISEASE_MAPPING: Record<string, [string, string]> = {
    // Maladies du maïs
    "corn___common_rust": ["Maïs", "Rouille Commune"],
    "corn___gray_leaf_spot": ["Maïs", "Tache Grise des Feuilles"],
    "corn___healthy": ["Maïs", "Sain"],
    
    // Catégorie invalide
    "invalid": ["-", "Invalide"],
    "Invalid": ["-", "Invalide"],
    
    // Maladies de la pomme de terre
    "potato___early_blight": ["Pomme de terre", "Mildiou Précoce"],
    "potato___healthy": ["Pomme de terre", "Saine"],
    "potato___late_blight": ["Pomme de terre", "Mildiou Tardif"],
    
    // Maladies du riz
    "rice___brown_spot": ["Riz", "Tache Brune"],
    "rice___healthy": ["Riz", "Sain"],
    "rice___blast": ["Riz", "Pyriculariose"],
    
    // Maladies du blé
    "wheat___brown_rust": ["Blé", "Rouille Brune"],
    "wheat___healthy": ["Blé", "Sain"],
    "wheat___yellow_rust": ["Blé", "Rouille Jaune"],
};

/**
 * Analyse l'étiquette brute du modèle pour extraire la culture et la maladie.
 * Cette fonction implémente la même logique que le code Python pour assurer la cohérence.
 * @param rawLabel L'étiquette brute retournée par le modèle.
 * @returns Un tuple [culture, maladie].
 */
export function parseLabel(rawLabel: string): [string, string] {
    const label = rawLabel.toLowerCase().trim();
    
    // Vérifier si nous avons un mapping direct
    if (CROP_DISEASE_MAPPING[label]) {
        return CROP_DISEASE_MAPPING[label];
    }
    
    // Essayer de parser les patterns communs
    if (label.includes("___")) {
        const parts = label.split("___");
        if (parts.length >= 2) {
            let cropPart = parts[0].replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            const diseasePart = parts[1].replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            
            // Nettoyer les noms de cultures
            cropPart = cropPart.replace(/[()]/g, "");
            if (cropPart.includes("Corn Maize")) {
                cropPart = "Maïs";
            } else if (cropPart.includes("Pepper Bell")) {
                cropPart = "Poivron";
            } else if (cropPart.includes("Cherry Including Sour")) {
                cropPart = "Cerise";
            } else if (cropPart === "Corn") {
                cropPart = "Maïs";
            } else if (cropPart === "Potato") {
                cropPart = "Pomme de terre";
            } else if (cropPart === "Rice") {
                cropPart = "Riz";
            } else if (cropPart === "Wheat") {
                cropPart = "Blé";
            }
            
            return [cropPart, diseasePart];
        }
    }
    
    // Parsing de fallback
    const labelParts = label.replace(/-/g, " ").replace(/_/g, " ").split(" ");
    
    const cropKeywords: Record<string, string> = {
        'corn': 'Maïs',
        'potato': 'Pomme de terre',
        'rice': 'Riz',
        'wheat': 'Blé',
        'invalid': '-',
    };
    
    const diseaseKeywords: Record<string, string> = {
        'common_rust': 'Rouille Commune',
        'gray_leaf_spot': 'Tache Grise des Feuilles',
        'healthy': 'Sain',
        'leaf_blight': 'Brûlure des Feuilles',
        'northern_leaf_blight': 'Brûlure des Feuilles',
        'invalid': 'Invalide',
        'unknown': 'Invalide',
        'early_blight': 'Mildiou Précoce',
        'late_blight': 'Mildiou Tardif',
        'brown_spot': 'Tache Brune',
        'blast': 'Pyriculariose',
        'brown_rust': 'Rouille Brune',
        'yellow_rust': 'Rouille Jaune'
    };
    
    let detectedCrop = "Culture Inconnue";
    let detectedDisease = "Condition Inconnue";
    
    // Rechercher les mots-clés de culture
    for (const word of labelParts) {
        for (const [keyword, cropName] of Object.entries(cropKeywords)) {
            if (word.includes(keyword)) {
                detectedCrop = cropName;
                break;
            }
        }
    }
    
    // Rechercher les mots-clés de maladie
    for (const word of labelParts) {
        for (const [keyword, diseaseName] of Object.entries(diseaseKeywords)) {
            if (word.includes(keyword)) {
                detectedDisease = diseaseName;
                break;
            }
        }
    }
    
    // Patterns spéciaux
    if (label.includes('early') && label.includes('blight')) {
        detectedDisease = "Mildiou Précoce";
    } else if (label.includes('late') && label.includes('blight')) {
        detectedDisease = "Mildiou Tardif";
    } else if (label.includes('leaf') && label.includes('spot')) {
        detectedDisease = "Tache des Feuilles";
    } else if (label.includes('mosaic')) {
        detectedDisease = "Virus de la Mosaïque";
    } else if (label.includes('blast')) {
        detectedDisease = "Pyriculariose";
    } else if (label.includes('leaf') && label.includes('blight')) {
        detectedDisease = "Brûlure des Feuilles";
    } else if (label.includes('brown') && label.includes('rust')) {
        detectedDisease = "Rouille Brune";
    } else if (label.includes('yellow') && label.includes('rust')) {
        detectedDisease = "Rouille Jaune";
    } else if (label.includes('northern') && (label.includes('leaf') && label.includes('blight'))) {
        detectedDisease = "Brûlure des Feuilles";
    } else if (label.includes('brown') && label.includes('spot')) {
        detectedDisease = "Tache Brune";
    }
    
    return [detectedCrop, detectedDisease];
}

/**
 * Fournit une brève description de la maladie détectée.
 * @param crop Le nom de la culture.
 * @param disease Le nom de la maladie.
 * @returns Une chaîne de caractères formatée avec des informations.
 */
export function getDetailedDiseaseInfo(crop: string, disease: string): string {
    if (disease === "Sain") {
        return `✅ **${crop} Sain** - Votre plante semble en bonne santé ! Continuez les bonnes pratiques de culture.`;
    }
    const lowerDisease = disease.toLowerCase();
    if (lowerDisease.includes("mildiou")) {
        return `🍂 **${disease}** détecté sur **${crop}** - Le mildiou est une maladie redoutable des plantes, provoquée par des micro-organismes proches des champignons, appelés oomycètes. Il attaque principalement les feuilles, les tiges et parfois les fruits ou tubercules. Les premiers signes apparaissent sous forme de taches brunes ou verdâtres sur le feuillage, souvent entourées d’un halo jaune. Par temps humide, un duvet blanc ou gris se forme au revers des feuilles, correspondant aux spores du parasite.`;
    }
    if (lowerDisease.includes("tache")) {
        return `⚫ **${disease}** trouvé sur **${crop}** - La tache grise des feuilles est l’une des maladies foliaires les plus graves. Elle commence par de petites taches humides qui s’allongent en lésions rectangulaires grises ou brun clair, souvent bien délimitées par les nervures des feuilles. Lorsque les taches se rejoignent, elles détruisent de grandes parties de la feuille, ce qui réduit fortement la photosynthèse. Elle se développe surtout par temps chaud et humide et peut causer des pertes de rendement très importantes si rien n’est fait.`;
    }
    if (lowerDisease.includes("rouille")) {
        return `🦠 **${disease}** affectant **${crop}** - La rouille est une maladie des plantes causée par des champignons parasites du genre Puccinia, Uromyces ou apparentés. Elle tire son nom de la couleur brun-rouge caractéristique des pustules qui apparaissent sur les feuilles et les tiges, rappelant la rouille du fer.`;
    }
    if (lowerDisease.includes("blast")) {
        return `🦠 **${disease}** affectant **${crop}** - La pyriculariose est une maladie fongique grave, causée par le champignon Magnaporthe oryzae (anciennement Pyricularia oryzae). C’est l’une des maladies les plus destructrices du riz, mais elle peut aussi affecter d’autres graminées (blé, millet, orge, etc.).`;
    }
    return `🔍 **${disease}** détecté sur **${crop}** - Cette condition nécessite une attention et une gestion appropriées.`;
}
