import { TripStore } from "./tripStore/tripStore";
import { UiStore } from "./uiStore/uiStore";
import { UserStore } from "./userStore/userStore";

export class RootStore {
    tripStore: TripStore
    userStore: UserStore
    uiStore: UiStore

    constructor() {
        this.tripStore = new TripStore(this)
        this.userStore = new UserStore(this)
        this.uiStore = new UiStore(this)
    }
}