export interface Trip {
    _id: string,
    createdAt: number,
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
        joinedAt: number
    }[]
}