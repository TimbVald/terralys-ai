import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"


export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilters()

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
