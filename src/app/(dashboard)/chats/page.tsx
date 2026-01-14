import { Suspense } from "react";
import { ChatPage } from "@/features/chat/components/ChatPage";
import { LoadingSpinner } from "@/shared/components";

export default function Chats() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen />}>
            <ChatPage />
        </Suspense>
    )
}
