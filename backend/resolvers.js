const { v1: uuid } = require('uuid')
const Author = require('./models/author.js')
const Book = require('./models/book.js');
const User = require('./models/user.js');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken')

// Exercise 8.14
const resolvers = {
    Query: {
        // Exercise 8.16
        me: (root, args, context) => {
            return context.currentUser
        },
        // author
        // Exercise 8.1
        authorCount: async () => await Author.countDocuments({}),
        //authorCount: () => authors.length,
        // Exercise 8.3
        allAuthors: async () => {
            const authors = await Author.find({});
            return authors;
        },
        findAuthor: async (root, args) => await Author.findOne({ name: args.name }),
        //findAuthor: (root, args) => authors.find(p => p.name === args.name),
        // book
        // Exercise 8.1
        bookCount: async () => await Book.countDocuments({}),
        //bookCount: () => books.length,
        // Exercise 8.2-4-5
        allBooks: async (root, args) => {
            const filter = { ...args };
            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                filter.author = author ? author._id : null;
            }
            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }
            return await Book.find(filter).populate('author');
        },
        findBook: async (root, args) =>
            await Book.findOne({ name: args.name })
        //books.find(p => p.name === args.name)
    },
    Author: {
        bookCount: async (root) => {
            return await Book.countDocuments({ author: root.name });
            //return books.filter(book => book.author === root.name).length;
        }
    },
    Mutation: {
        // Exercise 8.6
        // Exercise 8.15
        addBook: async (root, args, context) => {
            const { title, author, published, genres } = { ...args };
            // Exercise 8.16
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            const new_book = new Book({ title, published, genres });
            let the_author = await Author.findOne({ name: author });
            //books = books.concat(book)
            if (!the_author) {
                the_author = new Author({ name: author });
                try {
                    await the_author.save();
                } catch (error) {
                    throw new GraphQLError('Saving book failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    })
                }
            }
            new_book.author = the_author;
            try {
                await new_book.save();
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return new_book;
        },
        // Exercise 8.15
        // Exercise 8.7
        editAuthor: async (root, args, context) => {
            // Exercise 8.16
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            const author = await Author.findOne({ name: args.name });
            if (!author) {
                return null;
            }
            author.born = args.setBornTo;
            try {
                await author.save();
            } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return author;
        },
        // Exercise 8.16
        createUser: async (root, args) => {
            const user = new User({ username: args.username })
            return await user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            }
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    }
}

module.exports = resolvers;