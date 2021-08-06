import { getDetails, getGeocode } from 'use-places-autocomplete';

import trips from "../data/trip.json"

import { storageService } from "./storage-service";
import { NewTrip, Trip } from "../interfaces/Trip.interface";
import { utils } from './utils';


export const tripService = {
    query,
    getById,
    add,
    remove,
    update,
    setTripPhoto
}

const trips_KEY = 'trips'

let gTrips: Trip[]
_loadTrips()

function query(filterBy?: any): Promise<Trip[]> {
    if (!filterBy) return Promise.resolve(gTrips)

    return Promise.resolve(gTrips)
}

function getById(tripId: string): Promise<Trip> {
    const trip = gTrips.find(trip => {
        return trip._id === tripId
    }) as Trip

    return Promise.resolve(trip)
}

async function add(tripToAdd: NewTrip): Promise<void> {
    const imgUrl = await setTripPhoto(tripToAdd)
    const trip: Trip = {
        _id: utils.makeId(),
        ...tripToAdd,
        imgUrl
    }

    gTrips.push(trip)
    storageService.saveToStorage(trips_KEY, gTrips)
}

function remove(tripId: string): void {
    const tripIdx = gTrips.findIndex(trip => {
        return trip._id === tripId
    })

    gTrips.splice(tripIdx, 1)
    storageService.saveToStorage(trips_KEY, gTrips)
}

async function update(updatedTrip: Trip): Promise<Trip> {
    const tripToUpdate = await getById(updatedTrip._id)
    const tripIdx = gTrips.findIndex(trip => {
        return trip._id === updatedTrip._id
    })

    gTrips[tripIdx] = tripToUpdate
    storageService.saveToStorage(trips_KEY, gTrips)

    return tripToUpdate
}

async function setTripPhoto(trip: Trip | NewTrip) {
    const results = await getGeocode({ address: `${trip.loc.state}, ${trip.loc.city}` })
    const placeId = results[0].place_id
    const place: any = await getDetails({ placeId })
    if (place?.photos) {
        return place.photos[0].getUrl()
    }
    return "https://www.marketing91.com/wp-content/uploads/2020/02/Definition-of-place-marketing.jpg"
}

function _loadTrips(): void {
    gTrips = storageService.loadFromStorage(trips_KEY)
    if (!gTrips?.length) {
        gTrips = trips
        storageService.saveToStorage(trips_KEY, gTrips)
    }
}
