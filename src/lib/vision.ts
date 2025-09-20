/**
 * Ce service gère toute l'interaction avec le modèle de classification d'images.
 * Il inclut le chargement du modèle (singleton) et la fonction de classification.
 */

import { pipeline, env, RawImage, type PipelineType } from '@xenova/transformers';
import sharp from 'sharp';

// Configuration de l'environnement transformers.js
env.allowLocalModels = true;
env.allowRemoteModels = true;
env.useBrowserCache = false; // Désactiver le cache navigateur pour éviter les conflits
env.backends.onnx.wasm.numThreads = 1; // Limiter les threads pour réduire les erreurs GLib

class ClassifierPipelineSingleton {
  static task: PipelineType = 'image-classification';
  static model = 'cabrel09/crop_leaf_disease_detector';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      console.log('Chargement du modèle de détection de maladies des plantes...');
      const options = {
        // Spécifier le format Safetensors au lieu de chercher un fichier ONNX
        quantized: false,
      };
      this.instance = await pipeline(this.task, this.model, options);
      console.log('Modèle de détection de maladies chargé avec succès !');
    }
    return this.instance;
  }
}

/**
 * Vérifie si le modèle est chargé
 * @returns true si le modèle est chargé, false sinon
 */
export function isModelLoaded(): boolean {
    return ClassifierPipelineSingleton['instance'] !== null;
}

/**
 * Prend un fichier image, le traite et retourne le résultat de la classification.
 * @param file Le fichier image téléversé.
 * @returns Le résultat le plus probable de la classification.
 */
export async function classifyImage(file: File): Promise<{ label: string, score: number }> {
    const classifier = await ClassifierPipelineSingleton.getInstance();
    
    // Convertit le fichier en buffer
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Préprocessing de l'image avec sharp (224x224 pixels)
    const { data, info } = await sharp(imageBuffer)
         .resize(224, 224)
         .removeAlpha() // Assurer 3 canaux RGB
         .raw()
         .toBuffer({ resolveWithObject: true });
         
    // Convertir en RawImage pour le modèle
    const image = new RawImage(new Uint8ClampedArray(data), info.width, info.height, info.channels);

    // Effectue la classification
    const outputs = await classifier(image);
    
    // Le modèle retourne un tableau de résultats triés par score
    // Retourner le résultat le plus probable
    if (outputs && outputs.length > 0) {
        return {
            label: outputs[0].label,
            score: outputs[0].score
        };
    }
    
    // Fallback en cas de problème
    throw new Error('Aucun résultat de classification obtenu du modèle');
}
