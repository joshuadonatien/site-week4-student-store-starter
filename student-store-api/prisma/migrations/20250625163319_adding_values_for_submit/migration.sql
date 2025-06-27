/*
  Warnings:

  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customer_id",
ADD COLUMN     "customer_name" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "student_id" TEXT,
ALTER COLUMN "status" DROP NOT NULL;
