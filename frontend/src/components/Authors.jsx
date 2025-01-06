import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries";

// Exercise 8.12
const SetBirthyearForm = ({ authorsList, setNotify }) => {
    //console.log(authorsList);
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [changeNumber, result] = useMutation(SET_BIRTHYEAR,
        {
            refetchQueries: [{ query: ALL_AUTHORS }],
            onError: (error) => {
                const messages = error.graphQLErrors.map(e => e.message).join('\n')
                setNotify(messages)
            }
        }
    )

    const submit = (event) => {
        event.preventDefault()
        changeNumber({ variables: { name, newYear: parseInt(born) } })
        setName('')
        setBorn('')
    }

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            setNotify('person not found')
        }
    }, [result.data])

    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <select value={name} onChange={({ target }) => setName(target.value)}>
                    {authorsList.map(author => <option key={author} value={author}>{author}</option>)}
                </select>
                <div>
                    born
                    <input
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

// Exercise 8.8
const Authors = ({ token, setNotify }) => {
    const { loading, error, data } = useQuery(ALL_AUTHORS);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const authors = data.allAuthors;
    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                // Exercise 8.18
                token && <SetBirthyearForm authorsList={authors.map(author => author.name)} setNotify={setNotify} />
            }
        </div>
    )
}

export default Authors;