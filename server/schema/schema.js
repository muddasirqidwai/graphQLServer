const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

// object declaration
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return Author.findById(parent.authorId);
      }
    }
  })
});

// object declaration
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

// endpoints  this is used from the client side
const query = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    bookQuery: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },
    authorQuery: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    getBooks: {
      type: new GraphQLList(BookType),
      resolve() {
        return Book.find({});
      }
    },
    getAuthors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    removeBook: {
      type: GraphQLBoolean,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        console.log(args);
        Book.findByIdAndRemove(args.id, function(err, result) {
          if (err) {
            console.log("error:", err);
          } else if (result) {
            console.log("Successful deletion");
          }
          return true;
        });

        return false;
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        var result = book.save();
        console.log(result);
        return result;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: query,
  mutation: Mutation
});
