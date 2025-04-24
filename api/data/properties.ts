import { api } from 'encore.dev/api'
import { Prisma } from '@prisma/client'
import { prisma } from './database'

/**
 * Represents a property in the system
 * @interface Property
 */
interface Property {
  id: number
  address1: string
  area: string
  city: string
  purchaseDate: Date
  developer: string
  buyPrice: number
  rentPrice: number
  bedrooms: number
  bathrooms: number
  receptions: number
  size: number
  lastRentUpdate?: {
    updateDate: Date
    oldRent: number
    newRent: number
    reason: string
  } | null
}

/**
 * Response type for listing properties
 * @interface ListPropertiesResponse
 */
interface ListPropertiesResponse {
  properties: Property[]
}

/**
 * Response type for getting a single property
 * @interface GetPropertyResponse
 */
interface GetPropertyResponse {
  property: Property | null
}

/**
 * Represents the required parameters for creating a new property.
 * @interface CreatePropertyParams
 * @property {string} address1 - The primary address line of the property
 * @property {string} area - The area or neighborhood where the property is located
 * @property {string} city - The city where the property is located
 * @property {string} purchaseDate - The date when the property was purchased (ISO date string)
 * @property {string} developer - The name of the property developer
 * @property {number} buyPrice - The purchase price of the property
 * @property {number} rentPrice - The rental price of the property
 * @property {number} bedrooms - Number of bedrooms in the property
 * @property {number} bathrooms - Number of bathrooms in the property
 * @property {number} receptions - Number of reception rooms in the property
 * @property {number} size - The total size of the property in square feet/meters
 */
interface CreatePropertyParams {
  address1: string
  area: string
  city: string
  purchaseDate: string // ISO date string
  developer: string
  buyPrice: number
  rentPrice: number
  bedrooms: number
  bathrooms: number
  receptions: number
  size: number
}

/**
 * Represents the parameters for updating an existing property.
 * All fields except id are optional.
 * @typedef {Object} UpdatePropertyParams
 * @property {number} id - The unique identifier of the property to update
 * @property {Partial<Omit<CreatePropertyParams, 'id'>>} - Optional property fields to update
 */
type UpdatePropertyParams = {
  id: number
  reason: string
} & Partial<Omit<CreatePropertyParams, 'id'>>

/**
 * Response type for listing property updates
 * @interface ListPropertyUpdatesResponse
 */
interface ListPropertyUpdatesResponse {
  updates: {
    id: number
    propertyId: number
    updateDate: Date
    oldRent: number
    newRent: number
    reason: string
    property: {
      address1: string
      area: string
      city: string
    }
  }[]
}

/**
 * Creates a new property in the database.
 * @api {POST} /properties Create Property
 * @apiDescription Create a new property with the provided details
 * @param {CreatePropertyParams} params - The property details
 * @returns {Promise<Property>} The created property
 * @throws {Error} If required fields are missing or invalid
 */
export const createProperty = api(
  { method: 'POST', expose: true, path: '/api/properties' },
  async (params: CreatePropertyParams): Promise<Property> => {
    return await prisma.property.create({
      data: {
        ...params,
        purchaseDate: new Date(params.purchaseDate),
      },
    })
  }
)

/**
 * Retrieves all properties from the database.
 * @api {GET} /properties List Properties
 * @apiDescription Get a list of all properties
 * @returns {Promise<ListPropertiesResponse>} Object containing array of properties
 */
export const listProperties = api(
  { method: 'GET', expose: true, path: '/api/properties', tags: ['properties'] },
  async (): Promise<ListPropertiesResponse> => {
    const properties = await prisma.property.findMany({
      include: {
        ProperyUpdate: {
          orderBy: {
            updateDate: 'desc',
          },
          take: 1,
          select: {
            updateDate: true,
            oldRent: true,
            newRent: true,
            reason: true,
          },
        },
      },
    })

    // Transform the response to match our Property interface
    const transformedProperties = properties.map((property) => ({
      ...property,
      lastRentUpdate: property.ProperyUpdate[0] || null,
      ProperyUpdate: undefined, // Remove the original ProperyUpdate array
    }))

    return { properties: transformedProperties }
  }
)

