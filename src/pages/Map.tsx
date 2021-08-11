import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useCallback, useEffect, useRef, useState } from 'react'

import { tripService } from '../services/trip-service'
import { Trip } from '../interfaces/Trip.interface'
import { MAP_API_KEY } from '../keys'
import { TripList } from '../cmps/TripList'
import { Search } from '../cmps/Search'
import { CreateTrip } from '../cmps/CreateTrip'
import { store } from '../stores/storeHelpers'
import { useHistory } from 'react-router'

const libraries = ["places"] as any

export const Map = () => {

    const { tripStore, userStore } = store.useStore()
    const [trips, setTrips] = useState<Trip[]>([])
    const [markers, setMarkers] = useState<any[]>([])
    const [selectedTrip, setSelectedTrip] = useState(null as any)
    const [coords, setCoords] = useState({ lng: 86.727806, lat: 27.68566 })
    const [newTripBtnData, setNewTripBtnData] = useState({
        isOn: false,
        pos: { lat: 0, lng: 0 }
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const history = useHistory()


    useEffect(() => {
        setTrips(tripStore.trips)
        const loadedMarkers = loadMarkers()

        setMarkers(loadedMarkers)
    }, [tripStore.trips])


    const loadMarkers = () => {
        return trips.map((trip) => {
            return (
                <Marker
                    key={`marker-${trip._id}`}
                    position={trip.loc.pos}
                    icon={{
                        url: trip.typeImgUrl,
                        scaledSize: new google.maps.Size(40, 40),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(20, 20)
                    }}
                    onClick={() => { onSelectTrip(trip._id) }}
                ></Marker>
            )
        })
    }

    const onSelectTrip = async (tripId: string | null) => {
        if (tripId) {
            const trip = await tripService.getById(tripId) as Trip
            setSelectedTrip(trip)
            setCoords(trip.loc.pos)
        } else {
            setSelectedTrip(null)
        }
    }

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY,
        libraries
    })

    const options = {
        disableDefaultUI: true,
        zoomControl: true
    }

    const mapRef = useRef()
    const onMapLoad = useCallback((map) => {
        mapRef.current = map
    }, [])

    const closeBtn = () => {
        setNewTripBtnData({
            isOn: false,
            pos: { lat: 0, lng: 0 }
        })
    }


    if (loadError) return <div>got err</div>
    if (!isLoaded) return <div>loading...</div>

    if (!trips || !trips.length) return <div>loading...</div>

    return (
        <main className='main map-container'>
            <TripList setCoords={setCoords} />

            <Search setCoords={setCoords} />

            <GoogleMap
                mapContainerClassName={'google-map-container'}
                mapContainerStyle={{ width: '50vw', height: '90vh' }}
                zoom={11}
                center={coords}
                options={options}

                onClick={(ev) => {
                    const clickedPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                    setNewTripBtnData({ isOn: true, pos: clickedPos })
                }}
                onLoad={onMapLoad}
            >

                {markers.map(marker => marker)}

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

                {newTripBtnData.isOn && (
                    <InfoWindow
                        options={{ disableAutoPan: true, maxWidth: 250 }}
                        position={newTripBtnData.pos}
                        onCloseClick={closeBtn}
                    >
                        <button className="main-btn" onClick={() => {
                            if (userStore.miniUser){
                                setIsModalOpen(true)
                            } else {history.push('/login')}
                        }}>Create new trip</button>
                    </InfoWindow>
                )}
            </GoogleMap>

            {isModalOpen && <CreateTrip pos={newTripBtnData.pos} setIsModalOpen={setIsModalOpen} closeBtn={closeBtn} />}
        </main>
    )
}