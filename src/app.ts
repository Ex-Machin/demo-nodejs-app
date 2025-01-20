import express from 'express'
import { db } from './db/db'
import { getCoursesRoutes, getInterestingRoutes } from './routes/courses'
import { getTestsRouter } from './routes/tests'

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.get('/', (req, res) => {
    res.send("Courses API")
})

app.use("/courses", getCoursesRoutes(db))
app.use("/interesting", getInterestingRoutes(db))
app.use("/__tests__", getTestsRouter(db))