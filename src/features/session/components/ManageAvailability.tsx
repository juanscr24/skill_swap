import { AvailabilitySchedule } from "@/features/profile"
import { AvailabilityManager, PendingRequestsList } from "./availability"


interface ManageAvailabilityProps {
    profile: {
        id: string
        skills: any[]
        role?: string
        availability?: any
    }
    isMentor: boolean
}

export const ManageAvailability = ({ profile, isMentor }: ManageAvailabilityProps) => {
    return (
        <>
            {isMentor && profile.id && (
                <>
                    <AvailabilityManager mentorId={profile.id} />
                    <PendingRequestsList />
                </>
            )}

            {!isMentor && <AvailabilitySchedule availability={profile.availability || undefined} />}
        </>
    )
}