import { ReactElement, useEffect, useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import { tripService } from '../services/trip-service'
import TripPreview from './TripPreview'

interface Props {
    setCoords: Function
}


export const TripList = ({ setCoords }: Props): ReactElement => {
    const [trips, setTrips] = useState([] as Trip[])

    useEffect(() => {
        loadTrips()
    }, [trips])

    const loadTrips = async () => {
        const trips = await tripService.query()
        setTrips(trips)
    }

    if (!trips?.length) return <div>loading...</div>

    return (
        <section className='trip-list-container'>
            <h3>{trips.length} trips</h3>
            <h1>trips worldwide</h1>

            {trips.map((trip) => {
                return (
                    <TripPreview key={`preview-${trip._id}`} trip={trip} setCoords={setCoords} />
                )
            })}

        </section>
    )
}