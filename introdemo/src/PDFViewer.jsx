import React, { useEffect, useRef } from "react";

const PDFViewer = ({ pdfUrl }) => {
  const flipbookRef = useRef(null);

  useEffect(() => {
    // Wait for DearFlip to load
    if (window.DearFlip && flipbookRef.current) {
      const dearFlipInstance = new window.DearFlip(flipbookRef.current, {
        pdf: pdfUrl,
        width: 800,
        height: 600,
        autoCenter: true,
      });

      // Optionally, you can call any additional methods for the DearFlip instance if needed
      // For example: dearFlipInstance.init();

      return () => {
        // Cleanup: destroy the instance when the component unmounts
        if (dearFlipInstance) {
          dearFlipInstance.destroy();
        }
      };
    } else {
      console.error("DearFlip is not loaded correctly.");
    }
  }, [pdfUrl]);

  return <div ref={flipbookRef} id="flipbook" style={{ overflow: "hidden" }}></div>;
};

export default PDFViewer;
