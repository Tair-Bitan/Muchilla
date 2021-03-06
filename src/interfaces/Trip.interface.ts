import { MiniUser } from "./User.interface";

export type NewTrip = Omit<Trip, "_id" | "imgUrl">;

export interface Trip {
    _id: string,
    createdAt: number,
    type: string,
    memberCount: number,
    typeImgUrl: string,
    imgUrl: string,
    title: string,
    desc?: string,
    chat?: ([{createdAt: number, txt: string, createdBy: MiniUser}]) | any[]
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
        },
        stations: ([{ _id: string, name: string, time: { day: string, hour: string }, pos: { lat: number, lng: number } }]) | any[]
    },
    members: {
        _id: string,
        username: string,
        imgUrl: string,
    }[]
}

export interface TripData {
    address_components?: []
    adr_address?: string
    formatted_address: string
    geometry?: any
    html_attributions?: []
    icon?: string
    icon_background_color?: string
    icon_mask_base_uri?: string
    name?: string
    place_id?: string
    reference?: string
    types?: string[]
    url?: string
    utc_offset?: any
    utc_offset_minutes?: number
    vicinity?: string
}

export interface TripInputs {
    title: string,
    desc: string,
    type: string,
    memberCount: number
}