export interface Trip {
    _id: string,
    createdAt: number,
    type: string,
    typeImgUrl: string,
    imgUrl?: string,
    createdBy: {
        _id: string,
        username: string,
        imgUrl: string
    },
    loc: {
        state: string,
        city: string,
        pos: {
            lng: number,
            lat: number
        }
    },
    members: {
        _id: string,
        username: string,
        imgUrl: string,
        joinedAt: number
    }[]
}

export type NewTrip = Omit<Trip, "_id" | "imgUrl">;