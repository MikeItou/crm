const { ApolloServer } = require('apollo-server');
const  typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const configDB = require('./config/db'); 
const jwt = require('jsonwebtoken');
const User = require('./model/User');
require('dotenv').config({ path: 'variables.env' });

//Database connection
configDB();

//Get instance of the server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
       const token = req.headers['auth'] || '';
       if (token) {
           try {
               console.log(User);
               const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
               return  { user };
           } catch (error) {
                console.log(error);
           }
       }
    }
});

//Init the server
server.listen().then(({url}) => {
    console.log(`The server are ready and working on ${url}`);
});
