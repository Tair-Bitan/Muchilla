import { useEffect, useState } from 'react'
import { GoogleMap, withScriptjs, withGoogleMap,Marker } from 'react-google-maps'

import {tripService} from '../services/trip-service'
import {Trip} from '../interfaces/Trip.interface'



const SimpleMap = () => {

    const [trips , setTrips] = useState([] as Trip[])

    useEffect(()=>{
        loadTrips()
    },[])

    const loadTrips = async () => {
        const trips = await tripService.query()
        setTrips(trips)
        console.log('trips', trips);
    }

    return (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lng: 86.727806, lat: 27.68566 }}
        >
            {trips.map((trip)=>{
                return (
                    <Marker key={trip._id} position={trip.loc.pos}  />
                )
            })}
        </GoogleMap>
    )
}

const WrappedMap:any = withScriptjs(withGoogleMap(SimpleMap))

export const OldMap = () => {

    return (
        <main style={{width: "100vw" , height: "90vh"}}>
           <WrappedMap 
           googleMapURL={`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap${'AIzaSyBuGyudMFY1EfPkbuk0mX8T24boNVeg664'}`}
           loadingElement={<div style={{height: "100%"}} />}
           containerElement={<div style={{height: "100%"}} />}
           mapElement={<div style={{height: "100%"}} />}
           />
        </main>
    )
}