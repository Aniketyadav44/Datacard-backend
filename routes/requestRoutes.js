import express from 'express'
import { requestFile, requestDataCard, decryptCID } from '../controllers/requestControllers.js'
import { authenticateKey } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/file', authenticateKey, requestFile)
router.post('/data-card', authenticateKey, requestDataCard)
router.post('/decrypt', authenticateKey, decryptCID)

export default router