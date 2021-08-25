import { useEffect, useState } from 'react'
import { tripService } from "../services/trip-service"
import { useForm } from '../services/customHooks'
import { MiniUser } from '../interfaces/User.interface'
import { TripInputs, TripData } from '../interfaces/Trip.interface'
import { store } from '../stores/storeHelpers'
import { observer } from 'mobx-react-lite'

interface Props {
    pos: { lat: number, lng: number }
    setIsModalOpen: Function
    closeBtn: Function
}

export const _CreateTrip = ({ pos, setIsModalOpen, closeBtn }: Props) => {

    const { userStore, tripStore } = store.useStore()
    const [selectedType, setSelectedType] = useState<string>('hiking')
    const [memberCount, setMemberCount] = useState<number>(2)
    const [tripData, setTripData] = useState({} as TripData)
    const [loggedinUser, setLoggedinUser] = useState({} as MiniUser)

    const [tripInputs, handelChange] = useForm({ title: '', desc: '', type: '', memberCount: 2 })

    useEffect(() => {
        loadLocationData()
        setLoggedinUser(userStore.miniUser as MiniUser)
    }, [])

    const loadLocationData = async () => {
        const locData = await tripService.getLocData(pos)
        setTripData(locData)
    }

    const onCreateTrip = async (tripInputs: TripInputs, tripData: TripData, pos: { lat: number, lng: number }) => {
        tripInputs.memberCount = memberCount
        tripInputs.type = selectedType
        await tripStore.addTrip(loggedinUser, tripInputs, tripData, pos)
        setIsModalOpen(false)
    }

    const onChangeMemberCount = (diff: number) => {
        if (memberCount + diff > 10 || memberCount + diff < 2) return
        setMemberCount(memberCount + diff)
    }

    if (!tripData) return <div>Loading...</div>

    const { formatted_address } = tripData
    const { title, desc, type } = tripInputs
    return (
        <div className="create-trip-modal">
            <button className="exit-btn" onClick={() => { setIsModalOpen(false) }}>X</button>
            <h1>create-trip</h1>
            <h2>{formatted_address}</h2>

            <form onSubmit={(ev) => {
                ev.preventDefault()
                onCreateTrip(tripInputs, tripData, pos)
                closeBtn()
            }}>
                <label htmlFor="title">Trip title:</label>
                <input
                    type="text"
                    name="title"
                    autoComplete="off"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={handelChange}
                />

                <label htmlFor="title">Trip description:</label>
                <input
                    type="text"
                    name="desc"
                    autoComplete="off"
                    id="desc"
                    placeholder="Description"
                    value={desc}
                    onChange={handelChange}
                />

                <label htmlFor="type">Type: </label>
                <div id="type" className="trip-icons-container">
                    {tripService.getPossibleTypes().map((type) => <img
                        className={selectedType === type ? "trip-icon selected" : "trip-icon"}
                        key={type + Math.random()}
                        src={tripService.getTypeImgUrl(type)}
                        onClick={() => setSelectedType(type)}
                    />)}
                </div>

                {/* <label htmlFor="title">Trip type:</label>
                <input
                    list="type"
                    type="text"
                    name="type"
                    id="type"
                    placeholder="Type"
                    value={type}
                    onChange={handelChange}
                />

                <datalist id="type">
                    {tripService.getPossibleTypes().map((type, idx) => <option key={type + idx} value={type}>{type}</option>)}
                </datalist> */}

                {/* <label htmlFor="memberCount">Members: {memberCount}</label>
                <input
                    type="range"
                    id="memberCount"
                    name="memberCount"
                    min={2}
                    max={10}
                    value={memberCount}
                    onChange={handelChange}
                /> */}

                <label htmlFor="member-count">Members: </label>
                <div id="member-count" className="members-count-picker">
                    <button type="button" onClick={() => onChangeMemberCount(-1)}>-</button>
                    <p>{memberCount}</p>
                    <button type="button" onClick={() => onChangeMemberCount(1)}>+</button>
                </div>

                <button type="submit" className="main-btn create-trip-btn">Create trip</button>
            </form>
        </div>
    )
}

export const CreateTrip = observer(_CreateTrip)
