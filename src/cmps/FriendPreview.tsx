import { User } from "../interfaces/User.interface"

interface Props {
    friend: User
}

export const FriendPreview = ({ friend }: Props) => {



    return (
        <div className="friend-preview">
            <h3>{friend.fullname}</h3>
        </div>
    )
}
