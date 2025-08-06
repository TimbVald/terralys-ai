"use client"
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import { NewAgentDialog } from './new-agent-dialog'

export const AgentListHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

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
      </div>
    </>
  )
}