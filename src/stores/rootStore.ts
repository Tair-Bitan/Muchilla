import { TripStore } from "./tripStore/tripStore";
import { UserStore } from "./userStore/userStore";

export class RootStore {
    tripStore: TripStore
    userStore: UserStore

    constructor() {
        this.tripStore = new TripStore(this)
        this.userStore = new UserStore(this)
    }
}