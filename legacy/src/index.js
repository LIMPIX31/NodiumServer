import cors from "cors";
import socketio from "socket.io";
import * as http from "http";
import mongoose from 'mongoose'
import helmet from "helmet";
import bodyParser from "body-parser";
import {router} from "./router/index"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import {errorMiddleware} from "./middlewares/errorMiddleware"
import fileUpload from 'express-fileupload'
import {graphqlHTTP} from "express-graphql"
import {buildSchema} from "graphql"
dotenv.config()


const express = require('express')
const app = express()

export let db

const start = async () => {
  try {
    db = await mongoose.connect(process.env.MONGO_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(4040, () => {
      console.log('Started')
    })
  } catch (e) {
    console.error(e)
  }
}

let schema = buildSchema(`
  type Query {
    hello: String
  }
`);

let root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use(express.json())
app.use(cors({
  origin: '*',
  credentials: true,
}))
app.use(helmet())
app.use(cookieParser())
app.use(fileUpload({}))

app.use('/api',router)

app.use(errorMiddleware)


// const io = new socketio.Server(server)
//
// let connections = []
//
// io.sockets.on('connection', (socket) => {
//   console.log("new client connected")
//   connections.push(socket)
//
//   socket.on('disconnect', (data) => {
//     connections.splice(connections.indexOf(socket), 1)
//     console.log('connection closed')
//   })
// })

start()
