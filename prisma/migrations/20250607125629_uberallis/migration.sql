/*
  Warnings:

  - You are about to drop the `BusinessKnowledge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFlowCustomization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPersonalization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowABTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowABTestResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowConversationEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowConversationFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowIntentTraining` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowLiveConversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoiceflowUserJourney` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[instagramUserId,pageId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BusinessKnowledge" DROP CONSTRAINT "BusinessKnowledge_automationId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessKnowledge" DROP CONSTRAINT "BusinessKnowledge_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFlowCustomization" DROP CONSTRAINT "UserFlowCustomization_automationId_fkey";

-- DropForeignKey
ALTER TABLE "UserFlowCustomization" DROP CONSTRAINT "UserFlowCustomization_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonalization" DROP CONSTRAINT "UserPersonalization_automationId_fkey";

-- DropForeignKey
ALTER TABLE "UserPersonalization" DROP CONSTRAINT "UserPersonalization_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowABTest" DROP CONSTRAINT "VoiceflowABTest_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowABTest" DROP CONSTRAINT "VoiceflowABTest_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowABTestResult" DROP CONSTRAINT "VoiceflowABTestResult_testId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowAnalytics" DROP CONSTRAINT "VoiceflowAnalytics_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowAnalytics" DROP CONSTRAINT "VoiceflowAnalytics_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowConversationEvent" DROP CONSTRAINT "VoiceflowConversationEvent_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowConversationEvent" DROP CONSTRAINT "VoiceflowConversationEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowConversationFeedback" DROP CONSTRAINT "VoiceflowConversationFeedback_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowConversationFeedback" DROP CONSTRAINT "VoiceflowConversationFeedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowIntentTraining" DROP CONSTRAINT "VoiceflowIntentTraining_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowIntentTraining" DROP CONSTRAINT "VoiceflowIntentTraining_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowLiveConversation" DROP CONSTRAINT "VoiceflowLiveConversation_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowLiveConversation" DROP CONSTRAINT "VoiceflowLiveConversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowUserJourney" DROP CONSTRAINT "VoiceflowUserJourney_automationId_fkey";

-- DropForeignKey
ALTER TABLE "VoiceflowUserJourney" DROP CONSTRAINT "VoiceflowUserJourney_userId_fkey";

-- DropTable
DROP TABLE "BusinessKnowledge";

-- DropTable
DROP TABLE "UserFlowCustomization";

-- DropTable
DROP TABLE "UserPersonalization";

-- DropTable
DROP TABLE "VoiceflowABTest";

-- DropTable
DROP TABLE "VoiceflowABTestResult";

-- DropTable
DROP TABLE "VoiceflowAnalytics";

-- DropTable
DROP TABLE "VoiceflowConversationEvent";

-- DropTable
DROP TABLE "VoiceflowConversationFeedback";

-- DropTable
DROP TABLE "VoiceflowIntentTraining";

-- DropTable
DROP TABLE "VoiceflowLiveConversation";

-- DropTable
DROP TABLE "VoiceflowUserJourney";

-- CreateIndex
CREATE UNIQUE INDEX "Lead_instagramUserId_pageId_key" ON "Lead"("instagramUserId", "pageId");
