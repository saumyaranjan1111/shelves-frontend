import React, { useEffect, useState } from 'react';

// axios is used to handle http requests
import axios from 'axios';
// import the spinner logo that is shown when the book list has not loaded fully

import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      // this function fetches the list of books and store it in the books state when the page is first loaded

    // useEffect is executed when the page loads for the first time, since there are no dependencies provided to useeffect so it will only execute when the page loads for the first time

    // sets the loading to true on initial load
    setLoading(true);

    // fetch the list of books
    axios
      .get('https://shelvesbackend.onrender.com/books')
      .then((response) => {
        // populates the books array with the data recieved from the backend server which fetches the list of all the books
        setBooks(response.data.data);

        // set loading state to false, once the array has been populated
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    // Implement search logic here
    // Filter the books based on the searchTerm
    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.publishYear.toString().includes(searchTerm)
        // Add more fields to search if needed
      );
    });
    // Update the books state with the filtered results
    setBooks(filteredBooks);
  };

  const toggleRead = (bookId) => {
    const updatedBooks = books.map((book) => {
      if (book._id === bookId) {

        axios.put(`https://shelvesbackend.onrender.com/books/${bookId}`, { 
        title : book.title,
        author : book.author,
        publishYear : book.publishYear,
        read : !book.read })
        .catch((error) => {
          console.log(error);
        })
        
        // Toggle the "read" property when the book matches the bookId
        if(book.read == "true") 
        return { ...book, read: "false" }
        else
        return { ...book, read: "true" }
      }
      return book;
    });
    setBooks(updatedBooks);
  };

  return (
    <div className='p-4'>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>My Books</h1>
        
        {/* this link redirects to /books/create which is used to add a new book to the list */}
        <div className='flex '>

        <Link to='/books/create'>
          <div className='bg-red-500 mx-8 text-white px-4 py-2 rounded-md hover:bg-green-600'>
            Add a book
            </div>
        </Link>

        <Link to='/books/import'>
            <div className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'> Import Books </div>
        </Link>
        </div>

      </div>
      
      <div >
      <SearchBar onSearch={handleSearch}/>
      </div>

      <div>

      </div>

      {loading ? (
        // if loading is set to true (which will happen when the page first loads), a spinner will be rendered instead of the table, show that the data is being loaded

        <Spinner />

      ) :  (
        // if loading is set to false
        // after useEffect has finished its execution, this table will be rendered

        <table className='w-full border-seperate border-spacing-2'>
            <thead>
                {/* here we define what will the table headings be */}
                <tr>
                    {/* the different table headings are serial no, title, author, publish year, operations etc */}

                    <th className='border border-slate-600 rounded-md'>Serial No</th>
                    <th className='border border-slate-600 rounded-md'>Title</th>

                    {/* on using max-md:hidden -> this column would be hidden in mobile and tablets */}
                    <th className='border border-slate-600 rounded-md max-md:hidden'>Author</th>
                    <th className='border border-slate-600 rounded-md max-md:hidden'>Publish Year</th>
                    <th className='border border-slate-600 rounded-md'>Operations</th>
                    <th className='border border-slate-600 rounded-md'>Read</th>
                    {/* <th className='border border-slate-600 rounded-md'>Open Library</th> */}
                </tr>
            </thead>
            <tbody>
                {books.map((book, index)=>(
                    // for each book display a row
                    <tr key={book._id}>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {index+1}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {book.title}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                            {book.author}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                            {book.publishYear}
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                            {/* under the operations column, there are 3 icons which can be used to view details of a particular book, edit a particular book, and to delete a particular book which are handled by /books/details /books/edit/book._id and /books/delete/book._id */}
                            <div className='flex justify-center gap-x-4'>
                                <Link to={`/books/details/${book._id}`}>
                                    <BsInfoCircle className='text-2xl text-green-800' />
                                </Link>
                                <Link to={`/books/edit/${book._id}`}>
                                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                                </Link>
                                <Link to={`/books/delete/${book._id}`}>
                                    <MdOutlineDelete className='text-2xl text-red-600'/>
                                </Link>
                            </div>
                            
                        </td>
                        <td className='border border-slate-700 rounded-md text-center'>
                        <div
                    className={`px-2 py-1 rounded-md ${book.read=="true" ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    onClick={() => toggleRead(book._id)}
                  >
                        {book.read == "true" ? 'Yes' : 'No'}
                        </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;