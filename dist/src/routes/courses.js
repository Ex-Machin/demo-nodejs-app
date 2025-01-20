"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestingRoutes = exports.getCoursesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const getCourseViewModel = (db) => {
    return {
        id: db.id,
        title: db.title
    };
};
const getCoursesRoutes = (db) => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let found = db.courses;
        if (req.query.title) {
            found = found.filter(c => c.title.indexOf(req.query.title) !== -1);
        }
        res.json(found.map(getCourseViewModel));
    });
    router.get('/:id', (req, res) => {
        const found = db.courses.find(c => c.id === +req.params.id);
        if (!found) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(getCourseViewModel(found));
    });
    router.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        const newCourse = {
            id: db.courses.length + 1,
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(newCourse);
        res.status(utils_1.HTTP_STATUSES.CREATED_201).json(getCourseViewModel(newCourse));
    });
    router.delete('/:id', (req, res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id);
        res.json(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    router.put('/:id', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const found = db.courses.find(c => c.id === +req.params.id);
        if (!found) {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        found.title = req.body.title;
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    return router;
};
exports.getCoursesRoutes = getCoursesRoutes;
const getInterestingRoutes = (db) => {
    const router = express_1.default.Router();
    router.get('/:id([0-9]+)', (req, res) => {
        res.json({ title: "data by id" + req.params.id });
    });
    router.get('/books', (req, res) => {
        // @ts-ignore
        res.json({ title: "books" });
    });
    return router;
};
exports.getInterestingRoutes = getInterestingRoutes;
