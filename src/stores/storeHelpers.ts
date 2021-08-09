import { createContext, useContext } from "react"
import { RootStore } from "./rootStore"

const createStore = () => {
    return new RootStore()
}

const StoreContext = createContext<RootStore>({} as RootStore)
const StoreProvider = StoreContext.Provider

const useStore = () => {
    return useContext(StoreContext)
}

export const store = {
    createStore,
    StoreContext,
    StoreProvider,
    useStore
}