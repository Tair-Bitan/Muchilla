
import React, { useEffect, useState } from 'react'
import { tripService } from "../services/trip-service"
import { TripData } from '../interfaces/tripData'
import { useForm } from '../services/customHooks'

interface Props {
    pos: { lat: number, lng: number }
    setIsModalOpen: Function
    closeBtn: Function
}

export const CreateTrip = ({ pos, setIsModalOpen, closeBtn }: Props) => {

    const [tripData, setTripData] = useState({} as TripData)

    const getLocationData = async () => {
        const locData = await tripService.getLocData(pos)
        setTripData(locData)
    }

    useEffect(() => {
        getLocationData()
    })


    const [tripInputs, handelChange] = useForm({
        title: '',
        desc: '',
        type: ''
    })

    const onCreateTrip = async (tripInputs: { title: string, desc: string, type: string }, tripData: TripData, pos: { lat: number, lng: number }) => {
        await tripService.add(tripInputs, tripData, pos)
        setIsModalOpen(false)
    }

    if (!tripData) return <div>Loading...</div>
    return (
        <div className="create-trip-modal">
            <button className="exit-btn" onClick={() => { setIsModalOpen(false) }}>X</button>
            <h1>create-trip</h1>
            {/* <h2>{`${pos.lat} - ${pos.lng}`}</h2> */}
            <h2>{tripData.formatted_address}</h2>

            <form onSubmit={(ev) => {
                ev.preventDefault()
                onCreateTrip(tripInputs, tripData, pos)
                closeBtn()
            }}>
                <label htmlFor="title">Trip title:</label>
                <input type="text" name="title" autoComplete="off" id="title" placeholder="Title" value={tripInputs.title} onChange={handelChange} />
                <label htmlFor="title">Trip description:</label>
                <input type="text" name="desc" autoComplete="off" id="desc" placeholder="Description" value={tripInputs.desc} onChange={handelChange} />
                <label htmlFor="title">Trip type:</label>
                <input list="type" type="text" name="type" id="type" placeholder="Type" value={tripInputs.type} onChange={handelChange}/>
                    <datalist id="type">
                        <option value="hiking">Hiking</option>
                        <option value="shopping">Shopping</option>
                        <option value="clubbing">Clubbing</option>
                    </datalist>
                <button className="main-btn">Create trip</button>
            </form>
        </div>
    )
}
