import { useForm } from '../services/customHooks'
import { store } from '../stores/storeHelpers'
import { Trip } from '../interfaces/Trip.interface'
import { utilService } from '../services/util-service'

interface Props {
    stationPos: { lat: number, lng: number }
    trip: Trip
    setIsModalOpen: Function
    closeBtn: Function
}

export const CreateStation = ({ stationPos, trip, setIsModalOpen, closeBtn }: Props) => {
    const {tripStore } = store.useStore()
    const [stationInputs, handelChange] = useForm({ name: '', day: "0000-00-00", hour: "00:00" })

    const onAddStation = async (name: string, pos: { lat: number, lng: number }, day: string, hour: string) => {
        console.log(name, pos, day, hour);

        const tripToUpdate = { ...trip }
        tripToUpdate.loc.stations.push({ name, pos, time: { day, hour }, _id: `s-${utilService.makeId()}` })
        await tripStore.updateTrip(tripToUpdate)
    }

    const { name, day, hour } = stationInputs

    return (
        <div className="create-station-modal">
            <button className="exit-btn" onClick={() => {
                setIsModalOpen(false)
                closeBtn()
            }}>X</button>
            <h1>Add station</h1>
            <form onSubmit={(ev) => {
                ev.preventDefault()
                onAddStation(name, stationPos, day, hour)
                closeBtn()
                setIsModalOpen(false)
            }}>
                <label htmlFor="name">station name:</label>
                <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    autoFocus={true}
                    id="name"
                    placeholder="station name"
                    value={name}
                    onChange={handelChange}
                    required
                />
                <label htmlFor="day">Arrival date:</label>
                <div className="station-date-inputs-container">
                    <input
                        type="date"
                        name="day"
                        id="day"
                        value={day}
                        onChange={handelChange}
                        required
                    />
                    <input
                        type="time"
                        name="hour "
                        value={hour}
                        onChange={handelChange}
                        required
                    />
                </div>

                <button type="submit" className="main-btn">Add station</button>
            </form>
        </div>
    )
}
