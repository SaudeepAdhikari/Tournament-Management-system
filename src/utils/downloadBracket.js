import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Downloads the bracket as a PDF file
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - Name for the downloaded file
 */
export async function downloadBracketAsPDF(element, filename = 'Tournament_Tiesheet.pdf') {
    if (!element) {
        throw new Error('Element not found');
    }

    try {
        // Capture the element as canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            backgroundColor: '#ffffff', // White background for printing
            logging: false,
            useCORS: true,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        // Get canvas dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Create PDF with appropriate orientation
        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [imgWidth, imgHeight]
        });

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Download the PDF
        pdf.save(filename);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

/**
 * Downloads the bracket as a PNG image
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - Name for the downloaded file
 */
export async function downloadBracketAsImage(element, filename = 'Tournament_Tiesheet.png') {
    if (!element) {
        throw new Error('Element not found');
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });

        return true;
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}
