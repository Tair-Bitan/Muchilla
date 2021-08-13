import { useEffect, useState } from 'react'

import { useForm } from '../services/customHooks'
import { MiniUser } from '../interfaces/User.interface'
import { store } from '../stores/storeHelpers'
import { Trip } from '../interfaces/Trip.interface'

interface Props {
    stationPos: { lat: number, lng: number }
    trip: Trip
    setIsModalOpen: Function
    closeBtn: Function
}

export const CreateStation = ({ stationPos, trip, setIsModalOpen, closeBtn }: Props) => {
    const { userStore, tripStore } = store.useStore()
    const [loggedinUser, setLoggedinUser] = useState({} as MiniUser)
    const [stationInputs, handelChange] = useForm({ name: '' })
    useEffect(() => {
        setLoggedinUser(userStore.miniUser as MiniUser)
    }, [])

    const onAddStation = async (name: string, pos: { lat: number, lng: number }) => {
        console.log(name, pos);

        const tripToUpdate = { ...trip }
        tripToUpdate.loc.stations.push({ name, pos })
        await tripStore.updateTrip(tripToUpdate)
    }

    const { name } = stationInputs

    return (
        <div className="create-trip-modal">
            <button className="exit-btn" onClick={() => {
                setIsModalOpen(false)
                closeBtn()
            }}>X</button>
            <h1>Add station</h1>
            <form onSubmit={(ev) => {
                ev.preventDefault()
                onAddStation(name, stationPos)
                closeBtn()
                setIsModalOpen(false)
            }}>
                <label htmlFor="name">station name:</label>
                <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    autoFocus={true}
                    id="name"
                    placeholder="station name"
                    value={name}
                    onChange={handelChange}
                />

                <button type="submit" className="main-btn">Add station</button>
            </form>
        </div>
    )
}
