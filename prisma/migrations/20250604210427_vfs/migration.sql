-- CreateTable
CREATE TABLE "BusinessKnowledge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT[],
    "embedding" REAL[],
    "sourceType" TEXT NOT NULL DEFAULT 'manual',
    "sourceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlowCustomization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "flowUpdates" TEXT NOT NULL,
    "personalizationData" TEXT,
    "lastApplied" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFlowCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPersonalization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "industry" TEXT,
    "engagementLevel" INTEGER NOT NULL DEFAULT 0,
    "purchaseIntent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "preferences" TEXT,
    "behaviorPattern" TEXT,
    "lastInteraction" TIMESTAMP(3),
    "totalInteractions" INTEGER NOT NULL DEFAULT 0,
    "conversionProbability" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPersonalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowABTest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variants" TEXT NOT NULL,
    "metrics" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "voiceflowExperimentId" TEXT,
    "trafficSplit" TEXT,
    "winningVariant" TEXT,
    "confidenceLevel" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceflowABTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowABTestResult" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "testId" UUID NOT NULL,
    "variant" TEXT NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userSatisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceflowABTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowIntentTraining" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "entities" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceflowIntentTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowConversationEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT,
    "intent" TEXT,
    "intentConfidence" DOUBLE PRECISION,
    "sentiment" DOUBLE PRECISION,
    "sessionId" TEXT,
    "conversationStep" TEXT,
    "responseTime" INTEGER,
    "metadata" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceflowConversationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowAnalytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "totalConversations" INTEGER NOT NULL DEFAULT 0,
    "completedConversations" INTEGER NOT NULL DEFAULT 0,
    "averageSessionLength" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageResponseTime" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userSatisfactionAvg" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "topIntents" TEXT,
    "dropOffPoints" TEXT,
    "sentimentDistribution" TEXT,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceflowAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowLiveConversation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "currentStep" TEXT,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "takenOverBy" TEXT,
    "takenOverAt" TIMESTAMP(3),
    "takenOverReason" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "tags" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceflowLiveConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowUserJourney" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "journeyStage" TEXT NOT NULL,
    "touchpoints" TEXT,
    "conversionEvents" TEXT,
    "journeyScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "predictedNextAction" TEXT,
    "actionProbability" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceflowUserJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowConversationFeedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "rating" INTEGER,
    "feedback" TEXT,
    "feedbackType" TEXT NOT NULL DEFAULT 'general',
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceflowConversationFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessKnowledge_userId_automationId_idx" ON "BusinessKnowledge"("userId", "automationId");

-- CreateIndex
CREATE INDEX "BusinessKnowledge_category_idx" ON "BusinessKnowledge"("category");

-- CreateIndex
CREATE INDEX "BusinessKnowledge_tags_idx" ON "BusinessKnowledge"("tags");

-- CreateIndex
CREATE INDEX "BusinessKnowledge_sourceType_idx" ON "BusinessKnowledge"("sourceType");

-- CreateIndex
CREATE INDEX "UserFlowCustomization_userId_automationId_idx" ON "UserFlowCustomization"("userId", "automationId");

