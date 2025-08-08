"use client"

import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { NewMeetingDialog } from './new-meeting-dialog'
import { MeetingsSearchFilter } from './meetings-search-filter'
import { StatusFilter } from './status-filter'
import { AgentIdFilter } from './agent-id-filter'
import { useMeetingsFilters } from '../../hooks/use-meetings-filters'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DEFAULT_PAGE } from '@/constants'

export const MeetingListHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFilterModified = !!filters.status || !!filters.agentId || !!filters.search;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    })
  }


  return (
    <>
      <NewMeetingDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      />
      <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='font-medium text-xl'>
            My Meeting
          </h5>
          <Button onClick={() => {
            setIsOpen(true)
          }}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>

        <ScrollArea>
        <div className='flex items-center gap-x-2 p-1'>
          <MeetingsSearchFilter />
          <StatusFilter />
          <AgentIdFilter />
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </>
  )
}