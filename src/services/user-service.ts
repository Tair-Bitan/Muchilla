import users from "../data/user.json"

import { utils } from "./utils";
import { storageService } from "./storage-service";
import { LoginCreds, SignupCreds } from "../interfaces/Creds.interface";
import { User } from "../interfaces/User.interface";

export const userService = {
    query,
    login,
    logout,
    signup,
    getById,
    remove,
    update,
    getLoggedinUser,
}

const loggedInUser_KEY = 'loggedInUser'
const users_KEY = 'users'

let gUsers: User[]
_loadUsers()

function query(filterBy?: any): Promise<User[]> {
    if (!filterBy) return Promise.resolve(gUsers)

    return Promise.resolve(gUsers)
}

function login(creds: LoginCreds): Promise<User> | Promise<string> {
    const user = gUsers.find(user => {
        return user.username === creds.username && user.password === creds.password
    }) as User

    if (!user) return Promise.resolve(`Err: No such user ${creds.username}`)

    _saveLocalUser(user)
    return Promise.resolve(user)
}

function logout(): void {
    storageService.saveToStorage(loggedInUser_KEY, '')
}

function signup(creds: SignupCreds): void {
    const user: User = {
        _id: utils.makeId(),
        ...creds,
        interests: [],
        trips: []
    }

    gUsers.push(user)
    storageService.saveToStorage(users_KEY, gUsers)
}

function getById(userId: string): Promise<User> {
    const user = gUsers.find(user => {
        return user._id === userId
    }) as User

    return Promise.resolve(user)
}

function remove(userId: string): void {
    const userIdx = gUsers.findIndex(user => {
        return user._id === userId
    })

    gUsers.splice(userIdx, 1)
    storageService.saveToStorage(users_KEY, gUsers)
}

async function update(updatedUser: User): Promise<User> {
    const userToUpdate = await getById(updatedUser._id)
    const userIdx = gUsers.findIndex(user => {
        return user._id === updatedUser._id
    })

    gUsers[userIdx] = userToUpdate
    storageService.saveToStorage(users_KEY, gUsers)

    return userToUpdate
}

function getLoggedinUser(): void {
    storageService.loadFromStorage(loggedInUser_KEY)
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