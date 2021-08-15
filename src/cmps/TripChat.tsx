

import { faSmile } from '@fortawesome/free-regular-svg-icons'
import { faMicrophone, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, useEffect } from 'react'
import { useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import { MiniUser } from '../interfaces/User.interface'
import { useForm } from '../services/customHooks'
import { tripService } from '../services/trip-service'
import { store } from '../stores/storeHelpers'

interface Props {
    tripId: string
}

export const _TripChat = ({ tripId }: Props) => {

    const [trip, setTrip] = useState<Trip>()
    const [userMsg, handleChange] = useForm({ txt: '' })
    const { userStore, tripStore } = store.useStore()

    useEffect(() => {
        loadTrip(tripId)
    }, [tripId, tripStore.trips])

    const loadTrip = async (tripId: string) => {
        const trip = await tripService.getById(tripId) as Trip
        if (trip) setTrip(trip)
    }

    const onSendMsg = async () => {
        if (!trip) return
        const newMsg = {
            createdBy: userStore.miniUser as MiniUser,
            createdAt: Date.now(),
            txt
        }
        const updatedTrip = { ...trip }
        updatedTrip.chat?.push(newMsg)
        await tripStore.updateTrip(updatedTrip)
        handleChange({ target: { name: "txt", type: 'text', value: '' } } as ChangeEvent<HTMLInputElement>)
    }

    const { txt } = userMsg

    if (!trip) return <div>Loading...</div>
    return (
        <div className="trip-chat-container">
            <div className="chat-list">
                {trip.chat?.map(msg => {
                    return (
                        <div className="chat-msg" key={msg.createdBy.username + msg.createdAt}>
                            <img src={msg.createdBy.imgUrl} alt="user-avater" />
                            <div>
                                <h4 >{msg.createdBy.username}</h4>
                                <h3 >{msg.txt}</h3>
                                <h6>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(msg.createdAt)}</h6>
                            </div>
                        </div>
                    )
                })}

            </div>
            <div className="trip-chat-input">
                <button><FontAwesomeIcon icon={faMicrophone} /></button>
                <form onSubmit={(ev) => {
                    ev.preventDefault()
                    onSendMsg()
                }}>
                    <input
                        type="text"
                        name="txt"
                        autoComplete="off"
                        placeholder="what's on your mind?"
                        value={txt}
                        onChange={handleChange}
                    />
                </form>
                <button><FontAwesomeIcon icon={faPaperclip} /></button>
                <button><FontAwesomeIcon icon={faSmile} /></button>
            </div>

        </div>
    )
}

export const TripChat = observer(_TripChat)
