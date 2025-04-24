import React, { useEffect, useState } from 'react'
import { data } from '../lib/client'
import PropertyCard from '../components/PropertyCard'
import PropertyModal from '../components/PropertyModal'
import PropertyTimeline from '../components/PropertyTimeline'
import { useApi } from '../components/ApiProvider'
import { Button } from '../components/ui/button'

type PropertyUpdate = data.ListPropertyUpdatesResponse['updates'][0]

export default function Properties() {
  const api = useApi()
  const [properties, setProperties] = useState<data.Property[]>([])
  const [propertyUpdates, setPropertyUpdates] = useState<PropertyUpdate[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchProperties = async () => {
    try {
      const response = await api?.data.listProperties()
      setProperties(response?.properties ?? [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchPropertyUpdates = async () => {
    try {
      const response = await api?.data.listPropertyUpdates({ limit: 15 })
      setPropertyUpdates(response?.updates ?? [])
    } catch (error) {
      console.error('Error fetching property updates:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api?.data.removeProperty(id)
        await fetchProperties()
        await fetchPropertyUpdates()
      } catch (error) {
        console.error('Error deleting property:', error)
      }
    }
  }

  useEffect(() => {
    if (!api) return
    fetchProperties()
    fetchPropertyUpdates()
  }, [api])

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Portfolio</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Property</Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        <div className='lg:col-span-3'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onDelete={handleDelete} />
            ))}
          </div>
        </div>
        <div className='lg:col-span-1'>
          <PropertyTimeline updates={propertyUpdates} />
        </div>
      </div>

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async () => {
          await fetchProperties()
          await fetchPropertyUpdates()
        }}
      />
    </div>
  )
}
