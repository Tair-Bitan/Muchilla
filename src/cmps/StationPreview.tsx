import React from 'react'

interface Props {
    station: { _id: string, name: string, time: { day: string, hour: string }, pos: { lat: number, lng: number } },
    setCoords: React.Dispatch<React.SetStateAction<{
        lng: number;
        lat: number;
    }>>
}

export const StationPreview = ({ station, setCoords }: Props) => {
    return (
        <div className="station-preview" onClick={() => setCoords(station.pos)}>
            <h3>{station.name}</h3>
            <div>
                <h4>{station.time.day}</h4>
                <h4>{station.time.hour}</h4>
            </div>
        </div>
    )
}
