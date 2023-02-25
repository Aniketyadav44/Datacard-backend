import crypto from 'crypto'
import fs from 'fs'
import ipfs from '../ipfs.js'

var algorithm = "aes-192-cbc";
var buff = fs.readFileSync("./test")

//uploading function file to ipfs
const addFile = async({content})=>{
    const data = await ipfs.add(content)
    return data
}

//encryption function to encrypt cid
const encrypt = (secretKey, cid)=>{
    const key = crypto.scryptSync(secretKey, 'salt', 24)
    
    const cipher = crypto.createCipheriv(algorithm, key, buff)
    var encryptedCID = cipher.update(cid, 'utf8', 'hex') + cipher.final('hex')
    return encryptedCID
}

export const uploadFile = async (req, res, next) => {
    const { buffer, originalname: filename } = req.file;
    const secretKey = req.body.secretKey

    var fileHash = "failed"
    const uplaodData = {"content":buffer}
    fileHash = await addFile(uplaodData)
    
    var encryptedCID = encrypt(secretKey, fileHash["path"])
    return res.send({"encryptedCID":encryptedCID,"size": fileHash["size"],"mode": fileHash["mode"],})
}

