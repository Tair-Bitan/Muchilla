import { Activity } from "../interfaces/Activity.interface"
import { ActivityPreview } from "./ActivityPreview"

interface Props {
    activities: Activity[] | null |undefined
}

export const ActivityList = ({ activities }: Props) => {
    if (!activities) return <h1>Loading Activities</h1>
    return (
        <div className="activity-list">
            <h3>Activities</h3>
            {activities.map(activity => {
                return (
                    <ActivityPreview key={activity._id} activity={activity} />
                )
            })}
        </div>
    )
}
