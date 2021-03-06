
import React from 'react'
import { StationPreview } from './StationPreview'

interface Props {
    stations: ([{ _id: string, name: string, time: { day: string, hour: string }, pos: { lat: number, lng: number } }]) | any[],
    setCoords: React.Dispatch<React.SetStateAction<{
        lng: number;
        lat: number;
    }>>
}

export const StationList = ({ stations, setCoords }: Props) => {
    return (
        <div className="station-list">
            <h2>Trip stations</h2>
            {stations.map(station => <StationPreview key={`station-${Math.random()}`} station={station} setCoords={setCoords} />)}
        </div>
    )
}
