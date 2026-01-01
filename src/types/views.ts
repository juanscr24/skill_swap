// Props para Views

export interface UserProfileViewProps {
  userId: string
}

export interface SessionDataView {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  host: {
    id: string
    name: string | null
    image: string | null
  }
  guest: {
    id: string
    name: string | null
    image: string | null
  }
}

export interface MatchRequestView {
  id: string
  senderId: string
  receiverId: string
  skill: string
  status: string | null
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
  receiver: {
    id: string
    name: string | null
    image: string | null
  } | null
}
