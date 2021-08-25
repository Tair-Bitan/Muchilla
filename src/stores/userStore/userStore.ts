import { makeAutoObservable, runInAction } from "mobx";
import { LoginCreds, SignupCreds } from "../../interfaces/Creds.interface";

import { MiniUser, User } from "../../interfaces/User.interface";
import { userService } from "../../services/user-service";
import { RootStore } from "../rootStore";

export class UserStore {

    users: User[] = []
    loggedInUser: User | null = null
    currUser: ({
        user: User,
        followers: MiniUser[],
        following: MiniUser[],
    } | null) = null

    rootStore: RootStore
    status: 'pending' | 'done' | 'error' = 'pending'
    errMsg: string = ''

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        this.loadUsers()
        makeAutoObservable(this)
    }

    async query(searchStr?: string) {
        this._setNewReq()
        try {
            return await userService.query({ username: searchStr })

        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async loadUsers() {
        this._setNewReq()

        try {
            const users = await userService.query()
            runInAction(() => {
                this.users = users
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async loginUser(creds: LoginCreds) {
        this._setNewReq()

        try {
            const user = await userService.login(creds)
            runInAction(() => {
                this.loggedInUser = user as User
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
            throw error //expected: err will get cought in front - Login page
        }
    }

    async signupUser(creds: SignupCreds) {
        this._setNewReq()

        try {
            const user = await userService.signup(creds)
            runInAction(() => {
                this.loggedInUser = user as User
                this.status = 'done'
            })

        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
            throw error
        }
    }

    async logoutUser() {
        this._setNewReq()

        try {
            await userService.logout()
            runInAction(() => {
                this.loggedInUser = null
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async updateUser(updatedUser: User) {
        this._setNewReq()

        try {
            const user = await userService.update(updatedUser)
            runInAction(() => {
                this.loadUsers()
                this.loggedInUser = user as User
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async removeUser(userId: string) {
        this._setNewReq()

        try {
            await userService.remove(userId)
            runInAction(() => {
                if (this.loggedInUser?._id === userId) {
                    this.loggedInUser = null
                }
                this.loadUsers()
                this.status = 'done'
            })
        } catch (error) {
            runInAction(() => {
                this._setErr(error)
            })
        }
    }

    async getUserById(userId: string) {
        this._setNewReq()

        try {
            const user = await userService.getById(userId)
            this.status = 'done'
            return user
        } catch (error) {
            this._setErr(error)
        }

    }

    async checkIfTaken(username: string) {
        this._setNewReq()
        try {
            const isTaken = await userService.checkIfTaken(username)
            this.status = 'done'
            return isTaken
        } catch (error) {
            this._setErr(error)
        }
    }

    async onFollowUser(userId: string, followerId: string, isFollow: boolean) {
        this._setNewReq()

        try {
            await userService.followUser(userId, followerId, isFollow)
            this.setLoggedinUser()
        } catch (error) {
            this._setErr(error)
        }
    }

    setLoggedinUser() {
        this.loggedInUser = userService.getLoggedinUser()
    }

    getEmptyCreds(isLogin: boolean) {
        return userService.getEmptyCreds(isLogin)
    }

    async loadCurrUser(userId: string) {
        this._setNewReq()

        try {
            const user = await this.getUserById(userId) as User
            if (!user) return

            const followers = await Promise.all(user.followers.map(async (id) => {
                const follower = await this.getUserById(id) as User
                return {
                    _id: follower?._id,
                    username: follower?.username,
                    imgUrl: follower?.imgUrl
                }
            }))

            const following = await Promise.all(user.following.map(async (id) => {
                const followed = await this.getUserById(id) as User
                return {
                    _id: followed?._id,
                    username: followed?.username,
                    imgUrl: followed?.imgUrl
                }
            }))

            runInAction(() => {
                this.currUser = {
                    user,
                    followers,
                    following
                }
                this.status = 'done'
            })

        } catch (error) {
            this._setErr(error)
        }
    }

    get followActivities() {
        return userService.getFollowUserActivities(this.loggedInUser?._id)
    }

    get miniUser() {
        if (!this.loggedInUser) return null
        return {
            _id: this.loggedInUser._id,
            username: this.loggedInUser.username,
            imgUrl: this.loggedInUser.imgUrl
        }
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