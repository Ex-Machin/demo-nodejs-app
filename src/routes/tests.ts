import express, { Express } from "express"
import { DbType } from "../db/db"
import { HTTP_STATUSES } from "../utils"

export const getTestsRouter = (db: DbType) => {
    const router = express.Router()
    
    router.delete("/data", (req, res) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router
} 