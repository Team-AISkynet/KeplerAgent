# Database Schema Documentation

## Overview

This document outlines the database schema design for storing GeoJSON polygon and multipolygon data using PostgreSQL with PostGIS extension and Prisma as the ORM.

## Prerequisites

- PostgreSQL database
- PostGIS extension
- Prisma ORM

### PostGIS Setup

Before using the schema, ensure PostGIS extension is installed in your PostgreSQL database:

```sql
CREATE EXTENSION postgis;
```

## Schema Definition

### Area Model

The `Area` model represents geographic areas with their properties and geometric data.

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Area {
  id             Int      @id @default(autoincrement())
  name           String
  country        String
  emirate        String?
  grouping       String?
  parentGrouping String?
  geometry       Unsupported("geometry(MultiPolygon,4326)")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([geometry], type: Gist)
}
```

#### Field Descriptions

- `id`: Unique identifier for the area
- `name`: Name of the geographic area
- `country`: Country where the area is located
- `emirate`: Emirate (optional)
- `grouping`: Grouping category (optional)
- `parentGrouping`: Parent grouping category (optional)
- `geometry`: PostGIS geometric data type for storing MultiPolygon data
- `createdAt`: Timestamp of record creation
- `updatedAt`: Timestamp of last update

#### Important Notes

1. The `geometry` field uses SRID 4326 (WGS84), which is the standard coordinate system used by GPS and GeoJSON
2. A GiST (Generalized Search Tree) index is created on the geometry column for optimal spatial query performance

## Usage Examples

### Inserting Data

Convert GeoJSON to PostGIS format when inserting data:

```typescript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createArea(geojsonFeature) {
  const area = await prisma.$queryRaw`
    INSERT INTO "Area" (
      name,
      country,
      emirate,
      grouping,
      "parentGrouping",
      geometry
    ) VALUES (
      ${geojsonFeature.properties.Name},
      ${geojsonFeature.properties.Country},
      ${geojsonFeature.properties.Emirate},
      ${geojsonFeature.properties.Grouping},
      ${geojsonFeature.properties.Parent_Grouping},
      ST_GeomFromGeoJSON(${JSON.stringify(geojsonFeature.geometry)})
    )
  `
  return area
}
```

### Geometric Queries

#### Finding Areas Within a Distance

```typescript
const nearbyAreas = await prisma.$queryRaw`
  SELECT * FROM "Area"
  WHERE ST_DWithin(
    geometry::geography,
    ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
    ${distanceInMeters}
  );
`
```

#### Finding Intersecting Areas

```typescript
const intersectingAreas = await prisma.$queryRaw`
  SELECT * FROM "Area"
  WHERE ST_Intersects(
    geometry,
    ST_GeomFromText(${wktPolygon}, 4326)
  );
`
```

### Data Validation

Validate geometric data before insertion:

```typescript
async function validateGeometry(geojson) {
  const isValid = await prisma.$queryRaw`
    SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(geojson)}))
  `
  return isValid
}
```

### Converting to GeoJSON

Convert PostGIS geometries back to GeoJSON format:

```typescript
const areasAsGeoJSON = await prisma.$queryRaw`
  SELECT
    id,
    name,
    ST_AsGeoJSON(geometry)::json as geometry
  FROM "Area"
`
```

## Best Practices

1. Always validate geometric data before insertion to ensure data integrity
2. Use appropriate spatial indexes for your specific query patterns
3. Consider adding additional indexes on frequently queried fields (e.g., country, emirate)
4. Use the correct SRID (4326 for WGS84) when working with geographic coordinates
5. Be mindful of the performance implications of complex geometric operations on large datasets

## Common PostGIS Functions

Here are some commonly used PostGIS functions for working with geometric data:

- `ST_GeomFromGeoJSON`: Convert GeoJSON to PostGIS geometry
- `ST_AsGeoJSON`: Convert PostGIS geometry to GeoJSON
- `ST_DWithin`: Find geometries within a specified distance
- `ST_Intersects`: Check if geometries intersect
- `ST_Contains`: Check if one geometry contains another
- `ST_Area`: Calculate the area of a geometry
- `ST_Distance`: Calculate the distance between geometries
- `ST_IsValid`: Validate geometry
