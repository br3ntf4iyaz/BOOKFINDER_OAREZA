import React, { useState, useEffect } from 'react';

const BookSearch = () => {
  const [query, setQuery] = useState('harry potter');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}`);
      const data = await res.json();
      setBooks(data.docs);
      setTotal(data.numFound);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setBooks(json.books || []);
        setTotal(json.books?.length || 0);
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="book-search-container">
      <h1>Book Search</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="upload-container">
        <label>Upload JSON (optional): </label>
        <input type="file" accept=".json" onChange={handleUpload} />
      </div>

      <div className="results">
        {books.length === 0 && <p>No results found.</p>}
        {books.map((book, idx) => (
          <div key={idx} className="book-item">
            <strong>{book.title}</strong> by {book.author_name?.join(', ') || 'Unknown'}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * 100 >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearch;
