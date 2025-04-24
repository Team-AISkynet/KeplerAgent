import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { data } from '../lib/client'

type PropertyUpdate = data.ListPropertyUpdatesResponse['updates'][0]

interface PropertyTimelineProps {
  updates: PropertyUpdate[]
}

export default function PropertyTimeline({ updates }: PropertyTimelineProps) {
  return (
    <Card className='h-[calc(100vh-8rem)] bg-transparent border-none'>
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[calc(100vh-12rem)] pr-4'>
          <div className='space-y-4'>
            {updates.map((update, index) => (
              <div key={update.id} className='flex items-start space-x-4'>
                <div className='min-w-3 h-full'>
                  <div className='w-3 h-3 rounded-full bg-primary mt-1.5' />
                  {index < updates.length - 1 && <div className='w-0.5 h-12 bg-border mx-auto' />}
                </div>
                <div className='flex-1 pt-1'>
                  <p className='text-sm font-medium'>{update.property.address1} - Rent Update</p>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(update.updateDate).toLocaleDateString()} - £{update.oldRent.toLocaleString()} → £
                    {update.newRent.toLocaleString()}
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>Reason: {update.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
