/*
  Warnings:

  - The `budget` column on the `Opportunity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CollabMessage" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "Opportunity" ALTER COLUMN "brandName" SET DEFAULT 'BrandName',
DROP COLUMN "budget",
ADD COLUMN     "budget" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isABusiness" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInfluencer" BOOLEAN NOT NULL DEFAULT false;
