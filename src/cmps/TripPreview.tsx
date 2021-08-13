

import { ReactElement, useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import { MAP_API_KEY } from '../keys'
import { tripService } from '../services/trip-service'

interface Props {
    trip: Trip
    setCoords: Function,
    onClickMarker:Function
}

export default function TripPreview({ trip, setCoords,onClickMarker }: Props): ReactElement {
    const { loc, type, typeImgUrl, createdAt, title, members } = trip

    const setLocation = (pos: { lat: number, lng: number }) => {
        setCoords(pos)
    }

    return (
        <div className="trip-preview-container" onClick={() => {
            setLocation(loc.pos)
            onClickMarker(trip._id)
            }}>

            <img src={trip.imgUrl} alt="tripImg" />

            <div className="trip-info">

                <h4>{new Date(createdAt).toLocaleDateString()}</h4>
                <h3>{title}</h3>
                <h2>{loc.city} , {loc.state}</h2>
                <div className="trip-type">
                    <img src={typeImgUrl} alt={type} />
                    <h3>{type}</h3>
                </div>
                <div className="members-img-container">
                    {members.map(member => {
                        return <img key={`trip-preview-member-${member._id}`} src={member.imgUrl} alt="memberAvater"></img>
                    })}
                </div>
            </div>

        </div>
    )
}



