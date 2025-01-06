import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_GENRES, BOOKS_FILTERED } from "../queries.js";
import { useState } from "react";

// Exercise 8.19
const FilterGenre = ({ allGenres = [], setFilter }) => {
    return <div style={{ display: 'flex' }}>
        {
            allGenres.map(genre => <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>)
        }
        <button onClick={() => setFilter('all')}>
            all genres
        </button>
    </div>;
}

// Exercise 8.9
const Books = () => {
    const [genre, setGenre] = useState('all');
    // Exercise 8.21
    const { loading: booksLoading, error: booksError, data: booksData } = useQuery(
        genre === 'all' ? ALL_BOOKS : BOOKS_FILTERED, {
        variables: { genre }
    });
    const { loading: genresLoading, error: genresError, data: genresData } = useQuery(ALL_GENRES);

    if (booksLoading || genresLoading) {
        return <div>Loading...</div>;
    }

    if (booksError || genresError) {
        return <>
            {booksError && <div>Error: {booksError.message}</div>}
            {genresError && <div>Error: {genresError.message}</div>}
        </>
    }

    // Exercise 8.21
    const books = booksData.allBooks;
    // Exercise 8.19
    //const books = genre === 'all' ? booksData.allBooks : booksData.allBooks.filter(book => book.genres.includes(genre));
    const genres = genresData.allGenres;
    
    return (
        <div>
            <h2>books</h2>
            <div>{`in genre `}<strong>{genre}</strong></div>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <FilterGenre allGenres={genres} setFilter={setGenre}/>
        </div>
    );
};

export default Books;