-- CreateIndex
CREATE INDEX "UserFlowCustomization_instagramUserId_idx" ON "UserFlowCustomization"("instagramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFlowCustomization_userId_automationId_instagramUserId_key" ON "UserFlowCustomization"("userId", "automationId", "instagramUserId");

-- CreateIndex
CREATE INDEX "UserPersonalization_userId_automationId_idx" ON "UserPersonalization"("userId", "automationId");

-- CreateIndex
CREATE INDEX "UserPersonalization_instagramUserId_idx" ON "UserPersonalization"("instagramUserId");

-- CreateIndex
CREATE INDEX "UserPersonalization_lastInteraction_idx" ON "UserPersonalization"("lastInteraction");

-- CreateIndex
CREATE UNIQUE INDEX "UserPersonalization_userId_automationId_instagramUserId_key" ON "UserPersonalization"("userId", "automationId", "instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowABTest_userId_automationId_idx" ON "VoiceflowABTest"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowABTest_status_idx" ON "VoiceflowABTest"("status");

-- CreateIndex
CREATE INDEX "VoiceflowABTest_startDate_endDate_idx" ON "VoiceflowABTest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "VoiceflowABTestResult_testId_idx" ON "VoiceflowABTestResult"("testId");

-- CreateIndex
CREATE INDEX "VoiceflowABTestResult_variant_idx" ON "VoiceflowABTestResult"("variant");

-- CreateIndex
CREATE INDEX "VoiceflowABTestResult_timestamp_idx" ON "VoiceflowABTestResult"("timestamp");

-- CreateIndex
CREATE INDEX "VoiceflowIntentTraining_userId_automationId_idx" ON "VoiceflowIntentTraining"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowIntentTraining_intent_idx" ON "VoiceflowIntentTraining"("intent");

-- CreateIndex
CREATE INDEX "VoiceflowIntentTraining_isVerified_idx" ON "VoiceflowIntentTraining"("isVerified");

-- CreateIndex
CREATE INDEX "VoiceflowConversationEvent_userId_automationId_idx" ON "VoiceflowConversationEvent"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowConversationEvent_instagramUserId_idx" ON "VoiceflowConversationEvent"("instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowConversationEvent_eventType_idx" ON "VoiceflowConversationEvent"("eventType");

-- CreateIndex
CREATE INDEX "VoiceflowConversationEvent_timestamp_idx" ON "VoiceflowConversationEvent"("timestamp");

-- CreateIndex
CREATE INDEX "VoiceflowConversationEvent_sessionId_idx" ON "VoiceflowConversationEvent"("sessionId");

-- CreateIndex
CREATE INDEX "VoiceflowAnalytics_userId_automationId_idx" ON "VoiceflowAnalytics"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowAnalytics_date_idx" ON "VoiceflowAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceflowAnalytics_userId_automationId_date_key" ON "VoiceflowAnalytics"("userId", "automationId", "date");

-- CreateIndex
CREATE INDEX "VoiceflowLiveConversation_userId_automationId_idx" ON "VoiceflowLiveConversation"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowLiveConversation_instagramUserId_idx" ON "VoiceflowLiveConversation"("instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowLiveConversation_isActive_idx" ON "VoiceflowLiveConversation"("isActive");

-- CreateIndex
CREATE INDEX "VoiceflowLiveConversation_lastActivity_idx" ON "VoiceflowLiveConversation"("lastActivity");

-- CreateIndex
CREATE INDEX "VoiceflowLiveConversation_priority_idx" ON "VoiceflowLiveConversation"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceflowLiveConversation_userId_automationId_instagramUser_key" ON "VoiceflowLiveConversation"("userId", "automationId", "instagramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceflowLiveConversation_sessionId_key" ON "VoiceflowLiveConversation"("sessionId");

-- CreateIndex
CREATE INDEX "VoiceflowUserJourney_userId_automationId_idx" ON "VoiceflowUserJourney"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowUserJourney_instagramUserId_idx" ON "VoiceflowUserJourney"("instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowUserJourney_journeyStage_idx" ON "VoiceflowUserJourney"("journeyStage");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceflowUserJourney_userId_automationId_instagramUserId_key" ON "VoiceflowUserJourney"("userId", "automationId", "instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowConversationFeedback_userId_automationId_idx" ON "VoiceflowConversationFeedback"("userId", "automationId");

-- CreateIndex
CREATE INDEX "VoiceflowConversationFeedback_instagramUserId_idx" ON "VoiceflowConversationFeedback"("instagramUserId");

-- CreateIndex
CREATE INDEX "VoiceflowConversationFeedback_rating_idx" ON "VoiceflowConversationFeedback"("rating");

-- CreateIndex
CREATE INDEX "VoiceflowConversationFeedback_isResolved_idx" ON "VoiceflowConversationFeedback"("isResolved");

-- AddForeignKey
ALTER TABLE "BusinessKnowledge" ADD CONSTRAINT "BusinessKnowledge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessKnowledge" ADD CONSTRAINT "BusinessKnowledge_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlowCustomization" ADD CONSTRAINT "UserFlowCustomization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlowCustomization" ADD CONSTRAINT "UserFlowCustomization_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonalization" ADD CONSTRAINT "UserPersonalization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonalization" ADD CONSTRAINT "UserPersonalization_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowABTest" ADD CONSTRAINT "VoiceflowABTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowABTest" ADD CONSTRAINT "VoiceflowABTest_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowABTestResult" ADD CONSTRAINT "VoiceflowABTestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "VoiceflowABTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowIntentTraining" ADD CONSTRAINT "VoiceflowIntentTraining_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowIntentTraining" ADD CONSTRAINT "VoiceflowIntentTraining_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowConversationEvent" ADD CONSTRAINT "VoiceflowConversationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowConversationEvent" ADD CONSTRAINT "VoiceflowConversationEvent_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowAnalytics" ADD CONSTRAINT "VoiceflowAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowAnalytics" ADD CONSTRAINT "VoiceflowAnalytics_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowLiveConversation" ADD CONSTRAINT "VoiceflowLiveConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowLiveConversation" ADD CONSTRAINT "VoiceflowLiveConversation_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowUserJourney" ADD CONSTRAINT "VoiceflowUserJourney_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowUserJourney" ADD CONSTRAINT "VoiceflowUserJourney_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowConversationFeedback" ADD CONSTRAINT "VoiceflowConversationFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowConversationFeedback" ADD CONSTRAINT "VoiceflowConversationFeedback_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
