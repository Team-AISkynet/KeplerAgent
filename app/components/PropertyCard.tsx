import React, { useState } from 'react'
import { data } from '../lib/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Trash2, PencilIcon } from 'lucide-react'
import UpdateRentModal from './UpdateRentModal'

interface PropertyCardProps {
  property: data.Property
  onDelete?: (id: number) => void
  onUpdate?: () => void
}

export default function PropertyCard({ property, onDelete, onUpdate }: PropertyCardProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-semibold'>{property.address1}</CardTitle>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-primary'
            onClick={() => setIsUpdateModalOpen(true)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          {onDelete && (
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-destructive hover:dark:text-red-500'
              onClick={() => onDelete(property.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          {property.area}, {property.city}
        </p>
        <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
          <div>
            <span className='font-medium'>Buy Price:</span>{' '}
            <span className='text-muted-foreground'>£{property.buyPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className='font-medium'>Current Rent:</span>{' '}
            <span className='text-muted-foreground'>£{property.rentPrice.toLocaleString()}</span>
          </div>
          {property.lastRentUpdate && (
            <div className='col-span-2 mt-1 text-xs text-muted-foreground border-l-2 border-muted pl-2'>
              <p>
                Last update: £{property.lastRentUpdate.oldRent.toLocaleString()} → £
                {property.lastRentUpdate.newRent.toLocaleString()}
              </p>
              <p>Reason: {property.lastRentUpdate.reason}</p>
              <p>Date: {new Date(property.lastRentUpdate.updateDate).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <span className='font-medium'>Bedrooms:</span>{' '}
            <span className='text-muted-foreground'>{property.bedrooms}</span>
          </div>
          <div>
            <span className='font-medium'>Bathrooms:</span>{' '}
            <span className='text-muted-foreground'>{property.bathrooms}</span>
          </div>
          <div>
            <span className='font-medium'>Size:</span>{' '}
            <span className='text-muted-foreground'>{property.size} sq ft</span>
          </div>
          <div>
            <span className='font-medium'>Developer:</span>{' '}
            <span className='text-muted-foreground'>{property.developer}</span>
          </div>
        </div>
      </CardContent>
      <UpdateRentModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        property={property}
        onSuccess={onUpdate}
      />
    </Card>
  )
}
