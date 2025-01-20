"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const utils_1 = require("../../src/utils");
describe("/course", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete("/__tests__/data");
    }));
    it("should return 200 and empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses")
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    it("should return 200 for not existing course", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses/99")
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("should not create with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: "" };
        yield (0, supertest_1.default)(app_1.app)
            .post("/courses")
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses")
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdCourse = null;
    it("should create with correct input data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: "test" };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post("/courses")
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdCourse = createResponse.body;
        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: "test"
        });
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses")
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdCourse]);
    }));
    it("should not update", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post("/courses")
            .send(createdCourse)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        const data = { title: "" };
        yield (0, supertest_1.default)(app_1.app)
            .put("/courses/" + 0)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    it("should not update that not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: "test" };
        yield (0, supertest_1.default)(app_1.app)
            .put("/courses" + 2)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it("should update", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: "new test" };
        yield (0, supertest_1.default)(app_1.app)
            .put("/courses/" + createdCourse.id)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses/" + createdCourse.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse), { title: data.title }));
    }));
    it("should delete", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: "test" };
        yield (0, supertest_1.default)(app_1.app)
            .post("/courses")
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        yield (0, supertest_1.default)(app_1.app)
            .delete("/courses/" + 0)
            .expect(utils_1.HTTP_STATUSES.OK_200);
        yield (0, supertest_1.default)(app_1.app)
            .get("/courses/" + 0)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
});
