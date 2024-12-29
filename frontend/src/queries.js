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
        author
        published 
        genres
    }
  }
`

// Exercise 8.10
export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
        id  
        title
        author
        published
        genres
    }   
  }
`