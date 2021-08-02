export interface Trip {
    _id: string,
    createdAt: number,
    createdBy: {
        _id: string,
        username: string,
        imgUrl: string
    }
    loc: {
        state: string,
        city: string,
        pos: {
            lng: number,
            lat: number
        }
    },
    group: {
        _id: string,
        username: string,
        joinedAt: number
    }[]
}