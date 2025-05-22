/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SUBSCRIPTION_STATUS" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID', 'INCOMPLETE', 'TRIALING');

-- AlterEnum
ALTER TYPE "SUBSCRIPTION_PLAN" ADD VALUE 'TEAM';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethodId" TEXT,
ADD COLUMN     "paymentMethodLast4" TEXT,
ADD COLUMN     "paymentMethodType" TEXT,
ADD COLUMN     "status" "SUBSCRIPTION_STATUS" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "stripeCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "stripeCurrentPeriodStart" TIMESTAMP(3),
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ADD COLUMN     "trialEnd" TIMESTAMP(3),
ADD COLUMN     "trialStart" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
