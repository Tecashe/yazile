-- CreateEnum
CREATE TYPE "SyncDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "EnhancedCrmIntegration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "CrmProvider" NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSynced" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnhancedCrmIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnhancedCrmFieldMapping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL,
    "localField" TEXT NOT NULL,
    "remoteField" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "transformFunction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnhancedCrmFieldMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmSyncLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL,
    "direction" "SyncDirection" NOT NULL DEFAULT 'OUTBOUND',
    "status" "SyncStatus" NOT NULL DEFAULT 'SUCCESS',
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsSucceeded" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorDetails" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "CrmSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmLeadMapping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "crmRecordId" TEXT NOT NULL,
    "crmRecordUrl" TEXT,
    "lastSynced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "CrmLeadMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnhancedN8nConnection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "n8nUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastConnected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnhancedN8nConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnhancedN8nWorkflowConfig" (
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

    CONSTRAINT "EnhancedN8nWorkflowConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "N8nWorkflowExecution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" UUID NOT NULL,
    "executionId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'COMPLETED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "metadata" JSONB,

    CONSTRAINT "N8nWorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnhancedCrmIntegration_userId_idx" ON "EnhancedCrmIntegration"("userId");

-- CreateIndex
CREATE INDEX "EnhancedCrmIntegration_provider_idx" ON "EnhancedCrmIntegration"("provider");

-- CreateIndex
CREATE INDEX "EnhancedCrmFieldMapping_integrationId_idx" ON "EnhancedCrmFieldMapping"("integrationId");

-- CreateIndex
CREATE INDEX "CrmSyncLog_integrationId_idx" ON "CrmSyncLog"("integrationId");

-- CreateIndex
CREATE INDEX "CrmSyncLog_startedAt_idx" ON "CrmSyncLog"("startedAt");

-- CreateIndex
CREATE INDEX "CrmSyncLog_status_idx" ON "CrmSyncLog"("status");

-- CreateIndex
CREATE INDEX "CrmLeadMapping_integrationId_idx" ON "CrmLeadMapping"("integrationId");

-- CreateIndex
CREATE INDEX "CrmLeadMapping_leadId_idx" ON "CrmLeadMapping"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "CrmLeadMapping_integrationId_leadId_key" ON "CrmLeadMapping"("integrationId", "leadId");

-- CreateIndex
CREATE INDEX "EnhancedN8nConnection_userId_idx" ON "EnhancedN8nConnection"("userId");

-- CreateIndex
CREATE INDEX "EnhancedN8nWorkflowConfig_connectionId_idx" ON "EnhancedN8nWorkflowConfig"("connectionId");

-- CreateIndex
CREATE INDEX "EnhancedN8nWorkflowConfig_workflowType_idx" ON "EnhancedN8nWorkflowConfig"("workflowType");

-- CreateIndex
CREATE INDEX "N8nWorkflowExecution_workflowId_idx" ON "N8nWorkflowExecution"("workflowId");

-- CreateIndex
CREATE INDEX "N8nWorkflowExecution_executionId_idx" ON "N8nWorkflowExecution"("executionId");

-- CreateIndex
CREATE INDEX "N8nWorkflowExecution_status_idx" ON "N8nWorkflowExecution"("status");

-- AddForeignKey
ALTER TABLE "EnhancedCrmIntegration" ADD CONSTRAINT "EnhancedCrmIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedCrmFieldMapping" ADD CONSTRAINT "EnhancedCrmFieldMapping_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "EnhancedCrmIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmSyncLog" ADD CONSTRAINT "CrmSyncLog_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "EnhancedCrmIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmLeadMapping" ADD CONSTRAINT "CrmLeadMapping_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "EnhancedCrmIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedN8nConnection" ADD CONSTRAINT "EnhancedN8nConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnhancedN8nWorkflowConfig" ADD CONSTRAINT "EnhancedN8nWorkflowConfig_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "EnhancedN8nConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "N8nWorkflowExecution" ADD CONSTRAINT "N8nWorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "EnhancedN8nWorkflowConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
