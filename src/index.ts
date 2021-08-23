import cors from "cors";
import mongoose from 'mongoose'
import helmet from "helmet";
import {router} from "./router"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import {errorMiddleware} from "./middlewares/errorMiddleware"
import fileUpload from 'express-fileupload'
import {nodiumRouter} from "./router/nodium";
import * as fs from "fs";
import {minecraftRouter} from "./router/minecraft";
import path from "path";
import * as http from "http";
import * as https from "https";

dotenv.config()

const express = require('express')
let privateKey = fs.readFileSync(path.join(__dirname, '../cert/key.pem'));
let certificate = fs.readFileSync(path.join(__dirname, '../cert/cert.pem'));

let credentials = {key: privateKey, cert: certificate};


let app = express()

export let db

const start = async () => {
  try {
    db = await mongoose.connect(process.env.MONGO_URL || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    http.createServer(app).listen(4040, () => {
      console.log('Started')
    })
    https.createServer(credentials, app).listen(4041,()=>{
      console.log('Started SSL')
    })
    // app.listen(4040, () => {

    // })
  } catch (e) {
    console.error(e)
  }
}


app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(helmet())
app.use(cookieParser())
app.use(fileUpload({}))
app.use('/static', express.static('static'))

app.use('/api', router)
app.use('/nodium', nodiumRouter)
app.use('/minecraft', minecraftRouter)

app.use(errorMiddleware)

export const minecraftPrivateKey = fs.readFileSync(path.join(__dirname,'../minecraftCert','private.pem')).toString()

export const hashsums = {
  vanilla: require('./hashsums/vanilla_hash.json')
}


start()
