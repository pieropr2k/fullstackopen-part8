const { v1: uuid } = require('uuid')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }
    type Book {
        title: String!
        published: Int!
        author: String!
        id: ID!
        genres: [String!]
    }
    type Query {
        authorCount: Int!
        allAuthors: [Author!]!
        findAuthor(name: String!): Author
        bookCount: Int!
        allBooks(title: String
            published: Int
            author: String
            id: ID
            genre: String
        ): [Book!]!
        findBook(name: String!): Book
    }
    type Mutation {
        addBook(
            title: String!,
            author: String!,
            published: Int!,
            genres: [String]
        ): Book!
        editAuthor(
            name: String!,
            setBornTo: Int!
        ): Author
    }
`

const resolvers = {
    Query: {
        // author
        // Exercise 8.1
        authorCount: () => authors.length,
        // Exercise 8.3
        allAuthors: () => authors,
        findAuthor: (root, args) =>
            authors.find(p => p.name === args.name),
        // book
        // Exercise 8.1
        bookCount: () => books.length,
        // Exercise 8.2-4-5
        allBooks: (root, args) => {
            if (Object.keys(args).length === 0) {
              return books
            }
            return books.filter((book) => {
                const checkAllAttrsExceptGenres = Object.keys(args)
                    .filter(attr => attr !== 'genres')
                    .map(attr => book[attr] === args[attr])
                const checkAllAttrs = (args.genre) ? [book.genres.includes(args.genre), ...checkAllAttrsExceptGenres] : checkAllAttrsExceptGenres;
                //console.log(checkAllAttrs)
                return checkAllAttrs.reduce((resultado, valor) => resultado || valor, false);
            })
          },
        findBook: (root, args) =>
            books.find(p => p.name === args.name)
    },
    Author: {
        bookCount: (root) => {
            return books.filter(book => book.author === root.name).length;
        }
    },
    Mutation: {
        // Exercise 8.6
        addBook: (root, args) => {
          const book = { ...args, id: uuid() }
          books = books.concat(book)
          if (!authors.find(author => author.name === args.author)) {
            const author = { name: args.author, id: uuid() }
            authors = authors.concat(author)
            //console.log(authors)
          }
          //console.log(books)
          return book
        },
        // Exercise 8.7
        editAuthor: (root, args) => {
            const author = authors.find(p => p.name === args.name)
            if (!author) {
                return null
            }
            const updatedAuthor = { ...author, born: args.setBornTo }
            authors = authors.map(p => p.name === args.name ? updatedAuthor : p)
            return updatedAuthor
          }
      }
}

const server = new ApolloServer({
    //contains the GraphQL schema
    typeDefs,
    //is an object, which contains the resolvers of the server
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})