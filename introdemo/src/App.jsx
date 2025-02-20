import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!search) return; // No search term provided

    setLoading(true);
    setError(null); // Reset error state before making a new request

    try {
      const response = await fetch(
        `https://o6hca89epf.execute-api.us-east-1.amazonaws.com/prod/search?search=${search}&type=Title`,
        { method: 'GET' }
      );

      const data = await response.json();
      console.log('Fetched Data:', data); // Log the fetched data

      if (response.ok) {
        // Directly use the fetched array if it's not wrapped in 'Items'
        if (Array.isArray(data) && data.length > 0) {
          console.log('Setting books:', data); // Log data being set to state
          setBooks(data); // Directly update the state with the array
        } else {
          setBooks([]); // Reset state if no books are found
          setError('No books found for this search.');
        }
      } else {
        setError('An unknown error occurred.');
      }
    } catch (error) {
      setError('An error occurred while fetching books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Books state updated:', books); // Log updated books state
  }, [books]); // Run when 'books' state changes

  return (
    <div className="App">
      <h1>
        <span className="library-name">The Grand Library</span>
        <br />
        <span className="book-search">Book Search</span>
      </h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Title"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>

      {error && <div className="error">{error}</div>}

      <div className="books-list">
        {books.length === 0 && !loading && !error && (
          <p>No books found. Try a different search term.</p>
        )}
        {books.length > 0 &&
          books.map((book) => (
            <div key={book.BookID} className="book-item">
              <h3>{book.Title}</h3>
              <p>{book.Author}</p>
              <img
                src={book.CoverImage}
                alt={`${book.Title} cover`}
                style={{ width: '100px', height: '150px' }}
              />
              <p>{book.Description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
