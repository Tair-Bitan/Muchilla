import { ReactElement } from 'react'
import { Trip } from '../interfaces/Trip.interface'

interface Props {
    trip: Trip
}


export const TripDetails = ({ trip }: Props): ReactElement => {

    console.log(trip);

    if (!trip) return <div>loading...</div>
    return (
        <section className='trip-details-container'>

            <h1>{trip?.createdBy?.username}</h1>
            <h2>Creator</h2>
            <h3>Created At</h3>
            <h3>group</h3>

        </section>
    )
}