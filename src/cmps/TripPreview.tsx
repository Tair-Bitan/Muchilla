

import React, { ReactElement } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import { MAP_API_KEY, PLACES_API_KEY } from '../keys'

interface Props {
    trip: Trip
}

export default function TripPreview({ trip }: Props): ReactElement {
    const { loc, type, typeImgUrl, createdAt, createdBy, members } = trip
    return (
        <div className="trip-preview-container">
           
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAcWl_v84bh6jiDX0IjHjUvPDhS8nRXZ7WPQ&usqp=CAU" alt="tripImg" />
         
            <div className="trip-info">
                <h4>{new Date(createdAt).toLocaleDateString()}</h4>
                <h2>{loc.city} , {loc.state}</h2>
                <div className="trip-type">
                    <img src={typeImgUrl} alt={type} />
                    <h3>{type}</h3>
                </div>
                <div className="members-img-container">
                    {members.map(member => {
                        return <img src={member.imgUrl} alt="memberAvater"></img>
                    })}
                </div>
            </div>

        </div>
    )
}



