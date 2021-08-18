import users from "../data/user.json"

import { utilService } from "./util-service";
import { storageService } from "./storage-service";
import { LoginCreds, SignupCreds } from "../interfaces/Creds.interface";
import { User } from "../interfaces/User.interface";
import userPic from "../assets/imgs/default-user.png"
import { Activity } from "../interfaces/Activity.interface";

export const userService = {
    query,
    login,
    logout,
    signup,
    checkIfTaken,
    getById,
    remove,
    update,
    getLoggedinUser,
    getEmptyCreds,
    getFollowUserActivities,
    followUser
}

const loggedInUser_KEY = 'loggedInUser'
const users_KEY = 'users'

let gUsers: User[]
_loadUsers()

function query(filterBy?: { username?: string }): Promise<User[]> {
    let queryUsers = gUsers.slice()
    if (!filterBy) return Promise.resolve(queryUsers)
    queryUsers = queryUsers.filter(user => {
        if (filterBy.username) {
            return user.username.includes(filterBy.username)
        } else {
            return true
        }
    })
    return Promise.resolve(queryUsers)
}

function login(creds: LoginCreds): Promise<string | User> {
    const user = gUsers.find(user => {
        return user.username === creds.username && user.password === creds.password
    }) as User

    if (!user) return Promise.reject('Incorrect username or password')

    _saveLocalUser(user)
    return Promise.resolve(user)
}

function logout(): Promise<null> {
    storageService.saveToStorage(loggedInUser_KEY, '')
    return Promise.resolve(null)
}

async function signup(creds: SignupCreds): Promise<string | User> {
    const isOccupied = await checkIfTaken(creds.username)
    if (isOccupied) {
        return Promise.reject(`${creds.username} is occupied, try another username`)
    }

    const user: User = {
        _id: `u-${utilService.makeId(6)}`,
        ...creds,
        interests: [],
        trips: [],
        activities: [],
        followers: [],
        following: []
    }

    gUsers.push(user)
    _saveLocalUser(user)
    storageService.saveToStorage(users_KEY, gUsers)

    return Promise.resolve(user)
}

function checkIfTaken(username: string): Promise<boolean> {
    const isOccupied = gUsers.some(user => user.username === username)
    return Promise.resolve(isOccupied)
}

function getById(userId: string): Promise<string | User> {
    const user = gUsers.find(user => {
        return user._id === userId
    })
    if (!user) return Promise.reject(`Err: Couldn't find user with the following id: ${userId} `)

    return Promise.resolve(user)
}

function remove(userId: string): Promise<null> {
    /*
    TODO:
     every user can remove himself, only admin can remove others 
     when deleting user, delete all of the trips he created or assign someone else
     notify every member in the trip that trip no longer exists
    */
    const userIdx = gUsers.findIndex(user => {
        return user._id === userId
    })

    gUsers.splice(userIdx, 1)
    storageService.saveToStorage(users_KEY, gUsers)

    return Promise.resolve(null)
}

async function update(updatedUser: User): Promise<string | User> {
    let userToUpdate
    let userIdx
    try {
        userToUpdate = await getById(updatedUser._id)
        userIdx = gUsers.findIndex(user => {
            return user._id === updatedUser._id
        })
        gUsers[userIdx] = updatedUser as User
        storageService.saveToStorage(users_KEY, gUsers)

        return Promise.resolve(userToUpdate) as Promise<User>

    } catch (error) {
        return Promise.reject(error)
    }
}

function getLoggedinUser(): User {
    var user = storageService.loadFromStorage(loggedInUser_KEY)
    return user
}

function getEmptyCreds(isLogin: boolean): LoginCreds | SignupCreds {
    if (isLogin) {
        return {
            username: '',
            password: ''
        }
    } else {
        return {
            username: '',
            password: '',
            fullname: '',
            email: '',
            imgUrl: userPic
        }
    }
}

function getFollowUserActivities(userId: string | null | undefined) {
    if (!userId) return
    let usersActivities: Activity[] = []
    gUsers.forEach(user => {
        if (user.followers.includes(userId)) {
            usersActivities = [...usersActivities, ...user.activities]
        }
    })
    return usersActivities.sort((activityA, activityB) => activityA.createdAt - activityB.createdAt)
}

async function followUser(userId: string, followerId: string, isFollow: boolean) {
    const user = getLoggedinUser()
    const follower = await getById(followerId) as User
    if (isFollow) {
        user.following.push(followerId)
        follower.followers.push(userId)
        await update(user)
        await update(follower)
        _saveLocalUser(user)
    } else {
        const followIdx = user.following.findIndex((id) => id === followerId)
        const userIdx = user.following.findIndex((id) => id === userId)
        user.following.splice(followIdx, 1)
        follower.followers.splice(userIdx, 1)
        await update(user)
        await update(follower)
        _saveLocalUser(user)
    }

}

function _saveLocalUser(user: User): void {
    storageService.saveToStorage(loggedInUser_KEY, user)
}

function _loadUsers(): void {
    gUsers = storageService.loadFromStorage(users_KEY)
    if (!gUsers?.length) {
        gUsers = users
        storageService.saveToStorage(users_KEY, gUsers)
    }
}