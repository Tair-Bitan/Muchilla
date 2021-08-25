import { observer } from 'mobx-react-lite'
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { ActivityList } from "../cmps/ActivityList"
import { FriendList } from '../cmps/FriendList'
import { TripList } from "../cmps/TripList"
import { User } from "../interfaces/User.interface"
import { store } from "../stores/storeHelpers"

const _UserDetails = () => {
    // export const UserDetails = () => {

    const { userStore, tripStore } = store.useStore()
    const [tripSearch, setTripSearch] = useState('created')
    const [isFollowers, setIsFollowers] = useState<boolean>(true)
    const [user, setUser] = useState<User>()
    const params: { userId: string } = useParams()

    const { loggedInUser, followActivities } = userStore

    const follow = async () => {
        if (!loggedInUser || !user) return
        await userStore.onFollowUser(loggedInUser._id, user._id, true)
    }

    const unfollow = async () => {
        if (!loggedInUser || !user) return
        await userStore.onFollowUser(loggedInUser._id, user._id, false)
    }

    useEffect(() => {
        loadUser()
        userStore.loadCurrUser(params.userId)
    }, [params.userId, loggedInUser?.following, user])

    const loadUser = async () => {
        const userForDisplay = await userStore.getUserById(params.userId) as User
        setUser(userForDisplay)
    }

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

    if (!user || !loggedInUser) return <h1>loading..</h1>
    return (
        <div className="user-details-container main">
            <div className="cover-img-container landscape">
                <img className="cover-img" src={user?.imgUrl} alt="cover" />
            </div>
            <div className="user-info">
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
                        {loggedInUser.following.includes(user._id) ?
                            <button className={"main-btn following"} onClick={unfollow}>Unfollow</button> :
                            <button className={"main-btn"} onClick={follow}>Follow</button>
                        }
                        <div className="flex space-around">
                            <div className="trips">
                                <h3>{user.trips.length}</h3>
                                <p>Trips</p>
                            </div>
                            <div className="followers">
                                <h3>{user.followers.length}</h3>
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
            <div className="main-content">
                <div className="user-details-left">
                    <div className="user-trips">
                        <h3>Trips</h3>
                        <div className="tabs">
                            <h4 className={tripSearch === 'created' ? 'selected': ''} onClick={() => { setTripSearch('created') }}>Created</h4>
                            <h4 className={tripSearch === 'joined' ? 'selected': ''} onClick={() => { setTripSearch('joined') }}>Joined</h4>
                            <h4 className={tripSearch === 'passed' ? 'selected': ''} onClick={() => { setTripSearch('passed') }}>Passed</h4>
                        </div>
                        <TripList loadedTrips={getUserTrips(tripSearch)!} />
                    </div>
                    <div className="user-friends">
                        <h3>Friends</h3>
                        <div className="tabs">
                            <h4 className={!isFollowers ? 'selected' : ''} onClick={() => { setIsFollowers(false) }}>Following</h4>
                            <h4 className={isFollowers ? 'selected' : ''} onClick={() => { setIsFollowers(true) }}>Followers</h4>
                        </div>
                        {userStore.currUser && isFollowers && <FriendList friends={userStore.currUser.followers} />}
                        {userStore.currUser && !isFollowers && <FriendList friends={userStore.currUser.following} />}

                    </div>
                </div>
                <div className="user-details-right">
                    {loggedInUser?._id !== params.userId && <ActivityList activities={user.activities} />}
                    {loggedInUser?._id === params.userId && <ActivityList activities={followActivities} />}
                </div>
            </div>
        </div>
    )
}

export const UserDetails = observer(_UserDetails)