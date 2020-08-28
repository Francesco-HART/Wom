const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const Queries = require("./graphql/queries");
const passport = require("passport");
const Mutations = require("./graphql/mutations");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const app = express();
const Cookies = require("cookies");
const cors = require("cors");
const bodyParser = require("body-parser");
const graphql = require("graphql");
const { GraphQLSchema } = graphql;

if (process.env.NODE_ENV === "test") require("dotenv").config();

// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

const schema = new GraphQLSchema({
  query: Queries,
  mutation: Mutations,
});
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: { defaultQuery: undefined, headerEditorEnabled: true },
  })
);

app.use(Cookies.express({ keys: [process.env.COOKIE_KEY] }));

const HTTP_PORT = process.env.PORT || 4000;

module.exports = app;

app.listen(HTTP_PORT, () => {
  console.log("run on port 4000 ");
});
