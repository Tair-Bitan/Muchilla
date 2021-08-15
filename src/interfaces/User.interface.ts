import { Activity } from "./Activity.interface";

export interface User {
    _id: string,
    username: string,
    password: string,
    fullname: string,
    email: string,
    imgUrl: string,
    interests: string[] | [],
    trips: string[] | [],
    activities: Activity[]
}

export interface MiniUser {
    _id: string,
    username: string,
    imgUrl: string,
}