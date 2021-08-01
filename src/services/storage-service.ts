export const storageService = {
    loadFromStorage,
    saveToStorage
}

function saveToStorage<T>(key: string, val: T) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key: string) {
    var val = localStorage.getItem(key)!
    return JSON.parse(val)
}