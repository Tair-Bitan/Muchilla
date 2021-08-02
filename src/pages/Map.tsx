
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TripDetails } from '../cmps/TripDetails'
import { Trip } from '../interfaces/Trip.interface'
import { MAP_API_KEY } from '../keys'
import { tripService } from '../services/trip-service'


export const Map = () => {

    const [trips, setTrips] = useState([] as Trip[])
    const [selectedTrip, setSelectedTrip] = useState({} as Trip)

    useEffect(() => {
        loadTrips()
    }, [])

    const loadTrips = async () => {
        const trips = await tripService.query()
        setTrips(trips)
        console.log('trips', trips);
    }

    const onSelectTrip = async (tripId: string) => {
        const trip = await tripService.getById(tripId)
        setSelectedTrip(trip)
    }

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        // libraries: ["places"]
    })

    const options = {
        disableDefaultUI: true,
        zoomControl: true
    }

    const mapRef = useRef()
    const onMapLoad = useCallback((map) => {
        mapRef.current = map
    }, [])

    if (loadError) return <div>got err</div>
    if (!isLoaded) return <div>loading...</div>

    if (!trips || !trips.length) return <div>loading...</div>

    return (
        <main className='map-container'>
            <GoogleMap
                mapContainerStyle={{ width: '50vw', height: '90vh' }}
                zoom={8}
                center={{ lng: 86.727806, lat: 27.68566 }}
                options={options}
                onClick={(ev) => {
                    const clickedPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                    console.log(clickedPos)
                }}
                onLoad={onMapLoad}>

                {trips.map((trip) => {
                    console.log(trip);

                    return (
                        <Marker
                            key={trip._id}
                            position={trip.loc.pos}
                            icon={{
                                url: trip.type,
                                scaledSize: new google.maps.Size(50, 50),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(25, 25)
                            }}
                            onClick={() => { onSelectTrip(trip._id) }}
                        />
                    )
                })}

            </GoogleMap>
            <TripDetails trip={selectedTrip} />
        </main>
    )
}