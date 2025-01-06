import { gql } from '@apollo/client'

// Exercise 8.8
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
        name,
        born,
        bookCount
    }
  }
`

// Exercise 8.11-12
// set birthyear
export const SET_BIRTHYEAR = gql`
    mutation setBirthyear($name: String!, $newYear: Int!) {
        editAuthor(name: $name, setBornTo: $newYear) {
            name
            born
        }
    }
`

// Exercise 8.9
// books
export const ALL_BOOKS = gql`
  query {
    allBooks { 
        title 
        author {
          name
        }
        published 
        genres
    }
  }
`

export const BOOKS_FILTERED = gql`
  query Books($genre: String!) {
    allBooks (genre: $genre) {
      title 
        author {
          name
        }
        published 
        genres
    }
  }
`;

export const FAVORITE_GENRE_BOOKS = gql`
  query {
    favoriteGenreBooks {
      favGenre
      books {
        title 
        author {
          id
          name
          born
        }
        published 
        genres
      }
    }
  }
`

// Exercise 8.10
export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
        id  
        title
        author {
          id
          name
          born
          bookCount
        }
        published
        genres
    }   
  }
`

// Exercise 8.18
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

// Exercise 8.20
export const ALL_GENRES = gql`
  query {
    allGenres
  }
`
export const CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const SET_LOGGED_USER = gql`
  mutation EditLoggedUserInfo($favoriteGenre: String!) {
    editLoggedUserInfo(favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
    }
  }
`;