/**
 * Retrieves a single property by its ID.
 * @api {GET} /properties/:id Get Property
 * @apiDescription Get a specific property by its ID
 * @param {Object} params - The route parameters
 * @param {number} params.id - The ID of the property to retrieve
 * @returns {Promise<GetPropertyResponse>} Object containing the property or null
 */
export const getProperty = api(
  { method: 'GET', path: '/api/properties/:id', expose: true, tags: ['properties'] },
  async ({ id }: { id: number }): Promise<GetPropertyResponse> => {
    const property = await prisma.property.findUnique({
      where: { id },
    })
    return { property }
  }
)

/**
 * Updates an existing property.
 * @api {PUT} /properties/:id Update Property
 * @apiDescription Update a specific property with new values
 * @param {UpdatePropertyParams} params - The update parameters
 * @returns {Promise<Property>} The updated property
 * @throws {Error} If the property is not found or if the update data is invalid
 */
export const updateProperty = api(
  { method: 'PUT', path: '/api/properties/:id', expose: true, tags: ['properties'] },
  async (params: UpdatePropertyParams): Promise<Property> => {
    const { id, reason, ...updateData } = params

    // Get the current property to check for rent changes
    const currentProperty = await prisma.property.findUnique({
      where: { id },
      select: { rentPrice: true },
    })

    if (!currentProperty) {
      throw new Error(`Property with id ${id} not found`)
    }

    const data: Prisma.PropertyUpdateInput = {
      ...updateData,
      ...(updateData.purchaseDate && {
        purchaseDate: new Date(updateData.purchaseDate),
      }),
    }

    // Use a transaction to ensure both updates happen atomically
    return await prisma.$transaction(async (tx) => {
      // If rent price is being updated, create a rent update record
      if (updateData.rentPrice !== undefined && updateData.rentPrice !== currentProperty.rentPrice) {
        await tx.properyRentUpdate.create({
          data: {
            propertyId: id,
            updateDate: new Date(),
            oldRent: currentProperty.rentPrice,
            newRent: updateData.rentPrice,
            reason: reason || 'No reason provided',
          },
        })
      }

      // Update the property
      return tx.property.update({
        where: { id },
        data,
      })
    })
  }
)

/**
 * Deletes a property from the database.
 * @api {DELETE} /properties/:id Delete Property
 * @apiDescription Permanently remove a property from the database
 * @param {Object} params - The route parameters
 * @param {number} params.id - The ID of the property to delete
 * @returns {Promise<Property>} The deleted property
 * @throws {Error} If the property is not found
 */
export const removeProperty = api(
  { method: 'DELETE', path: '/api/properties/:id', expose: true },
  async ({ id }: { id: number }): Promise<Property> => {
    return await prisma.property.delete({
      where: { id },
    })
  }
)

/**
 * Retrieves the last N property updates, ordered by update date.
 * @api {GET} /properties/updates List Property Updates
 * @apiDescription Get a list of recent property updates with an optional limit
 * @param {Object} params - The query parameters
 * @param {number} params.limit - Maximum number of updates to return (optional, defaults to 10)
 * @returns {Promise<ListPropertyUpdatesResponse>} Object containing array of property updates
 */
export const listPropertyUpdates = api(
  {
    method: 'GET',
    expose: true,
    path: '/api/properties/updates',
    tags: ['properties'],
  },
  async ({ limit = 10 }: { limit?: number }): Promise<ListPropertyUpdatesResponse> => {
    const updates = await prisma.properyRentUpdate.findMany({
      take: Math.min(Math.max(1, limit), 100), // Ensure limit is between 1 and 100
      orderBy: {
        updateDate: 'desc',
      },
      include: {
        property: {
          select: {
            address1: true,
            area: true,
            city: true,
          },
        },
      },
    })

    return { updates }
  }
)
