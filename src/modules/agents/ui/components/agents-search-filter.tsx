import { Input } from "@/components/ui/input"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { SearchIcon } from "lucide-react"


export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters()

  return (
    <div className="relative">
        <Input
            placeholder="Filter by name"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="h-9 bg-white w-[200px] pl-7"
        />
        <SearchIcon className="absolute top-1/2 left-2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
    </div>
  )
}
