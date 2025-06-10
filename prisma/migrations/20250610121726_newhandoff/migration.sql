/*
  Warnings:

  - Added the required column `businessId` to the `HandoffSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `HumanHandoff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "workingHours" JSONB;

-- AlterTable
ALTER TABLE "HandoffSettings" ADD COLUMN     "businessId" UUID NOT NULL,
ADD COLUMN     "escalationRules" JSONB,
ADD COLUMN     "routingRules" JSONB;

-- AlterTable
ALTER TABLE "HumanHandoff" ADD COLUMN     "businessId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "AgentBusinessAssignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agentId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'agent',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" UUID,

    CONSTRAINT "AgentBusinessAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentPerformance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agentId" UUID NOT NULL,
    "businessId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "handoffsHandled" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" INTEGER,
    "avgResolutionTime" INTEGER,
    "customerSatisfaction" DOUBLE PRECISION,

    CONSTRAINT "AgentPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentBusinessAssignment_businessId_isActive_idx" ON "AgentBusinessAssignment"("businessId", "isActive");

-- CreateIndex
CREATE INDEX "AgentBusinessAssignment_agentId_isActive_idx" ON "AgentBusinessAssignment"("agentId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AgentBusinessAssignment_agentId_businessId_key" ON "AgentBusinessAssignment"("agentId", "businessId");

-- CreateIndex
CREATE INDEX "AgentPerformance_businessId_date_idx" ON "AgentPerformance"("businessId", "date");

-- CreateIndex
CREATE INDEX "AgentPerformance_agentId_date_idx" ON "AgentPerformance"("agentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AgentPerformance_agentId_businessId_date_key" ON "AgentPerformance"("agentId", "businessId", "date");

-- CreateIndex
CREATE INDEX "Agent_skills_idx" ON "Agent"("skills");

-- CreateIndex
CREATE INDEX "Agent_languages_idx" ON "Agent"("languages");

-- CreateIndex
CREATE INDEX "HandoffSettings_businessId_idx" ON "HandoffSettings"("businessId");

-- CreateIndex
CREATE INDEX "HumanHandoff_businessId_idx" ON "HumanHandoff"("businessId");

-- CreateIndex
CREATE INDEX "HumanHandoff_businessId_status_idx" ON "HumanHandoff"("businessId", "status");

-- AddForeignKey
ALTER TABLE "HumanHandoff" ADD CONSTRAINT "HumanHandoff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentBusinessAssignment" ADD CONSTRAINT "AgentBusinessAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentBusinessAssignment" ADD CONSTRAINT "AgentBusinessAssignment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandoffSettings" ADD CONSTRAINT "HandoffSettings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseMetrics" ADD CONSTRAINT "ResponseMetrics_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseMetrics" ADD CONSTRAINT "ResponseMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPerformance" ADD CONSTRAINT "AgentPerformance_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentPerformance" ADD CONSTRAINT "AgentPerformance_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
