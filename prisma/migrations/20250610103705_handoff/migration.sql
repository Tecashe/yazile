-- CreateEnum
CREATE TYPE "HandoffStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "HandoffPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "ProcessedMessage" (
    "id" TEXT NOT NULL,
    "messageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanHandoff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "pageId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "automationId" UUID,
    "reason" TEXT NOT NULL,
    "priority" "HandoffPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "HandoffStatus" NOT NULL DEFAULT 'PENDING',
    "context" TEXT,
    "assignedAgentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "customerWaitTime" INTEGER,
    "n8nWorkflowId" TEXT,
    "n8nExecutionId" TEXT,

    CONSTRAINT "HumanHandoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandoffMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "handoffId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isFromCustomer" BOOLEAN NOT NULL DEFAULT false,
    "isFromAgent" BOOLEAN NOT NULL DEFAULT false,
    "isSystemMessage" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HandoffMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandoffNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "handoffId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HandoffNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slackUserId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxConcurrent" INTEGER NOT NULL DEFAULT 3,
    "skills" TEXT[],
    "languages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandoffSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "notificationEmail" TEXT,
    "slackWebhookUrl" TEXT,
    "slackChannel" TEXT,
    "teamsWebhookUrl" TEXT,
    "n8nWorkflowId" TEXT,
    "defaultPriority" "HandoffPriority" NOT NULL DEFAULT 'MEDIUM',
    "businessHoursOnly" BOOLEAN NOT NULL DEFAULT false,
    "autoAssign" BOOLEAN NOT NULL DEFAULT true,
    "maxWaitTime" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HandoffSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageDeliveryLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pageId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseMetrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "automationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "messageLength" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "typingDelay" INTEGER NOT NULL,
    "wasSuccessful" BOOLEAN NOT NULL,
    "messageType" TEXT NOT NULL,
    "hasButtons" BOOLEAN NOT NULL,
    "sentiment" TEXT,
    "priority" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponseMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedMessage_messageKey_key" ON "ProcessedMessage"("messageKey");

-- CreateIndex
CREATE INDEX "ProcessedMessage_messageKey_idx" ON "ProcessedMessage"("messageKey");

-- CreateIndex
CREATE INDEX "ProcessedMessage_createdAt_idx" ON "ProcessedMessage"("createdAt");

-- CreateIndex
CREATE INDEX "HumanHandoff_userId_idx" ON "HumanHandoff"("userId");

-- CreateIndex
CREATE INDEX "HumanHandoff_status_idx" ON "HumanHandoff"("status");

-- CreateIndex
CREATE INDEX "HumanHandoff_priority_idx" ON "HumanHandoff"("priority");

-- CreateIndex
CREATE INDEX "HumanHandoff_assignedAgentId_idx" ON "HumanHandoff"("assignedAgentId");

-- CreateIndex
CREATE INDEX "HumanHandoff_pageId_senderId_idx" ON "HumanHandoff"("pageId", "senderId");

-- CreateIndex
CREATE INDEX "HandoffMessage_handoffId_idx" ON "HandoffMessage"("handoffId");

-- CreateIndex
CREATE INDEX "HandoffMessage_timestamp_idx" ON "HandoffMessage"("timestamp");

-- CreateIndex
CREATE INDEX "HandoffNote_handoffId_idx" ON "HandoffNote"("handoffId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE INDEX "Agent_isActive_isAvailable_idx" ON "Agent"("isActive", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "HandoffSettings_userId_key" ON "HandoffSettings"("userId");

-- CreateIndex
CREATE INDEX "MessageDeliveryLog_pageId_recipientId_idx" ON "MessageDeliveryLog"("pageId", "recipientId");

-- CreateIndex
CREATE INDEX "MessageDeliveryLog_timestamp_idx" ON "MessageDeliveryLog"("timestamp");

-- CreateIndex
CREATE INDEX "MessageDeliveryLog_success_idx" ON "MessageDeliveryLog"("success");

-- CreateIndex
CREATE INDEX "ResponseMetrics_automationId_idx" ON "ResponseMetrics"("automationId");

-- CreateIndex
CREATE INDEX "ResponseMetrics_userId_idx" ON "ResponseMetrics"("userId");

-- CreateIndex
CREATE INDEX "ResponseMetrics_timestamp_idx" ON "ResponseMetrics"("timestamp");

-- AddForeignKey
ALTER TABLE "HumanHandoff" ADD CONSTRAINT "HumanHandoff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanHandoff" ADD CONSTRAINT "HumanHandoff_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanHandoff" ADD CONSTRAINT "HumanHandoff_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandoffMessage" ADD CONSTRAINT "HandoffMessage_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "HumanHandoff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandoffNote" ADD CONSTRAINT "HandoffNote_handoffId_fkey" FOREIGN KEY ("handoffId") REFERENCES "HumanHandoff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandoffSettings" ADD CONSTRAINT "HandoffSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
