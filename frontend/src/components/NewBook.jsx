import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_GENRES } from '../queries.js'

const NewBook = ({setNotify}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  // Exercise 8.10
  const [ addBook ] = useMutation(ADD_BOOK,
    {
      //refetchQueries: [{query: ALL_AUTHORS}],
      onError: (error) => {
        const messages = error.graphQLErrors.map(e => e.message).join('\n')
        setNotify(messages)
      },
      // Exercise 8.22
      update: (cache, response) => {
        cache.updateQuery({query: ALL_AUTHORS}, ({ allAuthors }) => {
          const newAuthor = response.data.addBook.author;
          const {id, name, born, bookCount} = newAuthor;
          return {
            allAuthors: allAuthors.some(author => author.name === name)
              ? allAuthors.map(author =>
                  author.name === name
                    ? { ...author, bookCount: author.bookCount + 1 }
                    : author
                )
              : [...allAuthors, { id, name, born, bookCount }]
          };
        });

        cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
          const newGenres = response.data.addBook.genres;
          return {
            //allPersons: allPersons.concat(response.data.addPerson),
            allGenres: [...new Set([...allGenres, ...newGenres])]
          }
        })
        cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
          const newBook = response.data.addBook;
          console.log(newBook)
          return {
            allBooks: [...allBooks, newBook]
          };
        });
        
      },
    }
  )

  const submit = async (event) => {
    event.preventDefault()
    addBook({ variables: { title, author, published: parseInt(published), genres } });
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    setNotify(`Added book: ${title}`);
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook