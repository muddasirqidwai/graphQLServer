var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

mongoose.connect(
  "mongodb+srv://dummyuser:dummyuser@dummydata-jmwgw.mongodb.net/graphQLTutorial?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("conneted to database");
});

const graphQlHTTP = require("express-graphql");

//const dummyschema = require("./server/schema/dummyschema");

const schema = require("./server/schema/schema");

console.log(__dirname);
var app = express();

// allow cross-origin request
app.use(cors());

//add middleware in express
app.use(
  "/graphql",
  graphQlHTTP({
    schema,
    graphiql: true
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(4000, () => {
  console.log("welcome");
});
