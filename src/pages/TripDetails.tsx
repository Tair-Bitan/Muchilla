
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
    }, [params.tripId])

    const loadTrip = async (tripId: string) => {
        const trip = await tripService.getById(tripId) as Trip
        if (trip) {
            setTrip(trip)
        }
    }

    if (!trip) return <h1>loading...</h1>

    return (
        <main className="trip-details-container main">
            <div>
                <div className="trip-details-left">
                    <img src={trip.imgUrl} className="main-trip-img" alt="tripImg" />

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
                                return <img key={`details-member-img-${member._id}`} src={member.imgUrl} alt="memberAvater"></img>
                            })}
                        </div>
                        <div className="trip-info-main">
                            <h2>{trip.loc.city} , {trip.loc.state}</h2>
                            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id iste minima veniam.</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                        </div>
                        <button className="main-btn join-btn">Join</button>
                    </div>
                </div>
                <div className="trip-details-right">
                    <h1>Nearby trips</h1>
                </div>


            </div>
        </main>
    )
}
