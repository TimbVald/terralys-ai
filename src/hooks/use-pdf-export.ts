import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  scale?: number;
  useCORS?: boolean;
}

interface UsePDFExportReturn {
  isExporting: boolean;
  exportToPDF: (elementId: string, filename?: string, options?: ExportOptions) => Promise<void>;
  error: string | null;
}

/**
 * Hook personnalisé pour l'exportation PDF
 * Utilise html2canvas pour capturer le contenu et jsPDF pour générer le PDF
 */
export function usePDFExport(): UsePDFExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fonction utilitaire pour convertir les couleurs OKLCH en RGB
   * @param oklchString - Chaîne de couleur OKLCH
   * @returns Couleur RGB équivalente
   */
  const convertOklchToRgb = useCallback((oklchString: string): string => {
    // Mapping des couleurs OKLCH communes vers RGB
    const oklchToRgbMap: { [key: string]: string } = {
      'oklch(1 0 0)': '#ffffff',
      'oklch(0.145 0 0)': '#1f2937',
      'oklch(0.985 0 0)': '#ffffff',
      'oklch(0.205 0 0)': '#374151',
      'oklch(0.63 0.1699 149.21)': '#10b981',
      'oklch(0.97 0 0)': '#f3f4f6',
      'oklch(0.556 0 0)': '#6b7280',
      'oklch(0.922 0 0)': '#e5e7eb',
      'oklch(0.708 0 0)': '#9ca3af',
      'oklch(0.577 0.245 27.325)': '#ef4444',
      'oklch(0.269 0 0)': '#4b5563',
      'oklch(1 0 0 / 10%)': 'rgba(255, 255, 255, 0.1)',
      'oklch(1 0 0 / 15%)': 'rgba(255, 255, 255, 0.15)',
    };
    
    return oklchToRgbMap[oklchString] || '#ffffff';
  }, []);

  /**
   * Fonction pour nettoyer les couleurs OKLCH dans un élément
   * @param element - Élément DOM à nettoyer
   */
  const cleanOklchColors = useCallback((element: HTMLElement) => {
    // Nettoyage des styles inline
    if (element.style.color && element.style.color.includes('oklch')) {
      element.style.color = convertOklchToRgb(element.style.color);
    }
    if (element.style.backgroundColor && element.style.backgroundColor.includes('oklch')) {
      element.style.backgroundColor = convertOklchToRgb(element.style.backgroundColor);
    }
    if (element.style.borderColor && element.style.borderColor.includes('oklch')) {
      element.style.borderColor = convertOklchToRgb(element.style.borderColor);
    }
    
    // Nettoyage des variables CSS calculées
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.color && computedStyle.color.includes('oklch')) {
      element.style.color = convertOklchToRgb(computedStyle.color);
    }
    if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
      element.style.backgroundColor = convertOklchToRgb(computedStyle.backgroundColor);
    }
  }, [convertOklchToRgb]);

  /**
   * Fonction principale d'exportation PDF
   * @param elementId - ID de l'élément à exporter
   * @param filename - Nom du fichier PDF (optionnel)
   * @param options - Options de configuration (optionnel)
   */
  const exportToPDF = useCallback(async (
    elementId: string,
    filename: string = 'export.pdf',
    options: ExportOptions = {}
  ) => {
    const { scale = 2, useCORS = true } = options;
    
    setIsExporting(true);
    setError(null);

    try {
      // Récupération de l'élément à exporter
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Élément avec l'ID "${elementId}" non trouvé`);
      }

      // Préparation de l'élément pour l'impression
      const originalStyle = element.style.cssText;
      const originalClassName = element.className;
      
      // Application de la classe pdf-ready pour les couleurs compatibles
      element.classList.add('pdf-ready');
      
      // Nettoyage des couleurs OKLCH
      cleanOklchColors(element);
      
      // Application de styles optimisés pour l'impression
      element.style.cssText = `
        ${originalStyle}
        background: white !important;
        color: black !important;
        font-family: 'Arial', sans-serif !important;
        line-height: 1.4 !important;
        padding: 20px !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: none !important;
        width: 210mm !important;
      `;

      // Optimisation des éléments enfants pour l'impression
      const childElements = element.querySelectorAll('*');
      const originalChildStyles: string[] = [];
      
      childElements.forEach((child, index) => {
        const htmlChild = child as HTMLElement;
        originalChildStyles[index] = htmlChild.style.cssText;
        
        // Nettoyage des couleurs OKLCH pour chaque enfant
        cleanOklchColors(htmlChild);
        
        // Optimisation des couleurs et contrastes
        if (htmlChild.style.backgroundColor && 
            (htmlChild.style.backgroundColor.includes('50') || 
             htmlChild.style.backgroundColor.includes('100'))) {
          htmlChild.style.backgroundColor = 'white';
          htmlChild.style.border = '1px solid #e5e7eb';
        }
        
        // Optimisation des textes
        if (htmlChild.style.color && htmlChild.style.color.includes('gray')) {
          htmlChild.style.color = '#374151';
        }
        
        // Suppression des ombres et effets
        htmlChild.style.boxShadow = 'none';
        htmlChild.style.textShadow = 'none';
        htmlChild.style.filter = 'none';
      });

      // Optimisation des couleurs pour html2canvas
      const optimizeColors = (el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        
        // Conversion des couleurs problématiques
        if (style.color.includes('oklch') || style.color.includes('hsl')) {
          el.style.color = '#000000';
        }
        
        if (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('hsl')) {
          el.style.backgroundColor = '#ffffff';
        }
        
        // Suppression des ombres et effets visuels
        el.style.boxShadow = 'none';
        el.style.textShadow = 'none';
        el.style.filter = 'none';
        el.style.backdropFilter = 'none';
      };

      // Application des optimisations sur l'élément et ses enfants
      optimizeColors(element);
      element.querySelectorAll('*').forEach(child => {
        optimizeColors(child as HTMLElement);
      });

      // Configuration de html2canvas avec optimisations
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: useCORS,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (element) => {
          return element.classList.contains('no-pdf') || 
                 element.tagName === 'SCRIPT' ||
                 element.tagName === 'STYLE';
        }
      });

      // Optimisations sur le clone de l'élément
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.querySelectorAll('*').forEach(child => {
        const htmlChild = child as HTMLElement;
        if (htmlChild.style.color && htmlChild.style.color.includes('oklch')) {
          htmlChild.style.color = '#000000';
        }
        if (htmlChild.style.backgroundColor && htmlChild.style.backgroundColor.includes('oklch')) {
          htmlChild.style.backgroundColor = '#ffffff';
        }
      });

      // Restauration des styles originaux
      element.style.cssText = originalStyle;
      element.className = originalClassName;
      
      childElements.forEach((child, index) => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.cssText = originalChildStyles[index];
      });

      // Calcul des dimensions pour le PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(filename);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de l\'exportation';
      setError(errorMessage);
      console.error('Erreur lors de l\'exportation PDF:', err);
    } finally {
      setIsExporting(false);
    }
  }, [cleanOklchColors]);

  return {
    isExporting,
    exportToPDF,
    error
  };
}