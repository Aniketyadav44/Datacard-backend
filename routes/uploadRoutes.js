import multer from 'multer'
import express from 'express'
import { uploadFile } from '../controllers/uploadControllers.js'
import { authenticateKey } from '../middlewares/authMiddleware.js'

const router = express.Router()
const uplaod = multer()

router.post('/file', authenticateKey, uplaod.single("file"), uploadFile)

export default router