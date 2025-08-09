import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";


interface GeneratedAvatarUriProps {
    seed: string;
    variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatarUri = ({seed, variant}: GeneratedAvatarUriProps) => {

    let avatar;
    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed,
        })
    } else {
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
        })
    }
    return avatar.toDataUri()
}
