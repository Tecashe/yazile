-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('LEAD_QUALIFICATION', 'LEAD_NURTURING', 'CRM_SYNC', 'NOTIFICATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CrmProvider" AS ENUM ('HUBSPOT', 'SALESFORCE', 'ZOHO', 'PIPEDRIVE', 'AIRTABLE', 'NOTION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('OVERALL', 'ENGAGEMENT', 'INTENT', 'SENTIMENT', 'FREQUENCY', 'RECENCY');

-- CreateEnum
CREATE TYPE "RuleOperator" AS ENUM ('GREATER_THAN', 'LESS_THAN', 'EQUAL_TO', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL');

-- CreateEnum
CREATE TYPE "NurturingStepType" AS ENUM ('MESSAGE', 'EMAIL', 'WEBHOOK', 'DELAY', 'CONDITION', 'CRM_UPDATE');

-- CreateTable
CREATE TABLE "N8nConnection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "n8nUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastConnected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "N8nConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "N8nWorkflowConfig" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "connectionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workflowId" TEXT NOT NULL,
    "workflowType" "WorkflowType" NOT NULL DEFAULT 'LEAD_QUALIFICATION',
    "triggerUrl" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastExecuted" TIMESTAMP(3),
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "N8nWorkflowConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmIntegration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "provider" "CrmProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSynced" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmFieldMapping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL,
    "localField" TEXT NOT NULL,
    "remoteField" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "transformFunction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmFieldMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadQualificationRule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scoreType" "ScoreType" NOT NULL DEFAULT 'OVERALL',
    "operator" "RuleOperator" NOT NULL DEFAULT 'GREATER_THAN',
    "threshold" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadQualificationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNurturingSequence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNurturingSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNurturingStep" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sequenceId" UUID NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NurturingStepType" NOT NULL DEFAULT 'MESSAGE',
    "content" TEXT,
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "delayHours" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNurturingStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366F1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "N8nConnection_userId_idx" ON "N8nConnection"("userId");

-- CreateIndex
CREATE INDEX "N8nWorkflowConfig_connectionId_idx" ON "N8nWorkflowConfig"("connectionId");

-- CreateIndex
CREATE INDEX "N8nWorkflowConfig_workflowType_idx" ON "N8nWorkflowConfig"("workflowType");

-- CreateIndex
CREATE INDEX "CrmIntegration_userId_idx" ON "CrmIntegration"("userId");

-- CreateIndex
CREATE INDEX "CrmIntegration_provider_idx" ON "CrmIntegration"("provider");

-- CreateIndex
CREATE INDEX "CrmFieldMapping_integrationId_idx" ON "CrmFieldMapping"("integrationId");

-- CreateIndex
CREATE INDEX "LeadQualificationRule_userId_idx" ON "LeadQualificationRule"("userId");

-- CreateIndex
CREATE INDEX "LeadQualificationRule_scoreType_idx" ON "LeadQualificationRule"("scoreType");

-- CreateIndex
CREATE INDEX "LeadNurturingSequence_userId_idx" ON "LeadNurturingSequence"("userId");

-- CreateIndex
CREATE INDEX "LeadNurturingStep_sequenceId_idx" ON "LeadNurturingStep"("sequenceId");

-- CreateIndex
CREATE INDEX "LeadNurturingStep_type_idx" ON "LeadNurturingStep"("type");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_activityType_idx" ON "LeadActivity"("activityType");

-- CreateIndex
CREATE INDEX "LeadActivity_timestamp_idx" ON "LeadActivity"("timestamp");

-- CreateIndex
CREATE INDEX "LeadTag_userId_idx" ON "LeadTag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadTag_userId_name_key" ON "LeadTag"("userId", "name");

-- AddForeignKey
ALTER TABLE "N8nConnection" ADD CONSTRAINT "N8nConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "N8nWorkflowConfig" ADD CONSTRAINT "N8nWorkflowConfig_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "N8nConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmIntegration" ADD CONSTRAINT "CrmIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmFieldMapping" ADD CONSTRAINT "CrmFieldMapping_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "CrmIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadQualificationRule" ADD CONSTRAINT "LeadQualificationRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNurturingSequence" ADD CONSTRAINT "LeadNurturingSequence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNurturingStep" ADD CONSTRAINT "LeadNurturingStep_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "LeadNurturingSequence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadTag" ADD CONSTRAINT "LeadTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
