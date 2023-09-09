// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if(e.key == 'Enter'){
        onSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        className="border border-gray-300 px-3 py-2 rounded-md w-48"
      />
      <button
        onClick={handleSearch}
        className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
