import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api'
import React, { ReactElement, useCallback, useEffect, useRef, useState, } from 'react'
import { useParams } from "react-router-dom";
import { tripService } from '../services/trip-service';
import { Trip } from '../interfaces/Trip.interface'
import { store } from '../stores/storeHelpers'
import { User } from '../interfaces/User.interface';
import { MAP_API_KEY } from '../keys';
import { CreateStation } from '../cmps/CreateStation';
import { TripChat } from '../cmps/TripChat';
import { StationsList } from '../cmps/StationsList';
import { TripList } from '../cmps/TripList';

interface Props {

}

const libraries = ["places"] as any

export default function TripDetails({ }: Props): ReactElement {

    const params: { tripId: string } = useParams()
    const [trip, setTrip] = useState({} as Trip)
    const [isMember, setIsMember] = useState(false)
    const [map, setMap] = useState<GoogleMap>(null as any)
    const [coords, setCoords] = useState({ lng: 0, lat: 0 })
    const { tripStore, userStore } = store.useStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newTripBtnData, setNewTripBtnData] = useState({
        isOn: false,
        pos: { lat: 0, lng: 0 }
    })

    useEffect(() => {
        loadTrip(params.tripId)
    }, [params.tripId])

    const loadTrip = async (tripId: string) => {
        const trip = await tripService.getById(tripId) as Trip
        if (!trip) return
        setTrip(trip)
        setCoords(trip.loc?.pos)
        if (trip.members.some((member) => {
            return (member._id === userStore.loggedInUser?._id) ? true : false
        })) setIsMember(true)
    }

    const onAddMember = async (user: (User | null)) => {
        if (!user) return window.location.hash = '/login'
        const updatedTrip = {
            ...trip,
            members: [...trip.members, {
                _id: user._id,
                username: user.username,
                imgUrl: user.imgUrl
            }]
        }
        await tripStore.updateTrip(updatedTrip)
        loadTrip(updatedTrip._id)
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
    const onMapLoad = useCallback((googleMap) => {
        mapRef.current = googleMap
    }, [])

    const closeBtn = () => {
        setNewTripBtnData({
            isOn: false,
            pos: { lat: 0, lng: 0 }
        })
    }


    if (!trip || !trip.loc) return <h1>loading...</h1>
    if (loadError) return <div>got err</div>
    if (!isLoaded) return <div>loading...</div>

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
                    {trip.memberCount - trip.members.length ? <h3 className="members-count-msg">Open for {trip.memberCount - trip.members.length} more members</h3> : <h3 className="members-count-msg fully-booked">Fully booked</h3>}
                    <img src={trip.imgUrl} className="main-trip-img" alt="tripImg" />
                    <div className="trip-info">
                        <div className="trip-info-header">
                            <h4>{new Date(trip.createdAt).toLocaleDateString()}</h4>
                        </div>
                        <div className="members-img-container">
                            {trip.members?.map((member) => {
                                return <img key={`details-member-img-${member._id + Math.random()}`} src={member.imgUrl} alt="memberAvater" onClick={()=> window.location.hash = `user/${member._id}`}></img>
                            })}
                        </div>
                        <div className="trip-info-main">
                            <h3>{trip.desc}</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate debitis repudiandae deserunt itaque ullam cumque magnam culpa quas est neque! Ab iure ullam esse ipsum rem tempora et est modi odit, suscipit minima quaerat voluptate inventore doloribus possimus velit quas?</p>
                        </div>
                    </div>
                    {!isMember && <button className="main-btn join-btn" onClick={() => onAddMember(userStore.loggedInUser)}>Join</button>}
                    {isMember && <TripChat tripId={trip._id} />}
                </div>
                <div className="trip-details-right">
                    <h1>Nearby trips</h1>
                    <TripList loadedTrips={tripStore.nearbyTrips} />
                </div>
            </div>


            {isMember &&
                <div className="members-content-container">
                    <GoogleMap
                        onLoad={onMapLoad}
                        mapContainerClassName={'google-map-container trip-map'}
                        mapContainerStyle={{ width: '100vw', height: '90vh' }}
                        zoom={15}
                        center={coords}
                        options={options}
                        ref={GoogleMap => {
                            if (!GoogleMap) return
                            setMap(GoogleMap)
                        }}

                        onClick={(ev) => {
                            if (userStore.loggedInUser?._id !== trip.createdBy._id) return
                            setIsModalOpen(false)
                            const clickedPos = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
                            setNewTripBtnData({ isOn: true, pos: clickedPos })
                        }}
                    >

                        {trip.loc.stations.map((station) => {
                            return (
                                <Marker
                                    key={station._id}
                                    position={station.pos}
                                    onClick={() => {
                                        console.log('station clicked: ', station);
                                    }}
                                    title={`${station.time.day} - ${station.time.hour}`}
                                    label={station.name}
                                />
                            )
                        })}

                        {newTripBtnData.isOn && (
                            <InfoWindow
                                options={{ disableAutoPan: true, maxWidth: 250 }}
                                position={newTripBtnData.pos}
                                onCloseClick={closeBtn}
                            >
                                <button className="main-btn" onClick={() => {

                                    setIsModalOpen(true)

                                }}>Add station</button>
                            </InfoWindow>
                        )}

                        <StationsList stations={trip.loc.stations} setCoords={setCoords} />
                    </GoogleMap>


                </div>
            }

            {isModalOpen && <CreateStation stationPos={newTripBtnData.pos} trip={trip} setIsModalOpen={setIsModalOpen} closeBtn={closeBtn} />}

        </main>
    )
}
