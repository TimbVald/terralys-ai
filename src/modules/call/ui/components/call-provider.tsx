import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { GeneratedAvatarUri } from "@/lib/avatar";


interface Props {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const {data, isPending} = authClient.useSession();

    if (!data || isPending) {
        return (
            <div className="h-screen flex items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-8 text-white animate-spin" />
            </div>
        );
    }


    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id!}
            userName={data.user.name!}
            userImage={data.user.image ?? GeneratedAvatarUri({ seed: data.user.name, variant: 'initials' })}
        />
    )
}
