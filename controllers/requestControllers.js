import fs from 'fs'
import crypto from 'crypto'
import admin from '../db.js'

let firestore = admin.firestore()

var algorithm = "aes-192-cbc"
var buff = fs.readFileSync("./test")

export const requestFile = async (req, res, next) => {
    try {
        const { docUID, secretKey } = req.body
        //fetching from firebase for the first time
        var file = await firestore.collection('files').doc(docUID);
        var data = await file.get();
        if(!data.exists) {
            //if document doesn't exists
            res.status(404).send({"error":"FILE_NOT_FOUND"});
        }else {
            //if doc exists, then start a time counter which goes for 10 intervals of 3 sec(total 30 secs)
            var count = 0;
            var intervalID = setInterval(async()=>{
                //fetching from firebase for each interval
                file = await firestore.collection('files').doc(docUID);
                data = await file.get();
                count++;
                if (count === 10) {
                    //if interval's count is 10, means 30 secs are over... then timeout
                    clearInterval(intervalID);
                    return res.send({"error":"TIME_OUT",})
                }else if(data.data()["access"]){
                    //if the doc is accessed by the owner, then stop the interval timer and start decrypting
                    clearInterval(intervalID)
                    try{
                        //make the key from passed secret key
                        const key = crypto.scryptSync(secretKey, 'salt', 24)
                        const decipher = crypto.createDecipheriv(algorithm, key, buff)
                        var decrypted = decipher.update(data.data()["encryptedCID"], 'hex', 'utf8') + decipher.final('utf8')
                        return res.send({"uid":data.data()["uid"],"decryptedCID":decrypted})
                    }catch(err){
                        if(err.code=="ERR_OSSL_BAD_DECRYPT")
                        return res.status(401).send({"error":"INVALID_KEY"})
                    }
                }
            }, 3000);
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const requestDataCard = async (req, res, next) => {
    try {
        const { dataCardUID, secretKey } = req.body
        //fetching from firebase for the first time
        var dataCard = await firestore.collection('datacards').doc(dataCardUID);
        var data = await dataCard.get();
        if(!data.exists) {
            //if datacard doesn't exists
            res.status(404).send({"error":"DATACARD_NOT_FOUND"});
        }else {
            //if doc exists, then start a time counter which goes for 10 intervals of 3 sec(total 30 secs)
            var count = 0;
            var intervalID = setInterval(async()=>{
                //fetching from firebase for each interval
                dataCard = await firestore.collection('datacards').doc(dataCardUID);
                data = await dataCard.get();
                count++;
                if (count === 10) {
                    //if interval's count is 10, means 30 secs are over... then timeout
                    clearInterval(intervalID);
                    return res.send({"error":"TIME_OUT",})
                }else if(data.data()["access"]){
                    //if the doc is accessed by the owner, then stop the interval timer and start decrypting
                    clearInterval(intervalID)
                    try{
                        //make the key from passed secret key
                        var files = []
                        var fileList = data.data()["files"]
                        for (var i in fileList) {
                            var file = await firestore.collection('files').doc(fileList[i]);
                            var fileData = await file.get();
                            var fileDataObj = fileData.data()
                            const key = crypto.scryptSync(secretKey, 'salt', 24)
                            const decipher = crypto.createDecipheriv(algorithm, key, buff)
                            var decrypted = decipher.update(fileDataObj["encryptedCID"], 'hex', 'utf8') + decipher.final('utf8')
                            var decLink = "https://ipfs.io/ipfs/"+decrypted
                            files.push({"uid":fileDataObj["uid"],"decryptedCID":decrypted})
                        }
                        return res.send({"name":data.data()["name"],"description":data.data()["description"],"files":files})
                    }catch(err){
                        if(err.code=="ERR_OSSL_BAD_DECRYPT")
                        return res.status(401).send({"error":"INVALID_KEY"})
                    }
                }
            }, 3000);
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const decryptCID = async(req, res, next) => {
    try{
        const {secretKey, encrypted} = req.body

        const key = crypto.scryptSync(secretKey, 'salt', 24)

        const decipher = crypto.createDecipheriv(algorithm, key, buff)
        var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
        return res.send({"CID":decrypted})
    }catch(err){
        if(err.code=="ERR_OSSL_BAD_DECRYPT")
        return res.status(401).send({"error":"INVALID_KEY"})
    }
}