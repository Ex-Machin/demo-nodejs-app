import express, { Response } from 'express'
import { CourseCreateModel } from './models/CourseCreateModel'
import { CourseUpdateModel } from './models/CourseUpdateModel'
import { CourseViewModel } from './models/CourseViewModel'
import { CourseGetQueryModel } from './models/CoursesGetQueryModel'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'
import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel'

export const app = express()
const port = process.env.PORT || 5000

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)


type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[] } = {
    courses: [
        { id: 1, title: "front", studentsCount: 10},
        { id: 2, title: "backend", studentsCount: 10},
    ]
}

const getCourseViewModel = (db: CourseType): CourseViewModel => {
    return {
        id: db.id,
        title: db.title
    }
}

app.get('/', (req, res) => {
    res.send("Courses API")
})

app.get('/courses', (req: RequestWithQuery<CourseGetQueryModel>, res: Response<CourseViewModel[]>) => {
    let found = db.courses;

    if (req.query.title) {
        found = found.filter(c => c.title.indexOf(req.query.title) !== -1)
    }

    res.json(found.map(getCourseViewModel))
})


app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    const found = db.courses.find(c => c.id === +req.params.id)

    if (!found) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getCourseViewModel(found))
})


app.post('/courses', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        return
    }

    const newCourse: CourseType = {
        id: db.courses.length + 1,
        title: req.body.title,
        studentsCount: 0
    }

    db.courses.push(newCourse)
    res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(newCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.json(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const found = db.courses.find(c => c.id === +req.params.id)

    if (!found) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    found.title = req.body.title
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete("/__tests__/data", (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})