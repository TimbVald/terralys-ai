import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./show-state/call-lobby";
import { CallActive } from "./show-state/call-active";
import { CallEnded } from "./show-state/call-ended";

interface Props {
    meetingName: string;
}

export const CallUI = ({meetingName}: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () => {
        if (!call) {
            console.error('Aucun appel disponible pour rejoindre');
            return;
        }

        try {
            console.log('Tentative de connexion à l\'appel:', call.id);
            await call.join();
            console.log('Connexion à l\'appel réussie');
            setShow("call");
        } catch (error) {
            console.error('Erreur lors de la connexion à l\'appel:', {
                error,
                callId: call.id,
                callState: call.state,
                message: error instanceof Error ? error.message : 'Erreur inconnue'
            });
            // Optionnel: afficher un message d'erreur à l'utilisateur
            alert('Impossible de rejoindre l\'appel. Vérifiez votre connexion et réessayez.');
        }
    };

    const handleLeave = () => {
        if (!call) return;
        call.endCall();
        setShow("ended");
    };

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && (
                    <CallLobby onJoin={handleJoin} />
            )}
            {show === "call" && (
                   <CallActive onLeave={handleLeave} meetingName={meetingName} />
            )}
            {show === "ended" && (
                    <CallEnded />
            )}
        </StreamTheme>

    )
}