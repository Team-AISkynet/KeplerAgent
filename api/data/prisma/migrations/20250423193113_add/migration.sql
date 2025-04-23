-- CreateTable
CREATE TABLE "ProperyRentUpdate" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "oldRent" INTEGER NOT NULL,
    "newRent" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "ProperyRentUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProperyRentUpdate" ADD CONSTRAINT "ProperyRentUpdate_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
