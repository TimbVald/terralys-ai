import { DEFAULT_PAGE } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryStates, parseAsInteger } from "nuqs";

export const useAgentsFilters = () => {
   return useQueryStates({
    search: parseAsString.withDefault('').withOptions({clearOnDefault: true}),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
   })
}
