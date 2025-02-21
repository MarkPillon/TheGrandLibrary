import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker with the local worker script
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

/**
 * Converts a PDF file into an array of image URLs (data URLs).
 * @param {string} pdfUrl - The URL of the PDF file.
 * @returns {Promise<string[]>} - An array of image data URLs.
 */
const convertPDFToImages = async (pdfUrl) => {
  const images = [];

  try {
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    // Loop through each page and render it as an image
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the page on the canvas
      await page.render({ canvasContext: context, viewport }).promise;

      // Convert the canvas to a data URL and add it to the images array
      images.push(canvas.toDataURL());
    }
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw error;
  }

  return images;
};

export default convertPDFToImages;