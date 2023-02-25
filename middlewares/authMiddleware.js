import fs from 'fs'

var serverApiKey = fs.readFileSync("./api")

export const authenticateKey = (req, res, next)=>{
    let apiKey = req.header('x-api-key')
    if(apiKey == serverApiKey.toString().trim()){
        next()
    }else{
        res.status(403).send({"error":"INVALID_API_KEY"})
    }
}