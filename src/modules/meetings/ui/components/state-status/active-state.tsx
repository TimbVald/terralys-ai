import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    meetingId: string;
}

export const ActiveState =({meetingId}: Props) => {

    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
             image="/upcoming.svg"
             title="Réunion en cours"
             description="La réunion se terminera une fois que tous les participants auront quitté."
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
                <Button asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Rejoindre la réunion
                    </Link>
                </Button>
            </div>
        </div>
    )
}