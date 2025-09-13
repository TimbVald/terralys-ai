import Highlighter from "react-highlight-words"
import { format } from 'date-fns'
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedAvatarUri } from "@/lib/avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Props {
    meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
    const trpc = useTRPC()
    const { data } = useQuery(trpc.meeting.getTranscript.queryOptions({ meetingId }))

    const [searchQuery, setSearchQuery] = useState('')
    const filteredData = (data ?? []).filter((item) => item.text.toString().toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
            <p className="text-sm font-medium">Transcript</p>
            <div className="relative">
                <Input
                    placeholder="Search Transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[240px] pl-7 h-9"
                />
                <SearchIcon className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <ScrollArea>
                <div className="flex flex-col gap-y-4">
                    {filteredData.map((item) => {
                        return (
                            <div
                                key={item.start_ts}
                                className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
                            >
                                <div className="flex items-center gap-x-2">
                                    <Avatar className="size-6">
                                        <AvatarImage
                                            src={item.user.image ?? GeneratedAvatarUri({
                                                seed: item.user.name, variant: "initials"
                                            })}
                                            alt="User Avatar"
                                        />
                                    </Avatar>
                                    <p className="text-sm font-medium">{item.user.name}</p>
                                    <p className="text-sm text-blue-500 font-medium">
                                        {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), 'mm:ss')}
                                    </p>
                                </div>
                                <Highlighter
                                    className="text-sm text-neutral-700"
                                    highlightClassName="bg-yellow-200"
                                    searchWords={[searchQuery]}
                                    autoEscape={true}
                                    textToHighlight={item.text}
                                />
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}