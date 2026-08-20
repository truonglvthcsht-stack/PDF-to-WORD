import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for browser environment
// Use unpkg or cdnjs worker matching version for reliable client-side rendering
const PDFJS_VERSION = pdfjsLib.version || '4.10.38';
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
}

/**
 * Extracts all pages of a PDF File as high-resolution Data URLs (images)
 */
export async function renderPdfToImages(file: File, maxPages = 20): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = Math.min(pdfDoc.numPages, maxPages);
    const images: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      // Render at 2.0 scale for crisp math symbol recognition
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        // White background for math contrast
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Render PDF page into canvas context
        // @ts-expect-error pdfjs typing nuance
        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png');
        images.push(dataUrl);
      }
    }

    return images;
  } catch (err) {
    console.warn('PDF.js client-side rendering failed, falling back to direct PDF upload:', err);
    // If client PDF rendering fails, read file as single data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve([reader.result]);
        } else {
          resolve([]);
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
