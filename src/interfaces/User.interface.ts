export interface User {
    _id: string,
    username: string,
    password: string,
    fullname: string,
    email: string,
    imgUrl: string,
    interests: string[] | [],
    trips: string[] | [],
}

export interface MiniUser {
    _id: string,
    username: string,
    imgUrl: string,
}