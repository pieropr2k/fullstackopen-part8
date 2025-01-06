const { v1: uuid } = require('uuid')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const mongoose = require('mongoose')
require('dotenv').config()
const Book = require('./models/book.js');
const Author = require('./models/author.js');
const User = require('./models/user.js');

const jwt = require('jsonwebtoken')


async function cleanBooks() {
  const books = await Book.find({});
  for (const book of books) {
    console.log(book.author);
    if (!book.author) {
      console.log(`Book without author: ${book.title}`);
      await Book.findByIdAndDelete(book._id);
    }
  }
  console.log('Books with missing authors have been deleted.');
}


/*
  you can remove the placeholder query once your first one has been implemented 
*/

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
    //contains the GraphQL schema
    typeDefs,
    //is an object, which contains the resolvers of the server
    resolvers,
})

//cleanBooks();

startStandaloneServer(server, {
    listen: { port: 4000 },
    // Exercise 8.16
    context: async ({ req, res }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
        //console.log(decodedToken)
        const currentUser = await User.findById(decodedToken.id)
        //console.log(currentUser)
        return { currentUser }
      }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})