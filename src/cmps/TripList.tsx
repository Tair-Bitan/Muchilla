import { ReactElement, useEffect, useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
// import { tripService } from '../services/trip-service'
import TripPreview from './TripPreview'

interface Props {
    setCoords: Function,
    loadedTrips: Trip[]
}


export const TripList = ({ setCoords, loadedTrips }: Props): ReactElement => {
    const [trips, setTrips] = useState<Trip[]>([])

    useEffect(() => {
        setTrips(loadedTrips)
    }, [loadedTrips])

    return (
        <section className='trip-list-container'>
            <h3>{trips.length} trips</h3>
            <h1>trips {trips.length ? `in ${trips[0].loc.state}` : 'worldwide'}</h1>

            {trips.length &&
                trips.map((trip) => {
                    return (
                        <TripPreview key={`preview-${trip._id}`} trip={trip} setCoords={setCoords} />
                    )
                })}

            {!trips.length  &&
                <div>
                    <h3>Search for trips and locations</h3>
                    <h4>or</h4>
                    <h3>click on the map to create new trip</h3>
                </div>

            }

        </section>
    )
}