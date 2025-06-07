/*
  Warnings:

  - Added the required column `updatedAt` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TriggerMode" AS ENUM ('KEYWORD', 'UNIVERSAL', 'AI_SMART', 'TIME_BASED', 'EVENT_BASED');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('NEW', 'RETURNING', 'VIP', 'SPAM');

-- AlterTable
ALTER TABLE "ConversationState" ADD COLUMN     "customerType" "CustomerType" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "interactionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastInteractionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastTriggerReason" TEXT,
ADD COLUMN     "lastTriggerType" TEXT,
ADD COLUMN     "sentiment" DOUBLE PRECISION,
ADD COLUMN     "triggerHistory" JSONB;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "businessHoursOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confidenceThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
ADD COLUMN     "configuration" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "triggerMode" "TriggerMode" NOT NULL DEFAULT 'KEYWORD',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "TriggerExecution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "triggerId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "messageContent" TEXT NOT NULL,
    "triggerType" "TriggerMode" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "reason" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "responseTime" INTEGER,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriggerExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriggerAnalytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "triggerId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "successfulExecutions" INTEGER NOT NULL DEFAULT 0,
    "failedExecutions" INTEGER NOT NULL DEFAULT 0,
    "averageConfidence" DOUBLE PRECISION,
    "averageResponseTime" INTEGER,
    "spamFiltered" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION,

    CONSTRAINT "TriggerAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysisCache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "messageHash" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "intent" TEXT,
    "sentiment" DOUBLE PRECISION,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "businessRelevant" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysisCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "mondayStart" TEXT,
    "mondayEnd" TEXT,
    "tuesdayStart" TEXT,
    "tuesdayEnd" TEXT,
    "wednesdayStart" TEXT,
    "wednesdayEnd" TEXT,
    "thursdayStart" TEXT,
    "thursdayEnd" TEXT,
    "fridayStart" TEXT,
    "fridayEnd" TEXT,
    "saturdayStart" TEXT,
    "saturdayEnd" TEXT,
    "sundayStart" TEXT,
    "sundayEnd" TEXT,
    "holidays" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookPerformance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "successfulRequests" INTEGER NOT NULL DEFAULT 0,
    "failedRequests" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTime" INTEGER,
    "triggerBreakdown" JSONB,
    "errorBreakdown" JSONB,
    "peakHour" INTEGER,

    CONSTRAINT "WebhookPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TriggerExecution_triggerId_idx" ON "TriggerExecution"("triggerId");

-- CreateIndex
CREATE INDEX "TriggerExecution_automationId_idx" ON "TriggerExecution"("automationId");

-- CreateIndex
CREATE INDEX "TriggerExecution_userId_idx" ON "TriggerExecution"("userId");

-- CreateIndex
CREATE INDEX "TriggerExecution_triggerType_idx" ON "TriggerExecution"("triggerType");

-- CreateIndex
CREATE INDEX "TriggerExecution_timestamp_idx" ON "TriggerExecution"("timestamp");

-- CreateIndex
CREATE INDEX "TriggerAnalytics_triggerId_idx" ON "TriggerAnalytics"("triggerId");

-- CreateIndex
CREATE INDEX "TriggerAnalytics_date_idx" ON "TriggerAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "TriggerAnalytics_triggerId_date_key" ON "TriggerAnalytics"("triggerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysisCache_messageHash_key" ON "AIAnalysisCache"("messageHash");

-- CreateIndex
CREATE INDEX "AIAnalysisCache_messageHash_idx" ON "AIAnalysisCache"("messageHash");

-- CreateIndex
CREATE INDEX "AIAnalysisCache_expiresAt_idx" ON "AIAnalysisCache"("expiresAt");

-- CreateIndex
CREATE INDEX "AIAnalysisCache_isSpam_idx" ON "AIAnalysisCache"("isSpam");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_userId_key" ON "BusinessHours"("userId");

-- CreateIndex
CREATE INDEX "WebhookPerformance_userId_idx" ON "WebhookPerformance"("userId");

-- CreateIndex
CREATE INDEX "WebhookPerformance_date_idx" ON "WebhookPerformance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookPerformance_userId_date_key" ON "WebhookPerformance"("userId", "date");

-- CreateIndex
CREATE INDEX "ConversationState_customerType_idx" ON "ConversationState"("customerType");

-- CreateIndex
CREATE INDEX "ConversationState_lastInteractionAt_idx" ON "ConversationState"("lastInteractionAt");

-- CreateIndex
CREATE INDEX "Trigger_automationId_idx" ON "Trigger"("automationId");

-- CreateIndex
CREATE INDEX "Trigger_triggerMode_idx" ON "Trigger"("triggerMode");

-- CreateIndex
CREATE INDEX "Trigger_isActive_idx" ON "Trigger"("isActive");

-- AddForeignKey
ALTER TABLE "TriggerExecution" ADD CONSTRAINT "TriggerExecution_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriggerAnalytics" ADD CONSTRAINT "TriggerAnalytics_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
