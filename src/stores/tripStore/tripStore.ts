import { makeAutoObservable, runInAction } from "mobx";

import { Trip, TripData, TripInputs } from "../../interfaces/Trip.interface";
import { MiniUser } from "../../interfaces/User.interface";
import { tripService } from "../../services/trip-service";
import { RootStore } from "../rootStore";

export class TripStore {

    trips: Trip[] = []
    activeTrip: Trip | null = null
    nearbyTrips: Trip[] = []

    rootStore: RootStore
    status: 'pending' | 'done' | 'error' = 'pending'
    errMsg: string = ''

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        this.loadTrips()
        makeAutoObservable(this)
    }

    async query(searchStr?: string) {
        this._setNewReq()
        try {
            return await tripService.query(searchStr)

        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async loadTrips() {
        this._setNewReq()

        try {
            const trips = await tripService.query()
            runInAction(() => {
                this.trips = trips
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async setNearbyTrips(currTrips: Trip[]) {
        this._setNewReq()
        try {
            this.nearbyTrips = currTrips
            this.status = 'done'
        }
        catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async getTripById(tripId: string) {
        this._setNewReq()

        try {
            const trip = await tripService.getById(tripId)
            this.status = 'done'
            return trip
        } catch (error) {
            this._setErr(error)
        }

    }

    async updateTrip(updatedTrip: Trip) {
        this._setNewReq()

        try {
            await tripService.update(updatedTrip)

            runInAction(() => {
                this.loadTrips()
                this.status = 'done'
            })

        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async removeTrip(tripId: string) {
        this._setNewReq()

        try {
            await tripService.remove(tripId)
            runInAction(() => {
                this.loadTrips()
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async addTrip(loggedinUser: MiniUser, tripInputs: TripInputs, tripData: TripData, pos: { lat: number, lng: number }) {
        this._setNewReq()

        try {
            await tripService.add(loggedinUser, tripInputs, tripData, pos)
            runInAction(() => {
                this.loadTrips()
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    _setNewReq(): void {
        this.status = 'pending'
        this.errMsg = ''
    }

    _setErr(error: string): void {
        this.status = 'error'
        this.errMsg = error
    }
}