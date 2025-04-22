-- CreateTable
CREATE TABLE
    "Property" (
        "id" SERIAL NOT NULL,
        "address1" TEXT NOT NULL,
        "area" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "purchaseDate" TIMESTAMP(3) NOT NULL,
        "developer" TEXT NOT NULL,
        "buyPrice" INTEGER NOT NULL,
        "rentPrice" INTEGER NOT NULL,
        "bedrooms" INTEGER NOT NULL,
        "bathrooms" INTEGER NOT NULL,
        "receptions" INTEGER NOT NULL,
        "size" INTEGER NOT NULL,
        CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
    );