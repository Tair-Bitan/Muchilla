import { MiniUser, User } from "../interfaces/User.interface"

interface Props {
    friend: MiniUser
}

export const FriendPreview = ({ friend }: Props) => {



    return (
        <div className="friend-preview">
            <img src={friend.imgUrl} alt="friend" />
        </div>
    )
}
