import { ReactElement, useEffect, useState } from 'react'
import { Trip } from '../interfaces/Trip.interface'
import TripPreview from './TripPreview'

interface Props {
    setCoords: Function,
    loadedTrips: Trip[],
    onClickMarker: Function
}


export const TripList = ({ setCoords, loadedTrips, onClickMarker }: Props): ReactElement => {
    const [trips, setTrips] = useState<Trip[]>([])

    useEffect(() => {
        setTrips(loadedTrips)
    }, [loadedTrips])

    return (
        <section className='trip-list-container'>
            {trips.length ?
                <>
                    <h3>{trips.length} trips</h3>
                    <h1>trips {`in ${trips[0].loc.state}`}</h1>
                    {trips.map((trip) => {
                        return (
                            <TripPreview key={`preview-${trip._id}`} trip={trip} setCoords={setCoords} onClickMarker={onClickMarker} />
                        )
                    })}
                </>

                :
                <div className="trip-list-msg">
                    <h1>No trips found</h1>
                    <h3>Search for trips and locations</h3>
                    <h3>or click on the map to create new trip</h3>
                </div>

            }

        </section>
    )
}