import React from 'react'
import { useApi } from '../components/ApiProvider'
import { data } from '../lib/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  address1: z.string().min(1, 'Address is required'),
  area: z.string().min(1, 'Area is required'),
  city: z.string().min(1, 'City is required'),
  developer: z.string().min(1, 'Developer is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  buyPrice: z.number().min(0, 'Buy price must be positive'),
  rentPrice: z.number().min(0, 'Rent price must be positive'),
  bedrooms: z.number().min(0, 'Number of bedrooms must be positive'),
  bathrooms: z.number().min(0, 'Number of bathrooms must be positive'),
  receptions: z.number().min(0, 'Number of receptions must be positive'),
  size: z.number().min(0, 'Size must be positive'),
})

interface PropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function PropertyModal({ isOpen, onClose, onSuccess }: PropertyModalProps) {
  const api = useApi()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address1: '',
      area: '',
      city: '',
      developer: '',
      purchaseDate: '',
      buyPrice: 0,
      rentPrice: 0,
      bedrooms: 0,
      bathrooms: 0,
      receptions: 0,
      size: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api?.data.createProperty(values as data.CreatePropertyParams)
      form.reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error creating property:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='address1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='area'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='developer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='purchaseDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='buyPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Price</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rentPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Price</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bedrooms'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bathrooms'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='receptions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receptions</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='size'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq ft)</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end space-x-2 pt-4'>
              <Button variant='outline' onClick={onClose} type='button'>
                Cancel
              </Button>
              <Button type='submit'>Add Property</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
