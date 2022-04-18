// @ts-check
import { createServer } from 'http';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema/index';
import { resolvers } from './graphql/resolvers/index';
require('dotenv').config();
var cors = require('cors');
import mongoose from 'mongoose';
let session = require('express-session');

// const User = require("./models/user");

// mongoose
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

(async () => {
  const PORT = 3033;
  const pubsub = new PubSub();
  const app = express();

  // sessions
  app.use(
    session({
      secret: process.env.COOKIES_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  // cors
  var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors());
  const httpServer = createServer(app);

  // Schema definition
  // const typeDefs = gql`
  //   type Query {
  //     currentNumber: Int
  //   }

  //   type Subscription {
  //     numberIncremented: Int
  //   }
  // `;

  // Resolver map
  // const resolvers = {
  //   // Query: {
  //   //   currentNumber() {
  //   //     return currentNumber;
  //   //   },
  //   // },
  //   Subscription: {
  //     numberIncremented: {
  //       subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
  //     },
  //   },
  // };

  app.get('/rest', function (req, res) {
    return res.json({ data: 'rest' });
    // return User.find()
    //   .exec()
    //   .then((docs) => {
    //     console.log("getAllUsers", docs);
    //     // return docs;
    //     res.json({ data: docs });
    //   })
    //   .catch((err) => {
    //     console.log("getAllUsers error: ", err);
    //     // return { error: err };
    //     res.json({ data: "error" });
    //   });
  });

  // инициаолизация
  app.get('/enemy/set', cors(corsOptions), function (req, res) {
    const enemyConfig = {
      id: '',
      countBullets: 20,
      firedBullets: [],
      fireStatus: true,
    };
    session.enemy = enemyConfig;
    console.log(session);
    return res.json({ enemy: session.enemy });
  });

  app.get('/enemy/:enemyId', cors(corsOptions), function (req, res) {
    return res.json({ enemy: session.enemy });
  });

  // минус
  app.get('/enemy/bullets/decrement', cors(corsOptions), function (req, res) {
    session.enemy.countBullets--;
    return res.json({ bullets: session.enemy.countBullets });
  });

  // готов ли стрелять
  app.get('/enemy/fire/status', cors(corsOptions), function (req, res) {
    session.enemy.fireStatus = req.body.fireStatus;
    return res.json({ fireStatus: session.enemy.fireStatus });
  });

  // кол-во выстрелов
  app.get('/enemy/fire/fired-bullets', cors(corsOptions), function (req, res) {
    session.enemy.firedBullets.push(req.body.firedBullets);
    return res.json({ firedBullets: session.enemy.firedBullets });
  });


  // инициализация карты
  app.get('/map', cors(corsOptions), function(req, res) {
    return res.json({map: resolvers.Query.getMap()});
  });

  app.get('/player/set', cors(corsOptions), function (req, res) {
    const enemyConfig = {
      id: '',
      countBullets: 20,
      firedBullets: [],
      fireStatus: true,
    };
    session.player = enemyConfig;
    console.log(session);
    return res.json({ player: session.player });
  });

  app.get('/player', cors(corsOptions), function (req, res) {
    return res.json({ player: session.player });
  });

  // минус
  app.get('/player/bullets/decrement', cors(corsOptions), function (req, res) {
    session.player.countBullets--;
    return res.json({ bullets: session.player.countBullets });
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
