import { useTRPC } from "@/trpc/client";
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CallUI } from "./call-ui";


interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
    const trpc = useTRPC();
    const {mutateAsync: generateToken} = useMutation(trpc.meeting.generateToken.mutationOptions());

    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        try {
            console.log('Initialisation du client Stream Video:', {
                apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY ? 'Définie' : 'Manquante',
                userId,
                userName
            });

            const _client = new StreamVideoClient({
                apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
                user: {
                    id: userId,
                    name: userName,
                    image: userImage,
                },
                tokenProvider: generateToken,
            });

            setClient(_client);
            console.log('Client Stream Video initialisé avec succès');

            return () => {
                console.log('Déconnexion du client Stream Video');
                _client.disconnectUser();
                setClient(undefined);
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du client Stream Video:', error);
        }
        
    }, [userId, userName, userImage, generateToken])

    const [call, setCall] = useState<Call>();

    useEffect(() => {
        if (!client) {
            return;
        }

        const _call = client.call('default', meetingId);
        _call.camera.disable();
        _call.microphone.disable();
        setCall(_call);

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall();
                setCall(undefined)
            }
        }
    }, [client, meetingId])

    if (!client || !call){
        return (
            <div className="h-screen flex items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <StreamVideo client={client}>
           <StreamCall call={call}>
            <CallUI meetingName={meetingName} />
           </StreamCall>
        </StreamVideo>
    )
}
