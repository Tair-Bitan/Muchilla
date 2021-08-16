import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { ActivityList } from "../cmps/ActivityList"
import { TripList } from "../cmps/TripList"
import { User } from "../interfaces/User.interface"
import { store } from "../stores/storeHelpers"

export const UserDetails = () => {

    const { userStore, tripStore } = store.useStore()
    const [user, setUser] = useState<User>()
    const params: { userId: string } = useParams()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    const loadUser = async () => {
        const userForDisplay = await userStore.getUserById(params.userId) as User
        setUser(userForDisplay)
    }

    const [tripSearch, setTripSearch] = useState('created')

    const getFirstName = () => {
        const names = user?.fullname.split(' ')
        return names![0]
    }

    const getUserTrips = (filterBy: string) => {
        switch (filterBy) {
            case 'created':
                return tripStore.trips.filter(trip => {
                    return trip.createdBy._id === user?._id
                })
            case 'joined':
                return tripStore.trips.filter(trip => {
                    return (
                        trip.createdBy._id !== user?._id &&
                        trip.members.some(member => member._id === user?._id)
                    )
                })
            case 'passed':
                //Will be implemnted when trip.dueDate is available
                // return tripStore.trips.filter(trip=>{
                //     return trip.dueDate < Date.now()
                // })
                return tripStore.trips.filter(trip => {
                    return trip.createdBy._id === user?._id
                })
            default:
                break;
        }
    }

    const { loggedInUser } = userStore
    if (!user || !loggedInUser) return <h1>loading..</h1>

    const follow = () => {
        console.log(loggedInUser.fullname, 'Now following', user.fullname);
        userStore.onFollowUser(loggedInUser._id, user._id, true)
    }
    const unfollow = () => {
        console.log(loggedInUser.fullname, 'unfollowing', user.fullname);
        userStore.onFollowUser(loggedInUser._id, user._id, false)
    }


    return (
        <div className="user-details-container main">
            <div className="cover-img-container landscape">
                <img className="cover-img" src={user?.imgUrl} alt="cover" />
            </div>
            <div className="user-info flex col align-center">
                <div className="profile-img-container square">
                    <img className="profile-img" src={user?.imgUrl} alt="profile" />
                </div>
                <h1>{user?.fullname}</h1>
                <div className="desc flex">
                    <div className="about flex col">
                        <h3>Who's {getFirstName()}?</h3>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit accusantium sit optio quis exercitationem nemo nisi, amet a perferendis sint at. Nobis cumque distinctio quidem aspernatur odio, laudantium eum in.</p>
                    </div>
                    <div className="actions flex col space-between">
                        {user.followed.includes(loggedInUser._id) ?
                            <button className={"main-btn following"} onClick={unfollow}>Unfollow</button> :
                            <button className={"main-btn"} onClick={follow}>Follow</button>
                        }
                        <div className="flex space-around">
                            <div className="trips">
                                <h3>{user.trips.length}</h3>
                                <p>Trips</p>
                            </div>
                            <div className="followers">
                                <h3>{user.followed.length}</h3>
                                <p>Followers</p>
                            </div>
                            <div className="followers">
                                <h3>{user.following.length}</h3>
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
            {loggedInUser?._id !== params.userId && <ActivityList activities={user.activities} />}
            {loggedInUser?._id === params.userId && <ActivityList activities={userStore.followActivities} />}
        </div>
    )


}