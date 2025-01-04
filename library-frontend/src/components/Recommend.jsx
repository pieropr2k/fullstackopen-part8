import { useQuery } from "@apollo/client";
import { ALL_BOOKS, CURRENT_USER } from "../queries.js";

// Exercise 8.20
const Recommend = () => {
    const { loading: booksLoading, error: booksError, data: booksData } = useQuery(ALL_BOOKS);
    const { loading: userLoading, error: userError, data: userData } = useQuery(CURRENT_USER);
    
    if (booksLoading || userLoading) {
        return <div>Loading...</div>;
    }

    if (booksError || userError) {
        return <>
            {booksError && <div>Error: {booksError.message}</div>}
            {userError && <div>Error: {userError.message}</div>}
        </>
    }

    // Exercise 8.19
    const genre = userData.me.favoriteGenre;
    const books = booksData.allBooks.filter(book => book.genres.includes(genre));

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