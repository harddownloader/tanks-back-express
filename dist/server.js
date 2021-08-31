"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-check
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const graphql_1 = require("graphql");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const schema_1 = require("@graphql-tools/schema");
const schema_js_1 = __importDefault(require("./graphql/schema.js"));
const resolvers_js_1 = __importDefault(require("./graphql/resolvers.js"));
require('dotenv').config();
var cors = require('cors');
const mongoose_1 = __importDefault(require("mongoose"));
let session = require('express-session');
// const User = require("./models/user");
// mongoose
mongoose_1.default
    .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = 3033;
    const pubsub = new graphql_subscriptions_1.PubSub();
    const app = (0, express_1.default)();
    // sessions
    app.use(session({
        secret: process.env.COOKIES_SECRET,
        resave: true,
        saveUninitialized: true,
    }));
    // cors
    var corsOptions = {
        origin: 'http://localhost:9000',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.use(cors());
    const httpServer = (0, http_1.createServer)(app);
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
        session.data = enemyConfig;
        console.log(session);
        return res.json({ session: session.data });
    });
    app.get('/enemy/:enemyId', function (req, res) {
        return res.json({ session: session.data });
    });
    // минус
    app.get('/enemy/bullets/decrement', function (req, res) {
        session.data.countBullets--;
        return res.json({ bullets: session.data.countBullets });
    });
    // готов ли стрелять
    app.get('/enemy/fire/status', function (req, res) {
        session.data.fireStatus = req.body.fireStatus;
        return res.json({ fireStatus: session.data.fireStatus });
    });
    // кол-во выстрелов
    app.get('/enemy/fire/fired-bullets', function (req, res) {
        session.data.firedBullets.push(req.body.firedBullets);
        return res.json({ firedBullets: session.data.firedBullets });
    });
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: schema_js_1.default, resolvers: resolvers_js_1.default });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
    });
    yield server.start();
    server.applyMiddleware({ app });
    subscriptions_transport_ws_1.SubscriptionServer.create({ schema, execute: graphql_1.execute, subscribe: graphql_1.subscribe }, { server: httpServer, path: server.graphqlPath });
    httpServer.listen(PORT, () => {
        console.log(`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
}))();
