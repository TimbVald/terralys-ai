'use client';

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";

export const AgentView = () => {
    const router = useRouter()
    const [filters, setFilters] = useAgentsFilters()
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
           <DataTable columns={columns} data={data.items} onRowClick={(row) => router.push(`/agents/${row.id}`)}/>

           <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page) => setFilters({page})} />
           {data.items.length === 0 && (
            <EmptyState title="No agents found" description="No agents have been created yet." />
           )}
        </div>
    )
}

export const AgentViewloading = () => {
    return (
        <LoadingState title="Loading agents" description="Please wait, this may take a few moments..." />
    )
}

export const AgentViewError = () => {
    return (
        <ErrorState title="Error loading agents" description="Please try again later." />
    )
}