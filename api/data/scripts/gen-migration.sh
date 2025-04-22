#!/bin/bash

# Generate a new migration
bunx prisma migrate dev --name $1
