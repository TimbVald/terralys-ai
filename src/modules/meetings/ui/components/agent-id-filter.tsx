import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";


export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    const trpc = useTRPC()
    const [agentSearch, setAgentSearch] = useState("")
    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )

    return (
        <CommandSelect
            className="h-9"
            placeholder="Agent"
            options={(data?.items ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={agent.name}
                            className="size-4"
                        />
                        <span className="text-sm text-muted-foreground">
                            {agent.name}
                        </span>
                    </div>
                )
            }))}
            onSelect={(value) => setFilters({ agentId: value })}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ""}
        />
    )

}
