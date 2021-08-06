
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { useCallback, useEffect, useRef, useState } from 'react'


import { TripList } from '../cmps/TripList'
import { Trip } from '../interfaces/Trip.interface'
import { MAP_API_KEY } from '../keys'
import { tripService } from '../services/trip-service'
import { Search } from '../cmps/Search'


export const Map = () => {

    const [trips, setTrips] = useState([] as Trip[])
    const [selectedTrip, setSelectedTrip] = useState(null as any)
    const [coords, setCoords] = useState({ lng: 86.727806, lat: 27.68566 })


    useEffect(() => {
        loadTrips()
    }, [])

    const loadTrips = async () => {
        const trips = await tripService.query()
        setTrips(trips)
        console.log('trips', trips);
    }

    const onSelectTrip = async (tripId: string | null) => {
        if (tripId) {
            const trip = await tripService.getById(tripId)
            setSelectedTrip(trip)
            setCoords(trip.loc.pos)
        } else {
            setSelectedTrip(null)
        }
    }


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries: ["places"]
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
        <main className='main map-container'>
            <TripList setCoords={setCoords} />

            <Search setCoords={setCoords} />

            <GoogleMap
                mapContainerClassName={'google-map-container'}
                // onBoundsChanged={() => {
                //     console.log('Bounds Changed')
                // }}
                mapContainerStyle={{ width: '50vw', height: '90vh' }}
                zoom={13}
                center={coords}
                options={options}
                onClick={(ev) => {
                    const clickedPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                    console.log(clickedPos)
                }}
                onLoad={onMapLoad}>

                {trips.map((trip) => {
                    return (
                        <Marker
                            key={`marker-${trip._id}`}
                            position={trip.loc.pos}
                            // label={{
                            //     text: `${trip.members.length}`,
                            //     fontSize: '0.75rem',
                            //     fontWeight: '500',
                            //     className: 'marker-label'

                            // }}
                            icon={{
                                url: trip.typeImgUrl,
                                scaledSize: new google.maps.Size(40, 40),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(20, 20)
                            }}
                            onClick={() => { onSelectTrip(trip._id) }}

                        >

                        </Marker>
                    )
                })}

                {selectedTrip && (
                    <InfoWindow
                        options={{ disableAutoPan: true, maxWidth: 250 }}
                        position={selectedTrip.loc.pos}
                        onCloseClick={() => { onSelectTrip(null) }}

                    >
                        <div className="trip-info-window">
                            <img src={selectedTrip.imgUrl} alt="tripImg" />
                            <div className="trip-info">
                                <div>
                                    <img src={selectedTrip.typeImgUrl} alt="type-icon" />
                                    <h4>{new Date(selectedTrip.createdAt).toLocaleDateString()}</h4>
                                </div>
                                <h2>{selectedTrip.loc.city} , {selectedTrip.loc.state}</h2>
                                <div className="members-imgs">
                                    {selectedTrip.members.map((member: {
                                        "_id": string,
                                        "username": string,
                                        "imgUrl": string,
                                        "joinedAt": number
                                    }) => {
                                        return <img key={`info-member-img-${member._id}`} src={member.imgUrl} alt="memberAvater"></img>
                                    })}
                                </div>
                            </div>
                            <button onClick={() => { window.location.hash = `/trip/${selectedTrip._id}` }}>Join Now</button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

        </main>
    )
}