import { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface UsePDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  useCORS?: boolean;
}

interface UsePDFExportReturn {
  isExporting: boolean;
  exportToPDF: (elementId: string, options?: UsePDFExportOptions) => Promise<void>;
  error: string | null;
}

/**
 * Hook personnalisé pour l'exportation PDF
 * Utilise html2canvas pour capturer le contenu et jsPDF pour générer le PDF
 */
export function usePDFExport(): UsePDFExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = useCallback(async (
    elementId: string, 
    options: UsePDFExportOptions = {}
  ) => {
    const {
      filename = 'analyse-plante.pdf',
      quality = 1.0,
      scale = 2,
      useCORS = true
    } = options;

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

      // Capture de l'élément avec html2canvas
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: useCORS,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Optimisations supplémentaires sur le clone
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.animation = 'none';
          }
        }
      });

      // Restauration des styles originaux
      element.style.cssText = originalStyle;
      childElements.forEach((child, index) => {
        const htmlChild = child as HTMLElement;
        htmlChild.style.cssText = originalChildStyles[index];
      });

      // Calcul des dimensions pour le PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Création du PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Ajout de métadonnées
      pdf.setProperties({
        title: 'Analyse de Maladie des Plantes - Terralys AI',
        subject: 'Rapport d\'analyse phytosanitaire',
        author: 'Terralys AI',
        creator: 'Terralys Platform'
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Ajout de l'image au PDF (avec gestion multi-pages si nécessaire)
      const imgData = canvas.toDataURL('image/jpeg', quality);
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Gestion des pages supplémentaires si le contenu dépasse une page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Ajout d'un pied de page avec timestamp
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Généré par Terralys - ${new Date().toLocaleDateString('fr-FR')} - Page ${i}/${pageCount}`,
          10,
          287
        );
      }

      // Téléchargement du PDF
      pdf.save(filename);

    } catch (err) {
      console.error('Erreur lors de l\'exportation PDF:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue lors de l\'exportation');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportToPDF,
    error
  };
}