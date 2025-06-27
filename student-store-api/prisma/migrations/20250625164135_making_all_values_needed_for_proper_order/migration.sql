/*
  Warnings:

  - Made the column `status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_name` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `student_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "customer_name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "student_id" SET NOT NULL;
