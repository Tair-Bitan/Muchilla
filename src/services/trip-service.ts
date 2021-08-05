import usePlacesAutocomplete, { getDetails, getGeocode } from 'use-places-autocomplete';
import trips from "../data/trip.json"

import { storageService } from "./storage-service";
import { Trip } from "../interfaces/Trip.interface";


export const tripService = {
    query,
    getById,
    remove,
    update,
    getTripPhoto: setTripPhoto
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

async function setTripPhoto(trip: Trip) {
    const results = await getGeocode({ address: `${trip.loc.state}, ${trip.loc.city}` })
    const placeId = results[0].place_id
    const place: any = await getDetails({ placeId })
    trip.imgUrl = place.photos[0].getUrl()
    update(trip)
}

function _loadTrips(): void {
    gTrips = storageService.loadFromStorage(trips_KEY)
    if (!gTrips?.length) {
        gTrips = trips
        storageService.saveToStorage(trips_KEY, gTrips)
    }
}
