import { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { useState } from 'react';

export const SimpleMap = () => {
    const [loc, setLoc] = useState({
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    })


    return (
       
        <div style={{ height: '90vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBuGyudMFY1EfPkbuk0mX8T24boNVeg664' }}
                defaultCenter={loc.center}
                defaultZoom={loc.zoom}
            >

            </GoogleMapReact>
        </div>
    );
}

