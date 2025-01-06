import { useQuery } from "@apollo/client";
import { FAVORITE_GENRE_BOOKS } from "../queries.js";

// Exercise 8.20
const Recommend = () => {
    const { loading: booksLoading, error: booksError, data: booksData } = useQuery(FAVORITE_GENRE_BOOKS);
    
    if (booksLoading) {
        return <div>Loading...</div>;
    }

    if (booksError) {
        return <>
            {booksError && <div>Error: {booksError.message}</div>}
        </>
    }
    const books = booksData.favoriteGenreBooks.books;
    const genre = booksData.favoriteGenreBooks.favGenre;

    return (
        <div>
            <h2>recommendations</h2>
            <div>{`books in your favorite genre `}<strong>{genre}</strong></div>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recommend;