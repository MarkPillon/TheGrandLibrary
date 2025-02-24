import React, { useState, useEffect } from "react";
import "./App.css";
// import Flipbook from "./Flipbook"; // Keep for later

const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("Title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  const handleSearch = async () => {
    if (!search) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://o6hca89epf.execute-api.us-east-1.amazonaws.com/prod/search?search=${search}&type=${searchType}`
      );
      const data = await response.json();
      console.log("Fetched Data:", data);

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

  const toggleDescription = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  const handleViewPDF = (pdfUrl) => {
    console.log("Opening PDF:", pdfUrl);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="App p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        📚 The Grand Library - Book Search
      </h1>

      <div className="search-bar flex space-x-2 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search by ${searchType}...`}
          className="search-input"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="Title">Title</option>
          <option value="Author">Author</option>
          <option value="Topic">Topic</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="search-button"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <div className="error mb-4">{error}</div>}
      {/* New: Books Found Count */}
      {books.length > 0 && !loading && (
        <div className="books-count mb-4">
          {books.length} {books.length === 1 ? "book" : "books"} found
        </div>
      )}

      <div className="books-list space-y-6">
        {books.length === 0 && !loading && !error && (
          <p className="text-gray-500">No books found. Try a different search.</p>
        )}

        {books.map((book) => {
          const pdfUrl = `https://grandlibrary.s3.amazonaws.com/${decodeURIComponent(decodeURIComponent(book.S3Path))}`;
          console.log("Constructed PDF URL:", pdfUrl);

          const coverUrl = book.CoverImage
            ? book.CoverImage.replace("http://", "https://")
            : "https://via.placeholder.com/100x150";

          return (
            <div key={book.BookID} className="book-item flex space-x-6 border-b pb-4">
              <img
                src={coverUrl}
                alt={book.Title}
                className="w-32 h-48 object-cover rounded-md shadow-md"
              />
              <div className="book-details flex-1">
                <h3 className="text-xl font-semibold">{book.Title}</h3>
                <p className="text-sm text-gray-700">👨‍💼 {book.Author || "Unknown"}</p>
                <p className="text-sm text-gray-600">📅 {book.PublishedDate || "N/A"}</p>
                <p className="text-sm text-gray-600">📖 Pages: {book.PageCount || "Unknown"}</p>
                <p className="text-sm text-gray-500">🏷️ {book.Topic || "Not specified"}</p>
                <p className="text-sm text-gray-500">⭐ Rating: {book.Rating || "No rating available"}</p>
                <p className="mt-2 text-sm text-gray-500">
                  📝{" "}
                  {expandedBook === book.BookID
                    ? book.Description
                    : `${book.Description?.substring(0, 200)}...`}
                </p>
                {book.Description && (
                  <button
                    onClick={() => toggleDescription(book.BookID)}
                    className="text-blue-600 mt-2 text-sm"
                  >
                    {expandedBook === book.BookID ? "Show Less" : "Show More"}
                  </button>
                )}
                {book.S3Path && (
                  <button
                    onClick={() => handleViewPDF(pdfUrl)}
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
    </div>
  );
};

export default App;