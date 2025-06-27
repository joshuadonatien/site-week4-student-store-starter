/*
  Warnings:

  - Made the column `total_price` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total_price" SET NOT NULL,
ALTER COLUMN "total_price" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "customer_name" DROP NOT NULL;
