
import React, { ReactElement, useEffect, useState, } from 'react'
import { useParams } from "react-router-dom";
import { tripService } from '../services/trip-service';
import { Trip } from '../interfaces/Trip.interface'

interface Props {

}

export default function TripDetails({ }: Props): ReactElement {

    const [trip, setTrip] = useState({} as Trip)

    const params: { tripId: string } = useParams()

    useEffect(() => {
        loadTrip(params.tripId)
    }, [])

    const loadTrip = async (tripId: string) => {
        const trip: Trip = await tripService.getById(tripId)
        if (trip) {
            setTrip(trip)
        }
    }

    if (!trip) return <h1>loading...</h1>

    return (
        <main className="trip-details-container main-mini">
            <div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAcWl_v84bh6jiDX0IjHjUvPDhS8nRXZ7WPQ&usqp=CAU" alt="tripImg" />

                <div className="trip-info">
                    <div className="trip-info-header">
                        <div className="trip-type">
                            <img src={trip.typeImgUrl} alt={trip.type} />
                            <h3>{trip.type}</h3>
                        </div>
                        <h4>{new Date(trip.createdAt).toLocaleDateString()}</h4>
                    </div>
                    <div className="members-img-container">
                        {trip.members?.map(member => {
                            return <img src={member.imgUrl} alt="memberAvater"></img>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}
