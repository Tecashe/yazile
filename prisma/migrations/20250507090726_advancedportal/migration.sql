/*
  Warnings:

  - You are about to drop the `CrmLeadMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrmSyncLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnhancedCrmFieldMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnhancedCrmIntegration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnhancedN8nConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnhancedN8nWorkflowConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `N8nWorkflowExecution` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkflowCategory" AS ENUM ('MARKETING', 'SALES', 'CUSTOMER_SUPPORT', 'DATA_PROCESSING', 'DOCUMENT_MANAGEMENT', 'SOCIAL_MEDIA', 'COMMUNICATION', 'INTEGRATION', 'UTILITY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "WorkflowComplexity" AS ENUM ('SIMPLE', 'MEDIUM', 'COMPLEX');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'CONFIGURING', 'READY', 'ACTIVE', 'INACTIVE', 'ERROR', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CustomRequestStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'IN_DEVELOPMENT', 'READY_FOR_TESTING', 'COMPLETED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXECUTION_STARTED', 'EXECUTION_COMPLETED', 'EXECUTION_FAILED', 'WORKFLOW_ACTIVATED', 'WORKFLOW_DEACTIVATED', 'WORKFLOW_ERROR', 'CUSTOM_REQUEST_UPDATE', 'SYSTEM_NOTIFICATION');

-- AlterEnum
ALTER TYPE "ExecutionStatus" ADD VALUE 'TIMEOUT';

-- DropForeignKey
ALTER TABLE "CrmLeadMapping" DROP CONSTRAINT "CrmLeadMapping_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "CrmSyncLog" DROP CONSTRAINT "CrmSyncLog_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "EnhancedCrmFieldMapping" DROP CONSTRAINT "EnhancedCrmFieldMapping_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "EnhancedCrmIntegration" DROP CONSTRAINT "EnhancedCrmIntegration_userId_fkey";

-- DropForeignKey
ALTER TABLE "EnhancedN8nConnection" DROP CONSTRAINT "EnhancedN8nConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "EnhancedN8nWorkflowConfig" DROP CONSTRAINT "EnhancedN8nWorkflowConfig_connectionId_fkey";

-- DropForeignKey
ALTER TABLE "N8nWorkflowExecution" DROP CONSTRAINT "N8nWorkflowExecution_workflowId_fkey";

-- DropTable
DROP TABLE "CrmLeadMapping";

-- DropTable
DROP TABLE "CrmSyncLog";

-- DropTable
DROP TABLE "EnhancedCrmFieldMapping";

-- DropTable
DROP TABLE "EnhancedCrmIntegration";

-- DropTable
DROP TABLE "EnhancedN8nConnection";

-- DropTable
DROP TABLE "EnhancedN8nWorkflowConfig";

-- DropTable
DROP TABLE "N8nWorkflowExecution";

-- DropEnum
DROP TYPE "SyncDirection";

-- DropEnum
DROP TYPE "SyncStatus";

-- CreateTable
CREATE TABLE "WorkflowTemplate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "WorkflowCategory" NOT NULL,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "complexity" "WorkflowComplexity" NOT NULL DEFAULT 'MEDIUM',
    "estimatedSetupTime" INTEGER NOT NULL DEFAULT 15,
    "requiredIntegrations" TEXT[],
    "configurationSchema" JSONB NOT NULL,
    "n8nTemplateId" TEXT,
    "visualRepresentation" JSONB,
    "expectedOutcomes" TEXT[],
    "useCases" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkflow" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "n8nWorkflowId" TEXT,
    "webhookUrl" TEXT,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastActivated" TIMESTAMP(3),
    "lastDeactivated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" UUID NOT NULL,
    "n8nExecutionId" TEXT,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "success" BOOLEAN,
    "errorMessage" TEXT,
    "inputData" JSONB,
    "outputData" JSONB,
    "resourceUsage" JSONB,
    "businessImpact" JSONB,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "executionId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "nodeId" TEXT,
    "nodeName" TEXT,
    "message" TEXT,
    "data" JSONB,

    CONSTRAINT "ExecutionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCredential" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomWorkflowRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "templateId" UUID,
    "title" TEXT NOT NULL,
    "businessObjective" TEXT NOT NULL,
    "requiredIntegrations" TEXT[],
    "processDescription" TEXT NOT NULL,
    "exampleDataUrl" TEXT,
    "budget" DOUBLE PRECISION,
    "urgency" "RequestUrgency" NOT NULL DEFAULT 'NORMAL',
    "status" "CustomRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "aiSuggestions" JSONB,
    "adminNotes" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomWorkflowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomRequestMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requestId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "isFromAdmin" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomRequestMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowAnalytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "successfulExecutions" INTEGER NOT NULL DEFAULT 0,
    "failedExecutions" INTEGER NOT NULL DEFAULT 0,
    "averageDuration" DOUBLE PRECISION,
    "resourceUsage" JSONB,
    "businessImpact" JSONB,

    CONSTRAINT "WorkflowAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowNotification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "workflowId" UUID,
    "executionId" UUID,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowTemplate_category_idx" ON "WorkflowTemplate"("category");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_featured_idx" ON "WorkflowTemplate"("featured");

-- CreateIndex
CREATE INDEX "WorkflowTemplate_popular_idx" ON "WorkflowTemplate"("popular");

-- CreateIndex
CREATE INDEX "UserWorkflow_userId_idx" ON "UserWorkflow"("userId");

-- CreateIndex
CREATE INDEX "UserWorkflow_templateId_idx" ON "UserWorkflow"("templateId");

-- CreateIndex
CREATE INDEX "UserWorkflow_status_idx" ON "UserWorkflow"("status");

-- CreateIndex
CREATE INDEX "UserWorkflow_isActive_idx" ON "UserWorkflow"("isActive");

-- CreateIndex
CREATE INDEX "WorkflowExecution_workflowId_idx" ON "WorkflowExecution"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");

-- CreateIndex
CREATE INDEX "WorkflowExecution_startedAt_idx" ON "WorkflowExecution"("startedAt");

-- CreateIndex
CREATE INDEX "ExecutionEvent_executionId_idx" ON "ExecutionEvent"("executionId");

-- CreateIndex
CREATE INDEX "ExecutionEvent_timestamp_idx" ON "ExecutionEvent"("timestamp");

-- CreateIndex
CREATE INDEX "ExecutionEvent_eventType_idx" ON "ExecutionEvent"("eventType");

-- CreateIndex
CREATE INDEX "WorkflowCredential_workflowId_idx" ON "WorkflowCredential"("workflowId");

-- CreateIndex
CREATE INDEX "CustomWorkflowRequest_userId_idx" ON "CustomWorkflowRequest"("userId");

-- CreateIndex
CREATE INDEX "CustomWorkflowRequest_status_idx" ON "CustomWorkflowRequest"("status");

-- CreateIndex
CREATE INDEX "CustomRequestMessage_requestId_idx" ON "CustomRequestMessage"("requestId");

-- CreateIndex
CREATE INDEX "CustomRequestMessage_createdAt_idx" ON "CustomRequestMessage"("createdAt");

-- CreateIndex
CREATE INDEX "WorkflowAnalytics_userId_idx" ON "WorkflowAnalytics"("userId");

-- CreateIndex
CREATE INDEX "WorkflowAnalytics_date_idx" ON "WorkflowAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowAnalytics_userId_date_key" ON "WorkflowAnalytics"("userId", "date");

-- CreateIndex
CREATE INDEX "WorkflowNotification_userId_idx" ON "WorkflowNotification"("userId");

-- CreateIndex
CREATE INDEX "WorkflowNotification_workflowId_idx" ON "WorkflowNotification"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowNotification_isRead_idx" ON "WorkflowNotification"("isRead");

-- CreateIndex
CREATE INDEX "WorkflowNotification_createdAt_idx" ON "WorkflowNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "UserWorkflow" ADD CONSTRAINT "UserWorkflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkflow" ADD CONSTRAINT "UserWorkflow_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "UserWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionEvent" ADD CONSTRAINT "ExecutionEvent_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCredential" ADD CONSTRAINT "WorkflowCredential_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "UserWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomWorkflowRequest" ADD CONSTRAINT "CustomWorkflowRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomWorkflowRequest" ADD CONSTRAINT "CustomWorkflowRequest_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkflowTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomRequestMessage" ADD CONSTRAINT "CustomRequestMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CustomWorkflowRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
