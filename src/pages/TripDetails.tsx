
import React, { ReactElement, useEffect, useState, } from 'react'
import { useParams } from "react-router-dom";
import { tripService } from '../services/trip-service';
import { Trip } from '../interfaces/Trip.interface'
import { store } from '../stores/storeHelpers'

interface Props {

}

export default function TripDetails({ }: Props): ReactElement {

    const [trip, setTrip] = useState({} as Trip)

    const params: { tripId: string } = useParams()
    const { tripStore } = store.useStore()

    useEffect(() => {
        loadTrip(params.tripId)
    }, [params.tripId])

    const loadTrip = async (tripId: string) => {
        const trip = await tripService.getById(tripId) as Trip
        if (trip) {
            setTrip(trip)
        }
    }

    if (!trip || !trip.loc) return <h1>loading...</h1>

    return (
        <main className="trip-details-container main">
            <div>
                <div className="trip-details-left">
                    <div className="trip-details-header">
                        <h1>{trip.loc.city} , {trip.loc.state}</h1>
                        <div className="trip-type">
                            <img src={trip.typeImgUrl} alt={trip.type} />
                            <h3>{trip.type}</h3>
                        </div>
                    </div>
                    <img src={trip.imgUrl} className="main-trip-img" alt="tripImg" />

                    <div className="trip-info">
                        <div className="trip-info-header">

                            <h4>{new Date(trip.createdAt).toLocaleDateString()}</h4>
                        </div>
                        <div className="members-img-container">
                            {trip.members?.map(member => {
                                return <img key={`details-member-img-${member._id}`} src={member.imgUrl} alt="memberAvater"></img>
                            })}
                        </div>
                        <div className="trip-info-main">
                            <h3>{trip.desc}</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                        </div>
                        <button className="main-btn join-btn">Join</button>
                    </div>
                </div>
                <div className="trip-details-right">
                    <h1>Nearby trips</h1>
                    {tripStore.nearbyTrips.map(trip => {
                        return (
                            <div className="trip-preview-container" onClick={() => { window.location.hash = `/trip/${trip._id}` }}>

                                <img src={trip.imgUrl} alt="tripImg" />

                                <div className="trip-info">

                                    <h4>{new Date(trip.createdAt).toLocaleDateString()}</h4>
                                    <h3>{trip.title}</h3>
                                    <h2>{trip.loc.city} , {trip.loc.state}</h2>
                                    <div className="trip-type">
                                        <img src={trip.typeImgUrl} alt={trip.type} />
                                        <h3>{trip.type}</h3>
                                    </div>
                                    <div className="members-img-container">
                                        {trip.members.map(member => {
                                            return <img key={`trip-preview-member-${member._id}`} src={member.imgUrl} alt="memberAvater"></img>
                                        })}
                                    </div>
                                </div>

                            </div>
                        )
                    })}

                </div>


            </div>
        </main>
    )
}
