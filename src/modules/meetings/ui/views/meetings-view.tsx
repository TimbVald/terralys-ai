"use client"

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter()
    const [filters, setFilters] = useMeetingsFilters();

    const {data} = useSuspenseQuery(trpc.meeting.getMany.queryOptions({
        ...filters,
    }))
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={columns}
                data={data.items}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination 
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({page})}
            />
            {data.items.length === 0 && (
            <EmptyState title="Créez votre première réunion" description="Planifiez une réunion pour vous connecter avec d'autres personnes. Chaque réunion vous permet de collaborer, partager des idées et interagir avec les participants en temps réel." />
           )}
        </div>
    )
}

export const MeetingViewloading = () => {
    return (
        <LoadingState title="Chargement des réunions" description="Veuillez patienter, cela peut prendre quelques instants..." />
    )
}

export const MeetingViewError = () => {
    return (
        <ErrorState title="Erreur lors du chargement des réunions" description="Veuillez réessayer plus tard." />
    )
}