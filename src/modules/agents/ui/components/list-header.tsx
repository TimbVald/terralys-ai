"use client"
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { NewAgentDialog } from './new-agent-dialog'
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters'
import { AgentsSearchFilter } from './agents-search-filter'
import { DEFAULT_PAGE } from '@/constants'

export const AgentListHeader = () => {
  const [filters, setFilters] = useAgentsFilters()
  const [isOpen, setIsOpen] = useState(false)

  const isAnyFilterModified = !!filters.search

  const onClearFilters = () => {
    setFilters({
      search: '',
      page: DEFAULT_PAGE,
    })

  }

  return (
    <>
      <NewAgentDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      />
      <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='font-medium text-xl'>
            My Agent
          </h5>
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className='flex items-center gap-x-2 p-1'>
          <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  )
}