import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import {Button} from '@/components/ui/button';

interface PrintButtonProps {
    children: React.ReactNode;
    documentName?: string;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon"; // Button size
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const PrintButton: React.FC<PrintButtonProps> = ({
    children,
    documentName = 'document',
    className = '',
    variant = 'outline',
    size = 'default'
}) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: documentName,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
                .no-print {
                    display: none !important;
                }
            }
        `,
        onBeforePrint: () => {
            // Optionnel: logique avant l'impression
            return Promise.resolve();
        },
        onAfterPrint: () => {
            // Optionnel: logique après l'impression
            console.log('Document imprimé avec succès');
        },
        // Remove this line since removeAfterPrint is not a valid option
    });

    return (
        <>
            <Button
                onClick={handlePrint}
                variant={variant}
                size={size}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${className}`}
            >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Imprimer PDF</span>
                <span className="sm:hidden">PDF</span>
            </Button>

            {/* Composant caché pour l'impression */}
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default PrintButton;