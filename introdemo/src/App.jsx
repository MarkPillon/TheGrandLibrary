import React, { useState, useEffect } from "react";
import "./App.css";
import PDFViewer from "./PDFViewer";

const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = async () => {
    if (!search) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://o6hca89epf.execute-api.us-east-1.amazonaws.com/prod/search?search=${search}&type=Title`
      );
      const data = await response.json();
      console.log("Fetched Data:", data); // Debug API response

      if (response.ok) {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        } else {
          setBooks([]);
          setError("No books found.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    } catch (error) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Books state updated:", books);
  }, [books]);

  const [expandedBook, setExpandedBook] = useState(null);

  const toggleDescription = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  const handleViewPDF = (book) => {
    setSelectedBook(book);
  };

  const closePDFViewer = () => {
    setSelectedBook(null);
  };

  return (
    <div className="App p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        📚 The Grand Library - Book Search
      </h1>

      {/* Search Input */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Title..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Books List */}
      <div className="books-list space-y-6">
        {books.length === 0 && !loading && !error && (
          <p className="text-gray-500">No books found. Try a different search.</p>
        )}

        {books.map((book) => {
          // Construct full S3 URL
          const pdfUrl = `https://grandlibrary.s3.amazonaws.com/${book.S3Path}`;

          return (
            <div key={book.BookID} className="book-item flex space-x-6 border-b pb-4">
              {/* Book Cover Image */}
              <img
                src={book.CoverImage || "https://via.placeholder.com/100x150"}
                alt={book.Title}
                className="w-32 h-48 object-cover rounded-md shadow-md"
              />

              {/* Book Details */}
              <div className="book-details flex-1">
                <h3 className="text-xl font-semibold">{book.Title}</h3>
                <p className="text-sm text-gray-700">👨‍💼 {book.Author || "Unknown"}</p>
                <p className="text-sm text-gray-600">📅 {book.PublishedDate || "N/A"}</p>
                <p className="text-sm text-gray-600">📖 Pages: {book.PageCount || "Unknown"}</p>
                <p className="text-sm text-gray-500">🏷️ {book.Topic || "Not specified"}</p>
                <p className="text-sm text-gray-500">⭐ Rating: {book.Rating || "No rating available"}</p>

                {/* Book Description */}
                <p className="mt-2 text-sm text-gray-500">
                  📝{" "}
                  {expandedBook === book.BookID
                    ? book.Description
                    : `${book.Description?.substring(0, 200)}...`}
                </p>

                {/* Toggle Description */}
                {book.Description && (
                  <button
                    onClick={() => toggleDescription(book.BookID)}
                    className="text-blue-600 mt-2 text-sm"
                  >
                    {expandedBook === book.BookID ? "Show Less" : "Show More"}
                  </button>
                )}

                {/* Debugging: Show PDF Link */}
                <p className="text-xs text-gray-400 break-all">{pdfUrl}</p>

                {/* View PDF Button */}
                {book.S3Path && (
                  <button
                    onClick={() => handleViewPDF({ ...book, PDFLink: pdfUrl })}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                  >
                    View PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Viewer Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <PDFViewer pdfUrl={selectedBook.PDFLink} />
            <button
              onClick={closePDFViewer}
              className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
