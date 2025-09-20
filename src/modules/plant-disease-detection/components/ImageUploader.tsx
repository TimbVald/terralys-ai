/**
 * Composant de téléchargement d'images pour l'analyse des maladies des plantes
 * Supporte le glisser-déposer, la sélection de fichiers et la capture photo
 */

import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, CameraCaptureIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  onImageSelect?: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onImageSelect,
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  /**
   * Gère la validation et le traitement d'un fichier image
   */
  const handleFile = useCallback((file: File | null | undefined) => {
    if (file && file.type.startsWith('image/')) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Veuillez choisir une image de moins de 10MB.');
        return;
      }
      
      // Créer une URL de prévisualisation
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
    } else if (file) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
    }
  }, []);

  /**
   * Confirme la sélection de l'image et lance l'analyse
   */
  const handleConfirmImage = useCallback(() => {
    if (selectedFile) {
      const callback = onImageSelect || onImageUpload;
      if (callback) {
        callback(selectedFile);
      }
    }
  }, [selectedFile, onImageSelect, onImageUpload]);

  /**
   * Annule la sélection et revient à l'état initial
   */
  const handleCancelImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  /**
   * Gestionnaires d'événements pour le glisser-déposer
   */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  };

  /**
   * Gestionnaire de changement pour les inputs de fichier
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
    e.target.value = ''; // Reset pour permettre de re-télécharger le même fichier
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-all duration-500 transform hover:scale-[1.02]
        ${isDragging 
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg scale-105' 
          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md'
        }
        ${isLoading || disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm shadow-sm
        ${className}
      `}
    >
      {/* Input caché pour la sélection de fichiers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading || disabled}
        aria-label="Sélectionner une image"
      />
      
      {/* Input caché pour la capture photo */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={isLoading || disabled}
        aria-label="Prendre une photo"
      />
      
      {/* Contenu principal */}
      {previewUrl ? (
        // Mode prévisualisation
        <div className="flex flex-col items-center gap-6 text-center w-full">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Prévisualisation de l'image sélectionnée"
              className="max-w-full max-h-80 rounded-xl shadow-lg object-contain"
            />
            <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ✓ Sélectionnée
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Image sélectionnée
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Confirmez pour lancer l'analyse ou changez d'image
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Fichier : {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          </div>
        </div>
      ) : (
        // Mode sélection
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 p-4 rounded-full">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-emerald-600 dark:text-emerald-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ajouter une image
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Glissez une image ici ou utilisez une option ci-dessous
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Formats supportés : JPG, PNG, WEBP (max 10MB)</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {previewUrl ? (
          // Boutons en mode prévisualisation
          <>
            <button
              onClick={handleConfirmImage}
              disabled={isLoading}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold 
                       py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-3 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Confirmer et analyser"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white group-hover:scale-110 transition-transform">
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Confirmer et analyser
            </button>
            
            <button
              onClick={handleCancelImage}
              disabled={isLoading}
              className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 
                       text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl 
                       transition-all duration-300 flex items-center gap-3 disabled:opacity-50 
                       disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Changer d'image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Changer d'image
            </button>
          </>
        ) : (
          // Boutons en mode sélection
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 
                       text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl 
                       transition-all duration-300 flex items-center gap-3 disabled:opacity-50 
                       disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Parcourir les fichiers"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Parcourir les fichiers
            </button>
            
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold 
                       py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-3 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Prendre une photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white group-hover:scale-110 transition-transform">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Prendre une photo
            </button>
          </>
        )}
      </div>
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-emerald-600">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <span className="font-semibold text-lg text-gray-800 dark:text-white">Traitement en cours...</span>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Analyse de votre image</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;