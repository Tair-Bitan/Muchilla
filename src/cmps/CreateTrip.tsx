import { useEffect, useState } from 'react'

import { tripService } from "../services/trip-service"
import { useForm } from '../services/customHooks'
import { MiniUser } from '../interfaces/User.interface'
import { TripInputs, TripData } from '../interfaces/Trip.interface'
import { store } from '../stores/storeHelpers'

interface Props {
    pos: { lat: number, lng: number }
    setIsModalOpen: Function
    closeBtn: Function
}

export const CreateTrip = ({ pos, setIsModalOpen, closeBtn }: Props) => {

    const { userStore, tripStore } = store.useStore()

    const [tripData, setTripData] = useState({} as TripData)
    const [loggedinUser, setLoggedinUser] = useState({} as MiniUser)

    const [tripInputs, handelChange] = useForm({ title: '', desc: '', type: '' })

    useEffect(() => {
        loadLocationData()
        setLoggedinUser(userStore.miniUser as MiniUser)
    },[])

    const loadLocationData = async () => {
        const locData = await tripService.getLocData(pos)
        setTripData(locData)
    }

    const onCreateTrip = async (tripInputs: TripInputs, tripData: TripData, pos: { lat: number, lng: number }) => {
        await tripService.add(loggedinUser, tripInputs, tripData, pos)
        setIsModalOpen(false)
    }

    if (!tripData) return <div>Loading...</div>

    const { formatted_address } = tripData
    const { title, desc, type } = tripInputs
    return (
        <div className="create-trip-modal">
            <button className="exit-btn" onClick={() => { setIsModalOpen(false) }}>X</button>
            <h1>create-trip</h1>
            <h2>{formatted_address}</h2>

            <form onSubmit={(ev) => {
                ev.preventDefault()
                onCreateTrip(tripInputs, tripData, pos)
                closeBtn()
            }}>
                <label htmlFor="title">Trip title:</label>
                <input
                    type="text"
                    name="title"
                    autoComplete="off"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={handelChange}
                />

                <label htmlFor="title">Trip description:</label>
                <input
                    type="text"
                    name="desc"
                    autoComplete="off"
                    id="desc"
                    placeholder="Description"
                    value={desc}
                    onChange={handelChange}
                />

                <label htmlFor="title">Trip type:</label>
                <input
                    list="type"
                    type="text"
                    name="type"
                    id="type"
                    placeholder="Type"
                    value={type}
                    onChange={handelChange}
                />

                <datalist id="type">
                    {/* TODO: Replace with possibleTypes.map()  */}
                    <option value="hiking">Hiking</option>
                    <option value="shopping">Shopping</option>
                    <option value="clubbing">Clubbing</option>
                </datalist>
                <button type="submit" className="main-btn">Create trip</button>
            </form>
        </div>
    )
}
