import request from "supertest"
import { app, HTTP_STATUSES } from "../../src"
import { CourseCreateModel } from "../../src/models/CourseCreateModel"
import { CourseUpdateModel } from "../../src/models/CourseUpdateModel"

describe("/course", () => {
    beforeAll(async () => {
        await request(app).delete("/__tests__/data")
    })

    it("should return 200 and empty array", async () => {
        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it("should return 200 for not existing course", async () => {
        await request(app)
            .get("/courses/99")
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("should not create with correct input data", async () => {
        const data: CourseCreateModel = { title: "" }

        await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [])
    })


    let createdCourse: any = null
    it("should create with correct input data", async () => {
        const data: CourseCreateModel = { title: "test" }
        const createResponse = await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse = createResponse.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: "test"
        })

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse])
    })

    it("should not update", async () => {
        await request(app)
            .post("/courses")
            .send(createdCourse)
            .expect(HTTP_STATUSES.CREATED_201)

        const data: CourseUpdateModel = { title: "" }

        await request(app)
            .put("/courses/" + 0)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it("should not update that not exist", async () => {
        const data: CourseUpdateModel = { title: "test" }

        await request(app)
            .put("/courses" + 2)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("should update", async () => {
        const data: CourseUpdateModel = { title: "new test" }

        await request(app)
            .put("/courses/" + createdCourse.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses/" + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse,
                title: data.title
            })
    })

    it("should delete", async () => {

        const data: CourseCreateModel = { title: "test" }

        await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        await request(app)
            .delete("/courses/" + 0)
            .expect(HTTP_STATUSES.OK_200)

        await request(app)
            .get("/courses/" + 0)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})