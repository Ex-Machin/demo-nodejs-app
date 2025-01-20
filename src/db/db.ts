export type CourseType = {
    id: number
    title: string
    studentsCount: number
}

export type DbType = {
    courses: CourseType[]
}

export const db: DbType = {
    courses: [
        { id: 1, title: "front", studentsCount: 10},
        { id: 2, title: "backend", studentsCount: 10},
    ]
}

