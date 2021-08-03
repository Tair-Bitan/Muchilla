import { ReactElement, useEffect, useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import { tripService } from '../services/trip-service'
import TripPreview from './TripPreview'

interface Props {
    // trip: Trip
}


export const TripList = ({}: Props): ReactElement => {
    const [trips, setTrips] = useState([] as Trip[])

    useEffect(() => {
        loadTrips()
    }, [])

    const loadTrips = async () => {
        const trips = await tripService.query()
        setTrips(trips)
        console.log('trips', trips);
    }

    if (!trips?.length) return <div>loading...</div>

    return (
        <section className='trip-list-container'>
            <h3>{trips.length} trips</h3>
            <h1>trips in ...</h1>
            
            {trips.map((trip)=>{
                return (
                    <TripPreview trip={trip}/>
                )
            })}

        </section>
    )
}