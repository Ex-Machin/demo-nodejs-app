import express from 'express'

export const app = express()
const port = process.env.PORT || 5000

export const HTTP_STATUSES = {
    OK_200 : 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
    courses: [
        { id: 1, title: "front" },
        { id: 2, title: "backend" },
    ]
}

app.get('/', (req, res) => {
    res.send("Test")
})

app.get('/courses/:id', (req, res) => {
    const found = db.courses.find(c => c.id === +req.params.id)

    if (!found) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(found)
})

app.get('/courses', (req, res) => {
    let found = db.courses;
    
    if (req.query.title as string) {
        found = found.filter(c => c.title.indexOf(req.query.title as string) !== -1)
    }

    res.json(found)
})
app.post('/courses', (req, res) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        
        return
    }

    const newCourse = {
        id: db.courses.length + 1,
        title: req.body.title
    }
    
    db.courses.push(newCourse)
    res.status(HTTP_STATUSES.CREATED_201).send(newCourse)
})

app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.json(HTTP_STATUSES.NO_CONTENT_204)
})


app.put('/courses/:id', (req, res) => {
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