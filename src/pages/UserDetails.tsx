import { useState } from "react"
import { TripList } from "../cmps/TripList"
import { store } from "../stores/storeHelpers"

export const UserDetails = () => {

    const { userStore, tripStore } = store.useStore()

    const [tripSearch, setTripSearch] = useState('created')

    const getFirstName = () => {
        const names = loggedInUser?.fullname.split(' ')
        return names![0]
    }

    const getUserTrips = (filterBy: string) => {

        switch (filterBy) {
            case 'created':
                return tripStore.trips.filter(trip => {
                    return trip.createdBy._id === loggedInUser?._id
                })
            case 'joined':
                return tripStore.trips.filter(trip => {
                    return (
                        trip.createdBy._id !== loggedInUser?._id &&
                        trip.members.some(member => member._id === loggedInUser?._id)
                    )
                })
            case 'passed':
                //Will be implemnted when trip.dueDate is available
                // return tripStore.trips.filter(trip=>{
                //     return trip.dueDate < Date.now()
                // })
                return tripStore.trips.filter(trip => {
                    return trip.createdBy._id === loggedInUser?._id
                })
            default:
                break;
        }
    }


    const { loggedInUser } = userStore
    if (!loggedInUser) return <h1>loading..</h1>
    return (
        <div className="user-details-container main">
            <div className="cover-img-container landscape">
                <img className="cover-img" src={loggedInUser?.imgUrl} alt="cover" />
            </div>
            <div className="user-info flex col align-center">
                <div className="profile-img-container square">
                    <img className="profile-img" src={loggedInUser?.imgUrl} alt="profile" />
                </div>
                <h1>{loggedInUser?.fullname}</h1>
                <div className="desc flex">
                    <div className="about flex col">
                        <h3>Who's {getFirstName()}?</h3>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit accusantium sit optio quis exercitationem nemo nisi, amet a perferendis sint at. Nobis cumque distinctio quidem aspernatur odio, laudantium eum in.</p>
                    </div>
                    <div className="actions flex col space-between">
                        <button className="main-btn">Follow</button>
                        <div className="flex space-around">
                            <div className="trips">
                                <h3>{loggedInUser?.trips.length}</h3>
                                <p>Trips</p>
                            </div>
                            <div className="followers">
                                <h3>3</h3>
                                <p>Followers</p>
                            </div>
                            <div className="followers">
                                <h3>5</h3>
                                <p>Following</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-trips">
                <h3>Trips</h3>
                <div className="flex">
                    <h4 onClick={() => { setTripSearch('created') }}>Created</h4>
                    <h4 onClick={() => { setTripSearch('joined') }}>Joined</h4>
                    <h4 onClick={() => { setTripSearch('passed') }}>Passed</h4>
                </div>
                <TripList loadedTrips={getUserTrips(tripSearch)!} />
            </div>
        </div>
    )


}