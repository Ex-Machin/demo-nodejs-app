"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const courses_1 = require("./routes/courses");
const tests_1 = require("./routes/tests");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.get('/', (req, res) => {
    res.send("Courses API");
});
exports.app.use("/courses", (0, courses_1.getCoursesRoutes)(db_1.db));
exports.app.use("/interesting", (0, courses_1.getInterestingRoutes)(db_1.db));
exports.app.use("/__tests__", (0, tests_1.getTestsRouter)(db_1.db));
