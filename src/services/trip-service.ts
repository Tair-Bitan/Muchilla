import { getDetails, getGeocode } from 'use-places-autocomplete';

import trips from "../data/trip.json"

import { utilService } from './util-service';
import { storageService } from "./storage-service";
import { NewTrip, Trip, TripData, TripInputs } from "../interfaces/Trip.interface";
import { MiniUser } from '../interfaces/User.interface';

export const tripService = {
    query,
    getById,
    add,
    remove,
    update,
    getLocData,
    getPossibleTypes
}

const trips_KEY = 'trips'

let gTrips: Trip[]
_loadTrips()

function query(filterBy?: any): Promise<Trip[]> {
    if (!filterBy) return Promise.resolve(gTrips)

    return Promise.resolve(gTrips)
}

function getById(tripId: string): Promise<string | Trip> {
    const trip = gTrips.find(trip => {
        return trip._id === tripId
    })
    if (!trip) return Promise.reject(`Err: Couldn't find trip with the following id: ${tripId} `)

    return Promise.resolve(trip)
}

async function add(user: MiniUser, tripInputs: TripInputs, tripData: TripData, pos: { lat: number, lng: number }): Promise<Trip> {
    const formattedTrip = _formatTrip(user, tripInputs, tripData, pos)
    const imgUrl = await _getTripPhoto(formattedTrip)

    const trip: Trip = {
        ...formattedTrip,
        imgUrl
    }

    gTrips.push(trip)
    storageService.saveToStorage(trips_KEY, gTrips)

    return Promise.resolve(trip)
}

function remove(tripId: string): Promise<null> {
    /*
   TODO:
    only trip creator can remove trip
    when deleting trip, delete the trip from all users
    notify every member in the trip that trip no longer exists
   */
    const tripIdx = gTrips.findIndex(trip => {
        return trip._id === tripId
    })

    gTrips.splice(tripIdx, 1)
    storageService.saveToStorage(trips_KEY, gTrips)

    return Promise.resolve(null)
}

async function update(updatedTrip: Trip): Promise<string | Trip> {
    let tripIdx
    try {
        tripIdx = gTrips.findIndex(trip => {
            return trip._id === updatedTrip._id
        })
        gTrips[tripIdx] = updatedTrip as Trip
        storageService.saveToStorage(trips_KEY, gTrips)

        return Promise.resolve(updatedTrip) as Promise<Trip>

    } catch (error) {
        return Promise.reject(error)
    }
}

async function getLocData(loc: { lat: number, lng: number }) {
    const results = await getGeocode({ location: loc })
    const placeId = results[0].place_id
    const place: any = await getDetails({ placeId })
    return (place) ? place : null
}

function getPossibleTypes() {
    return ['hiking', 'shopping', 'clubbing']
}

function _formatTrip(user: MiniUser, tripInputs: TripInputs, tripData: TripData, pos: { lat: number, lng: number }) {
    const { desc, type, title, memberCount } = tripInputs
    const { lat, lng } = pos
    const addresses: string[] = tripData.formatted_address.split(',')

    return {
        _id: `t-${utilService.makeId(6)}`,
        createdAt: Date.now(),
        type,
        memberCount,
        typeImgUrl: _getTypeImgUrl(type),
        title,
        desc,
        createdBy: user,
        loc: {
            state: addresses[addresses.length - 1],
            city: addresses[addresses.length - 2],
            pos: {
                lng,
                lat
            },
            stations:[]
        },
        members: [user]
    }
}

async function _getTripPhoto(trip: Trip | NewTrip) {
    const results = await getGeocode({ address: `${trip.loc.state}, ${trip.loc.city}` })
    const placeId = results[0].place_id
    const place: any = await getDetails({ placeId })
    if (place?.photos) {
        return place.photos[0].getUrl()
    }
    return "https://www.marketing91.com/wp-content/uploads/2020/02/Definition-of-place-marketing.jpg"
}

function _getTypeImgUrl(type: string) {
    switch (type) {
        case 'hiking':
            return "https://image.flaticon.com/icons/png/512/71/71423.png"
        case 'shopping':
            return "https://image.flaticon.com/icons/png/512/253/253298.png"
        case 'clubbing':
            return "https://image.flaticon.com/icons/png/512/937/937367.png"
        default:
            return "https://image.flaticon.com/icons/png/512/5097/5097702.png"
    }
}

function _loadTrips(): void {
    gTrips = storageService.loadFromStorage(trips_KEY)
    if (!gTrips?.length) {
        gTrips = trips
        storageService.saveToStorage(trips_KEY, gTrips)
    }
}