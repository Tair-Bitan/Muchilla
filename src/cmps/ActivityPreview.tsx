import { faEllipsisH, faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Activity } from "../interfaces/Activity.interface"

interface Props {
    activity: Activity
}


export const ActivityPreview = ({ activity }: Props) => {

    const getUrl = (): string => {
        switch (activity.type) {
            case 'join':
            case 'create':
                return `/trip/${activity.url}`
            case 'follow':
                return `/user/${activity.url}`
            default:
                return `/`
        }
    }

    return (
        <div className="activity-preview" onClick={() => { window.location.hash = getUrl() }}>
            <img src={activity.imgUrl} alt="activity avatar" />
            <div>
                <p>{new Date(activity.createdAt).toLocaleDateString()}</p>
                <h3>{activity.title}</h3>
                <h5>{activity.type}</h5>
            </div>
            <FontAwesomeIcon icon={faEllipsisH} />
        </div>
    )
}
