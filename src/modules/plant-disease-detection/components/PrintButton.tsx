import React, { useRef, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintButtonProps {
    children: React.ReactNode;
    documentName?: string;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    buttonText?: string;
    showIcon?: boolean;
    onBeforePrint?: () => Promise<void> | void;
    onAfterPrint?: () => Promise<void> | void;
    onError?: (error: string) => void;
    customStyles?: string;
    scale?: number;
}

/**
 * Composant PrintButton amélioré pour remplacer use-pdf-export
 * Utilise react-to-print pour une impression PDF optimisée
 */
const PrintButton: React.FC<PrintButtonProps> = ({
    children,
    documentName = 'document',
    className = '',
    variant = 'outline',
    size = 'default',
    buttonText = 'PDF',
    showIcon = true,
    onBeforePrint,
    onAfterPrint,
    onError,
    customStyles = '',
    scale = 1
}) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Styles optimisés pour l'impression PDF
     * Remplace les styles de pdf-export.css
     */
    const getOptimizedPrintStyles = useCallback(() => {
        return `
            @page {
                size: A4;
                margin: 20mm;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    font-family: 'Arial', 'Helvetica', sans-serif !important;
                    background: white !important;
                    color: #000 !important;
                    line-height: 1.4 !important;
                }
                
                /* Masquer les éléments non imprimables */
                .no-print,
                .pdf-export-button,
                button,
                .print-hidden {
                    display: none !important;
                }
                
                /* Optimisation des couleurs pour l'impression */
                .bg-gradient-to-br,
                .bg-gradient-to-r,
                .bg-gradient-to-l {
                    background: white !important;
                }
                
                /* Couleurs sûres pour l'impression */
                .text-blue-600, .text-blue-700 { color: #1e40af !important; }
                .text-green-600, .text-green-700 { color: #16a34a !important; }
                .text-red-600, .text-red-700 { color: #dc2626 !important; }
                .text-yellow-600, .text-yellow-700 { color: #ca8a04 !important; }
                .text-gray-600, .text-gray-700 { color: #374151 !important; }
                
                /* Arrière-plans pour l'impression */
                .bg-blue-100 { background: #dbeafe !important; }
                .bg-green-100 { background: #dcfce7 !important; }
                .bg-red-100 { background: #fee2e2 !important; }
                .bg-yellow-100 { background: #fef3c7 !important; }
                .bg-gray-100 { background: #f3f4f6 !important; }
                
                /* Bordures visibles */
                .border { border: 1px solid #d1d5db !important; }
                .border-gray-200 { border-color: #e5e7eb !important; }
                .border-blue-200 { border-color: #bfdbfe !important; }
                .border-green-200 { border-color: #bbf7d0 !important; }
                .border-red-200 { border-color: #fecaca !important; }
                
                /* Ombres supprimées pour l'impression */
                .shadow, .shadow-lg, .shadow-xl, .shadow-2xl {
                    box-shadow: none !important;
                }
                
                /* Optimisation des images */
                img {
                    max-width: 100% !important;
                    height: auto !important;
                    page-break-inside: avoid !important;
                }
                
                /* Gestion des sauts de page */
                .page-break-before { page-break-before: always !important; }
                .page-break-after { page-break-after: always !important; }
                .page-break-inside-avoid { page-break-inside: avoid !important; }
                
                /* Typographie optimisée */
                h1, h2, h3, h4, h5, h6 {
                    color: #000 !important;
                    page-break-after: avoid !important;
                }
                
                p, div {
                    orphans: 3 !important;
                    widows: 3 !important;
                }
                
                /* Transformation des couleurs OKLCH problématiques */
                [style*="oklch"] {
                    color: #000 !important;
                    background-color: transparent !important;
                }
            }
            
            ${customStyles}
        `;
    }, [customStyles]);

    /**
     * Gestionnaire d'impression avec gestion d'erreurs améliorée
     */
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: documentName,
        pageStyle: getOptimizedPrintStyles(),
        onBeforePrint: async () => {
            setIsExporting(true);
            setError(null);
            
            try {
                if (onBeforePrint) {
                    await onBeforePrint();
                }
                
                // Attendre un court délai pour s'assurer que les styles sont appliqués
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la préparation de l\'impression';
                setError(errorMessage);
                if (onError) {
                    onError(errorMessage);
                }
                throw err;
            }
        },
        onAfterPrint: async () => {
            try {
                if (onAfterPrint) {
                    await onAfterPrint();
                }
                console.log('Document exporté en PDF avec succès');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erreur après l\'impression';
                setError(errorMessage);
                if (onError) {
                    onError(errorMessage);
                }
            } finally {
                setIsExporting(false);
            }
        },
        onPrintError: (errorLocation: string, error: Error) => {
            const errorMessage = `Erreur d'impression: ${error.message}`;
            setError(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
            setIsExporting(false);
        }
    });

    /**
     * Gestionnaire de clic avec gestion d'erreurs
     */
    const handleClick = useCallback(async () => {
        try {
            await handlePrint();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'exportation PDF';
            setError(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
            setIsExporting(false);
        }
    }, [handlePrint, onError]);

    return (
        <>
            <div className="relative">
                <Button
                    onClick={handleClick}
                    disabled={isExporting}
                    variant={variant}
                    size={size}
                    className={`flex items-center gap-2 transition-all duration-200 ${className}`}
                    title={`Exporter en PDF - ${documentName}`}
                >
                    {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : showIcon ? (
                        <Download className="w-4 h-4" />
                    ) : null}
                    <span className="text-sm font-medium">
                        {isExporting ? 'Export...' : buttonText}
                    </span>
                </Button>
                
                {/* Affichage des erreurs */}
                {error && (
                    <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded-lg shadow-lg max-w-xs z-50">
                        {error}
                    </div>
                )}
            </div>

            {/* Composant caché pour l'impression avec styles optimisés */}
            <div style={{ display: 'none' }}>
                <div 
                    ref={componentRef}
                    className="print-content"
                    style={{ 
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: scale !== 1 ? `${100 / scale}%` : '100%'
                    }}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default PrintButton;