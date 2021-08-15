

import { ReactElement } from 'react'
import { Trip } from '../interfaces/Trip.interface'

interface Props {
    trip: Trip
    setCoords?: Function,
    onClickMarker?: Function
}

export function TripPreview({ trip, setCoords, onClickMarker }: Props): ReactElement {
    const { _id, loc, type, typeImgUrl, createdAt, title, members } = trip

    const setLocation = (pos: { lat: number, lng: number }) => {
        if (setCoords) setCoords(pos)
    }

    return (
        <div className="trip-preview-container" onClick={() => {
            if (setCoords && onClickMarker) {
                setLocation(loc.pos)
                onClickMarker(trip._id)
            } else {
                window.location.hash = `/trip/${_id}`
            }
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



