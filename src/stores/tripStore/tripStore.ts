import { makeAutoObservable } from "mobx";

import trips from "../../data/trip.json"

import { Trip } from "../../interfaces/Trip.interface";
import { RootStore } from "../rootStore";

export class TripStore {
    trips: Trip[] = []
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

}