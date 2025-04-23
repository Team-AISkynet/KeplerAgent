import React from 'react'
import { useApi } from './ApiProvider'
import { data } from '../lib/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  rentPrice: z.number().min(0, 'Rent price must be positive'),
  reason: z.string().min(1, 'Reason is required'),
})

interface UpdateRentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  property: data.Property
}

export default function UpdateRentModal({ isOpen, onClose, onSuccess, property }: UpdateRentModalProps) {
  const api = useApi()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rentPrice: property.rentPrice,
      reason: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api?.data.updateProperty(property.id, {
        rentPrice: values.rentPrice,
        reason: values.reason,
      })
      form.reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating property rent:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>Update Rent Price</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='rentPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Rent Price</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g., Market adjustment, Property improvements' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2 pt-4'>
              <Button variant='outline' onClick={onClose} type='button'>
                Cancel
              </Button>
              <Button type='submit'>Update Rent</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
