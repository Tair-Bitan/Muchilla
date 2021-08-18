import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "../rootStore";

export class UiStore {

    isFooterOn = true
    isScreenOn = false
    rootStore: RootStore
    status: 'pending' | 'done' | 'error' = 'pending'
    errMsg: string = ''

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this)
    }

    // async loadUsers() {
    //     this._setNewReq()

    //     try {
    //         const users = await userService.query()
    //         runInAction(() => {
    //             this.users = users
    //             this.status = 'done'
    //         })
    //     } catch (error) {
    //         runInAction(() => {
    //             this._setErr(error)
    //         })
    //     }
    // }

    setFooter(isFooterOn: boolean){
        this.isFooterOn = isFooterOn
    }

    setScreen(isScreenOn: boolean){
        this.isScreenOn = isScreenOn
    }

    private _setNewReq(): void {
        this.status = 'pending'
        this.errMsg = ''
    }

    private _setErr(error: string): void {
        this.status = 'error'
        this.errMsg = error
    }
}