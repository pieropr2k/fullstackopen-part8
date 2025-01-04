const typeDefs = `
    type User {
        username: String!
        favoriteGenre: String
        id: ID!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }
    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]
    }
    type Query {
        me: User
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
        allGenres: [String]!
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
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
        editLoggedUserInfo(
            username: String
            favoriteGenre: String
        ): User
    }
`

module.exports = typeDefs;