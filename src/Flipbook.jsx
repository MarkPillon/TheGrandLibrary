import React, { useEffect, useRef, useState } from "react"; // Ensure useRef is imported
import { PageFlip } from "page-flip";
import convertPDFToImages from "./utils/pdfUtils"; // Import the utility function

const Flipbook = ({ pdfUrl }) => {
  const flipbookRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const prevPdfUrl = useRef(pdfUrl);  // Ref to hold the previous PDF URL

  console.log("Received PDF URL in Flipbook:", pdfUrl);

  useEffect(() => {
    console.log("UseEffect triggered with pdfUrl:", pdfUrl);
    if (pdfUrl && flipbookRef.current && prevPdfUrl.current !== pdfUrl) {
      console.log("Different pdfUrl detected, proceeding...");

      // Store the previous URL to avoid unnecessary re-renders
      prevPdfUrl.current = pdfUrl;

      try {
        console.log("pdfUrl before decoding:", pdfUrl);

        // Step 1: Decode the URL once
        const decodedOnce = decodeURIComponent(pdfUrl);
        console.log("Decoded once:", decodedOnce);

        // Step 2: Decode it a second time
        const decodedTwice = decodeURIComponent(decodedOnce);
        console.log("Decoded twice:", decodedTwice);

        // Step 3: Replace encoded characters
        const finalUrl = decodedTwice
          .replace(/%2B/g, '+')
          .replace(/%2527/g, "'")
          .replace(/%2528/g, '(')
          .replace(/%2529/g, ')');
        
        console.log("Final decoded PDF URL:", finalUrl);

      } catch (error) {
        console.error("Error decoding the PDF URL:", error);
      }
    } else {
      console.log("Either pdfUrl is empty or flipbookRef isn't ready.");
    }
  }, [pdfUrl]); // Dependency on pdfUrl will only trigger effect when it changes

  return (
    <div>
      {loading ? (
        <p>Loading flipbook...</p>
      ) : (
        <div ref={flipbookRef} style={{ width: "600px", height: "800px" }}></div>
      )}
    </div>
  );
};

export default Flipbook;

