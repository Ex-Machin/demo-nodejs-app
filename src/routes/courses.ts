import express, { Response } from "express";
import { CourseType, DbType } from "../db/db";
import { CourseCreateModel } from '../models/CourseCreateModel';
import { CourseUpdateModel } from '../models/CourseUpdateModel';
import { CourseViewModel } from "../models/CourseViewModel";
import { CourseGetQueryModel } from '../models/CoursesGetQueryModel';
import { URIParamsCourseIdModel } from '../models/URIParamsCourseIdModel';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types';
import { HTTP_STATUSES } from "../utils";


const getCourseViewModel = (db: CourseType): CourseViewModel => {
    return {
        id: db.id,
        title: db.title
    }
}

export const getCoursesRoutes = (db: DbType) => {
    const router = express.Router()

    router.get('/', (req: RequestWithQuery<CourseGetQueryModel>, res: Response<CourseViewModel[]>) => {
        let found = db.courses;

        if (req.query.title) {
            found = found.filter(c => c.title.indexOf(req.query.title) !== -1)
        }

        res.json(found.map(getCourseViewModel))
    })

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
        const found = db.courses.find(c => c.id === +req.params.id)

        if (!found) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(getCourseViewModel(found))
    })

    router.post('/', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {

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

    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.json(HTTP_STATUSES.NO_CONTENT_204)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>, res) => {
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

    return router
}

export const getInterestingRoutes = (db: DbType) => {
    const router = express.Router()

    router.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
        res.json({title: "data by id" +req.params.id })
    })

    router.get('/books', (req, res: Response<CourseViewModel[]>) => {
        // @ts-ignore
        res.json({title: "books"})
    })

    return router
}