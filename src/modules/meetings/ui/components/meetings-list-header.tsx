"use client"

import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import { NewMeetingDialog } from './new-meeting-dialog'

export const MeetingListHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

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
        <div className='flex items-center gap-x-2 p-1'>
        
        </div>
      </div>
    </>
  )
}