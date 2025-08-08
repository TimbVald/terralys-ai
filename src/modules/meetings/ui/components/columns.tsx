"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, ClockFadingIcon, CornerDownRightIcon, LoaderIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import humanizeDuration from "humanize-duration"
import { cn } from "@/lib/utils"

function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        units: ["h", "m", "s"],
        round: true,
    })
}

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon
}

const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/50",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/50",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/50",
    processing: "bg-purple-500/20 text-purple-800 border-purple-800/50",
    cancelled: "bg-red-500/20 text-red-800 border-red-800/50"
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold capitalize">
                    {row.original.name}
                </span>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                    <CornerDownRightIcon className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                        {row.original.agent.name}
                    </span>
                    </div>
                    <GeneratedAvatar
                        variant="botttsNeutral"
                        seed={row.original.agent.name}
                        className="size-4"
                    />
                    <span className="text-sm text-muted-foreground">
                        {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]

            return (
                <Badge variant="outline"
                    className={cn(
                        "capitalize [&>svg]:size-4 text-muted-foreground",
                        statusColorMap[row.original.status as keyof typeof statusColorMap]
                    )} 
                >
                    <Icon 
                        className={cn(
                            row.original.status === "processing" && "animate-spin"
                        )}
                    />
                    {row.original.status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({row}) => (
            <Badge variant="outline"
            className={cn(
                        "capitalize [&>svg]:size-4 text-muted-foreground",
                        statusColorMap[row.original.status as keyof typeof statusColorMap]
                    )} 
            >
                <ClockFadingIcon className="text-blue-700" />
                {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
            </Badge>
        )

    }
]