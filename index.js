import express from 'express'
import bodyParser from 'body-parser'
import requestRouter from './routes/requestRoutes.js'
import uploadRouter from './routes/uploadRoutes.js'
import ipfs from './ipfs.js'

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>res.send("Welcome to this IPFS Backend"))
app.use('/api/upload',uploadRouter)
app.use('/api/request', requestRouter)

app.listen(3000, ()=> console.log("Listening on port 3000"))