import { MiniUser, User } from "../interfaces/User.interface"
import { FriendPreview } from "./FriendPreview"

interface Props {
    friends: MiniUser[]
}

export const FriendList = ({ friends }: Props) => {

    return (
        <div className="friend-list">
            {friends.map(friend => {
                return <FriendPreview key={friend._id} friend={friend} />
            })}
        </div>
    )
}
