/*
  Warnings:

  - The values [TEAM] on the enum `SUBSCRIPTION_PLAN` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `autoReplyEnabled` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `automationAdditionalNotes` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `automationGoals` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `automationSetupComplete` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `automationSetupDate` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `businessHours` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `businessTypeData` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `customerJourney` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `facebookPageId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `goalStatement` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `growthChallenges` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `instagramHandle` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `learningTopics` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinProfileId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingCompleted` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `pinterestHandle` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `promotionMessage` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `targetAudience` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `tiktokHandle` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `twitterHandle` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `websiteAnalysis` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeMessage` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNumber` on the `Business` table. All the data in the column will be lost.
  - The primary key for the `ProcessedMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProcessedMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `businessImpact` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `n8nExecutionId` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `resourceUsage` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `success` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the `AIDiscoverySettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliateClick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliatePayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliateProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliateReferral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AffiliateUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessProfileDescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignInfluencer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollabChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollabChatParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CollabMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommissionPayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentSample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomRequestMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomWorkflowRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataSourceSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExecutionEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Influencer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerEarnings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerImport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerListInfluencer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerMetrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerRates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfluencerRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstagramCredentials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `N8nConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `N8nWorkflowConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboardingProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboardingStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Opportunity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpportunityApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalFormField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalVerificationSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralClick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralProgram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedSearch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWorkflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppBusiness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppStat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowCredential` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkflowTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InfluencerToList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[automationId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lemonSqueezySubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProcessedMessage` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `WorkflowExecution` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `inputData` on table `WorkflowExecution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outputData` on table `WorkflowExecution` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AutomationGoalType" AS ENUM ('PAYMENT_PROCESSING', 'ECOMMERCE_INTEGRATION', 'APPOINTMENT_BOOKING', 'CUSTOMER_SUPPORT', 'LEAD_QUALIFICATION', 'CONTENT_DELIVERY', 'REVIEWS_FEEDBACK', 'PERSONALIZED_MARKETING');

-- CreateEnum
CREATE TYPE "GeneralNotificationType" AS ENUM ('LEAD_GENERATED', 'LEAD_QUALIFIED', 'AUTOMATION_COMPLETED', 'AUTOMATION_ERROR', 'CAMPAIGN_STARTED', 'CAMPAIGN_COMPLETED', 'INFLUENCER_APPLIED', 'INFLUENCER_ACCEPTED', 'WORKFLOW_ACTIVATED', 'WORKFLOW_COMPLETED', 'WORKFLOW_ASSIGNED', 'WORKFLOW_EDIT_REQUEST', 'EDIT_REQUESTED', 'CRM_SYNC_SUCCESS', 'CRM_SYNC_ERROR', 'SYSTEM_ALERT', 'BUSINESS_UPDATE');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('AIRTABLE', 'STRIPE', 'HUBSPOT', 'SALESFORCE', 'PIPEDRIVE', 'MAILCHIMP', 'SENDGRID', 'TWILIO', 'SLACK', 'ZAPIER', 'WEBHOOK', 'CALENDLY', 'DISCORD', 'NOTION', 'PAYPAL', 'ZOOM', 'SHOPIFY');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED', 'ERROR');

-- AlterEnum
BEGIN;
CREATE TYPE "SUBSCRIPTION_PLAN_new" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
ALTER TABLE "Subscription" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "SUBSCRIPTION_PLAN_new" USING ("plan"::text::"SUBSCRIPTION_PLAN_new");
ALTER TYPE "SUBSCRIPTION_PLAN" RENAME TO "SUBSCRIPTION_PLAN_old";
ALTER TYPE "SUBSCRIPTION_PLAN_new" RENAME TO "SUBSCRIPTION_PLAN";
DROP TYPE "SUBSCRIPTION_PLAN_old";
ALTER TABLE "Subscription" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;

-- DropForeignKey
ALTER TABLE "AIDiscoverySettings" DROP CONSTRAINT "AIDiscoverySettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateClick" DROP CONSTRAINT "AffiliateClick_affiliateId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliatePayout" DROP CONSTRAINT "AffiliatePayout_affiliateId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliatePayout" DROP CONSTRAINT "AffiliatePayout_programId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateReferral" DROP CONSTRAINT "AffiliateReferral_affiliateId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateReferral" DROP CONSTRAINT "AffiliateReferral_payoutId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateReferral" DROP CONSTRAINT "AffiliateReferral_programId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateReferral" DROP CONSTRAINT "AffiliateReferral_referredUserId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateUser" DROP CONSTRAINT "AffiliateUser_programId_fkey";

-- DropForeignKey
ALTER TABLE "AffiliateUser" DROP CONSTRAINT "AffiliateUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_opportunityId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessProfile" DROP CONSTRAINT "BusinessProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessProfileDescription" DROP CONSTRAINT "BusinessProfileDescription_automationId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessProfileDescription" DROP CONSTRAINT "BusinessProfileDescription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_businessProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_userId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignAnalytics" DROP CONSTRAINT "CampaignAnalytics_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignInfluencer" DROP CONSTRAINT "CampaignInfluencer_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignInfluencer" DROP CONSTRAINT "CampaignInfluencer_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "ChatAttachment" DROP CONSTRAINT "ChatAttachment_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "ChatAttachment" DROP CONSTRAINT "ChatAttachment_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "CollabChatParticipant" DROP CONSTRAINT "CollabChatParticipant_businessId_fkey";

-- DropForeignKey
ALTER TABLE "CollabChatParticipant" DROP CONSTRAINT "CollabChatParticipant_chatId_fkey";

-- DropForeignKey
ALTER TABLE "CollabChatParticipant" DROP CONSTRAINT "CollabChatParticipant_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "CollabChatParticipant" DROP CONSTRAINT "CollabChatParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "CollabMessage" DROP CONSTRAINT "CollabMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "CollabMessage" DROP CONSTRAINT "CollabMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "CommissionPayout" DROP CONSTRAINT "CommissionPayout_programId_fkey";

-- DropForeignKey
ALTER TABLE "CommissionPayout" DROP CONSTRAINT "CommissionPayout_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContentSample" DROP CONSTRAINT "ContentSample_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ContentType" DROP CONSTRAINT "ContentType_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomRequestMessage" DROP CONSTRAINT "CustomRequestMessage_requestId_fkey";

-- DropForeignKey
ALTER TABLE "CustomWorkflowRequest" DROP CONSTRAINT "CustomWorkflowRequest_templateId_fkey";

-- DropForeignKey
ALTER TABLE "CustomWorkflowRequest" DROP CONSTRAINT "CustomWorkflowRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceSettings" DROP CONSTRAINT "DataSourceSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExecutionEvent" DROP CONSTRAINT "ExecutionEvent_executionId_fkey";

-- DropForeignKey
ALTER TABLE "ImportHistory" DROP CONSTRAINT "ImportHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Influencer" DROP CONSTRAINT "Influencer_userId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerEarnings" DROP CONSTRAINT "InfluencerEarnings_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerImport" DROP CONSTRAINT "InfluencerImport_userId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerList" DROP CONSTRAINT "InfluencerList_userId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerListInfluencer" DROP CONSTRAINT "InfluencerListInfluencer_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerListInfluencer" DROP CONSTRAINT "InfluencerListInfluencer_listId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerMetrics" DROP CONSTRAINT "InfluencerMetrics_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerRates" DROP CONSTRAINT "InfluencerRates_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerRating" DROP CONSTRAINT "InfluencerRating_businessId_fkey";

-- DropForeignKey
ALTER TABLE "InfluencerRating" DROP CONSTRAINT "InfluencerRating_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "InstagramCredentials" DROP CONSTRAINT "InstagramCredentials_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "N8nConnection" DROP CONSTRAINT "N8nConnection_userId_fkey";

-- DropForeignKey
ALTER TABLE "N8nWorkflowConfig" DROP CONSTRAINT "N8nWorkflowConfig_connectionId_fkey";

-- DropForeignKey
ALTER TABLE "OnboardingProgress" DROP CONSTRAINT "OnboardingProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "OnboardingStep" DROP CONSTRAINT "OnboardingStep_progressId_fkey";

-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_businessId_fkey";

-- DropForeignKey
ALTER TABLE "OpportunityApplication" DROP CONSTRAINT "OpportunityApplication_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "OpportunityApplication" DROP CONSTRAINT "OpportunityApplication_opportunityId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "PortalFormField" DROP CONSTRAINT "PortalFormField_portalId_fkey";

-- DropForeignKey
ALTER TABLE "PortalSettings" DROP CONSTRAINT "PortalSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "PortalVerificationSettings" DROP CONSTRAINT "PortalVerificationSettings_portalId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_commissionPayoutId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_programId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referralCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referredUserId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referrerId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralCode" DROP CONSTRAINT "ReferralCode_programId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralCode" DROP CONSTRAINT "ReferralCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSearch" DROP CONSTRAINT "SavedSearch_businessId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSearch" DROP CONSTRAINT "SavedSearch_userId_fkey";

-- DropForeignKey
ALTER TABLE "SocialAccount" DROP CONSTRAINT "SocialAccount_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkflow" DROP CONSTRAINT "UserWorkflow_templateId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkflow" DROP CONSTRAINT "UserWorkflow_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppBusiness" DROP CONSTRAINT "WhatsAppBusiness_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppRule" DROP CONSTRAINT "WhatsAppRule_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppRule" DROP CONSTRAINT "WhatsAppRule_whatsappBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppStat" DROP CONSTRAINT "WhatsAppStat_whatsappBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppTemplate" DROP CONSTRAINT "WhatsAppTemplate_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppTemplate" DROP CONSTRAINT "WhatsAppTemplate_whatsappBusinessId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowCredential" DROP CONSTRAINT "WorkflowCredential_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowExecution" DROP CONSTRAINT "WorkflowExecution_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "_InfluencerToList" DROP CONSTRAINT "_InfluencerToList_A_fkey";

-- DropForeignKey
ALTER TABLE "_InfluencerToList" DROP CONSTRAINT "_InfluencerToList_B_fkey";

-- DropIndex
DROP INDEX "User_firstname_key";

-- DropIndex
DROP INDEX "User_lastname_key";

-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "buttons" JSONB,
ADD COLUMN     "fallbackMessage" TEXT,
ADD COLUMN     "isFallback" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "autoReplyEnabled",
DROP COLUMN "automationAdditionalNotes",
DROP COLUMN "automationGoals",
DROP COLUMN "automationSetupComplete",
DROP COLUMN "automationSetupDate",
DROP COLUMN "businessHours",
DROP COLUMN "businessTypeData",
DROP COLUMN "customerJourney",
DROP COLUMN "facebookPageId",
DROP COLUMN "features",
DROP COLUMN "goalStatement",
DROP COLUMN "growthChallenges",
DROP COLUMN "industry",
DROP COLUMN "instagramHandle",
DROP COLUMN "learningTopics",
DROP COLUMN "linkedinProfileId",
DROP COLUMN "location",
DROP COLUMN "logo",
DROP COLUMN "onboardingCompleted",
DROP COLUMN "pinterestHandle",
DROP COLUMN "promotionMessage",
DROP COLUMN "size",
DROP COLUMN "targetAudience",
DROP COLUMN "tiktokHandle",
DROP COLUMN "twitterHandle",
DROP COLUMN "websiteAnalysis",
DROP COLUMN "welcomeMessage",
DROP COLUMN "whatsappNumber",
ADD COLUMN     "automationId" UUID;

-- AlterTable
ALTER TABLE "CrmIntegration" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "LeadQualificationData" ADD COLUMN     "estimatedValue" DECIMAL(10,2),
ADD COLUMN     "leadTier" TEXT,
ADD COLUMN     "revenueScore" INTEGER DEFAULT 0,
ADD COLUMN     "roi" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "data" JSONB,
ADD COLUMN     "leadId" UUID,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ProcessedMessage" DROP CONSTRAINT "ProcessedMessage_pkey",
ADD COLUMN     "processCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ProcessedMessage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "interval" TEXT,
ADD COLUMN     "intervalCount" INTEGER DEFAULT 1,
ADD COLUMN     "lemonSqueezyCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "lemonSqueezyCurrentPeriodStart" TIMESTAMP(3),
ADD COLUMN     "lemonSqueezySubscriptionId" TEXT,
ADD COLUMN     "lemonSqueezyVariantId" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "productName" TEXT,
ADD COLUMN     "variantName" TEXT;

-- AlterTable
ALTER TABLE "WorkflowExecution" DROP COLUMN "businessImpact",
DROP COLUMN "duration",
DROP COLUMN "n8nExecutionId",
DROP COLUMN "resourceUsage",
DROP COLUMN "success",
ADD COLUMN     "errorStep" TEXT,
ADD COLUMN     "executionLog" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "triggeredBy" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "inputData" SET NOT NULL,
ALTER COLUMN "inputData" SET DEFAULT '{}',
ALTER COLUMN "inputData" SET DATA TYPE TEXT,
ALTER COLUMN "outputData" SET NOT NULL,
ALTER COLUMN "outputData" SET DEFAULT '{}',
ALTER COLUMN "outputData" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "AIDiscoverySettings";

-- DropTable
DROP TABLE "AffiliateClick";

-- DropTable
DROP TABLE "AffiliatePayout";

-- DropTable
DROP TABLE "AffiliateProgram";

-- DropTable
DROP TABLE "AffiliateReferral";

-- DropTable
DROP TABLE "AffiliateUser";

-- DropTable
DROP TABLE "Application";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "BusinessProfile";

-- DropTable
DROP TABLE "BusinessProfileDescription";

-- DropTable
DROP TABLE "Campaign";

-- DropTable
DROP TABLE "CampaignAnalytics";

-- DropTable
DROP TABLE "CampaignInfluencer";

-- DropTable
DROP TABLE "ChatAttachment";

-- DropTable
DROP TABLE "CollabChat";

-- DropTable
DROP TABLE "CollabChatParticipant";

-- DropTable
DROP TABLE "CollabMessage";

-- DropTable
DROP TABLE "CommissionPayout";

-- DropTable
DROP TABLE "ContentSample";

-- DropTable
DROP TABLE "ContentType";

-- DropTable
DROP TABLE "CustomRequestMessage";

-- DropTable
DROP TABLE "CustomWorkflowRequest";

-- DropTable
DROP TABLE "DataSourceSettings";

-- DropTable
DROP TABLE "ExecutionEvent";

-- DropTable
DROP TABLE "ImportHistory";

-- DropTable
DROP TABLE "Influencer";

-- DropTable
DROP TABLE "InfluencerEarnings";

-- DropTable
DROP TABLE "InfluencerImport";

-- DropTable
DROP TABLE "InfluencerList";

-- DropTable
DROP TABLE "InfluencerListInfluencer";

-- DropTable
DROP TABLE "InfluencerMetrics";

-- DropTable
DROP TABLE "InfluencerRates";

-- DropTable
DROP TABLE "InfluencerRating";

-- DropTable
DROP TABLE "InstagramCredentials";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "InvoiceItem";

-- DropTable
DROP TABLE "N8nConnection";

-- DropTable
DROP TABLE "N8nWorkflowConfig";

-- DropTable
DROP TABLE "OnboardingProgress";

-- DropTable
DROP TABLE "OnboardingStep";

-- DropTable
DROP TABLE "Opportunity";

-- DropTable
DROP TABLE "OpportunityApplication";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PortalFormField";

-- DropTable
DROP TABLE "PortalSettings";

-- DropTable
DROP TABLE "PortalVerificationSettings";

-- DropTable
DROP TABLE "Referral";

-- DropTable
DROP TABLE "ReferralClick";

-- DropTable
DROP TABLE "ReferralCode";

-- DropTable
DROP TABLE "ReferralProgram";

-- DropTable
DROP TABLE "SavedSearch";

-- DropTable
DROP TABLE "SocialAccount";

-- DropTable
DROP TABLE "UserWorkflow";

-- DropTable
DROP TABLE "VerificationCode";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "WhatsAppBusiness";

-- DropTable
DROP TABLE "WhatsAppRule";

-- DropTable
DROP TABLE "WhatsAppStat";

-- DropTable
DROP TABLE "WhatsAppTemplate";

-- DropTable
DROP TABLE "WorkflowAnalytics";

-- DropTable
DROP TABLE "WorkflowCredential";

-- DropTable
DROP TABLE "WorkflowNotification";

-- DropTable
DROP TABLE "WorkflowTemplate";

-- DropTable
DROP TABLE "_InfluencerToList";

-- DropEnum
DROP TYPE "CommissionType";

-- DropEnum
DROP TYPE "CustomRequestStatus";

-- DropEnum
DROP TYPE "ExecutionStatus";

-- DropEnum
DROP TYPE "InfluencerSource";

-- DropEnum
DROP TYPE "InfluencerStatus";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "MyCampaignStatus";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "OnboardingStepStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PayoutStatus";

-- DropEnum
DROP TYPE "ReferralStatus";

-- DropEnum
DROP TYPE "RequestUrgency";

-- DropEnum
DROP TYPE "WorkflowCategory";

-- DropEnum
DROP TYPE "WorkflowComplexity";

-- DropEnum
DROP TYPE "WorkflowStatus";

-- CreateTable
CREATE TABLE "AutomationGoal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "goalType" "AutomationGoalType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "customConfig" JSONB,
    "businessId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAgent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT,
    "agentType" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "friendliness" INTEGER NOT NULL DEFAULT 5,
    "formality" INTEGER NOT NULL DEFAULT 5,
    "enthusiasm" INTEGER NOT NULL DEFAULT 5,
    "empathy" INTEGER NOT NULL DEFAULT 5,
    "humor" INTEGER NOT NULL DEFAULT 5,
    "patience" INTEGER NOT NULL DEFAULT 5,
    "expertise" INTEGER NOT NULL DEFAULT 5,
    "primaryLanguage" TEXT NOT NULL DEFAULT 'English',
    "detectLanguage" BOOLEAN NOT NULL DEFAULT true,
    "supportedLanguages" TEXT[],
    "responseStyle" TEXT NOT NULL DEFAULT 'professional',
    "tone" TEXT,
    "introductoryStatement" TEXT,
    "businessId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "details" TEXT,
    "entityId" UUID,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "desktopNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "autoMarkAsRead" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTracker" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "automationId" UUID NOT NULL,
    "pageId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "messages" TEXT[],
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentimentAnalysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "automationId" UUID NOT NULL,
    "pageId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "messages" TEXT[],
    "sentimentScore" DOUBLE PRECISION,
    "metrics" TEXT,
    "emotions" TEXT,
    "insights" TEXT,
    "metadata" TEXT,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentimentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumAnalytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "totalAnalyses" INTEGER NOT NULL DEFAULT 0,
    "platinumLeads" INTEGER NOT NULL DEFAULT 0,
    "goldLeads" INTEGER NOT NULL DEFAULT 0,
    "silverLeads" INTEGER NOT NULL DEFAULT 0,
    "bronzeLeads" INTEGER NOT NULL DEFAULT 0,
    "totalEstimatedRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalExpectedRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "averageROI" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueMetrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "totalEstimatedRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalExpectedRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "qualifiedLeads" INTEGER NOT NULL DEFAULT 0,
    "averageROI" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueOpportunity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "estimatedValue" DECIMAL(10,2) NOT NULL,
    "expectedRevenue" DECIMAL(10,2) NOT NULL,
    "roi" DECIMAL(5,2) NOT NULL,
    "conversionProbability" DECIMAL(3,2) NOT NULL,
    "leadTier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledAction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "executedAt" TIMESTAMP(3),
    "result" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmSyncSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "autoSyncQualified" BOOLEAN NOT NULL DEFAULT true,
    "createDealsHighValue" BOOLEAN NOT NULL DEFAULT true,
    "syncLeadScores" BOOLEAN NOT NULL DEFAULT true,
    "realTimeSync" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmSyncSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "recipientKey" TEXT NOT NULL,
    "responseHash" TEXT NOT NULL,
    "responseContent" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "automationId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentimentAlert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "automationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "urgencyLevel" TEXT NOT NULL,
    "satisfactionLevel" TEXT NOT NULL,
    "insights" TEXT,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentimentAnalysisId" UUID,

    CONSTRAINT "SentimentAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "leadId" UUID,
    "metadata" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralNotification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "businessId" UUID,
    "type" "GeneralNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "GeneralNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "encryptedCredentials" TEXT NOT NULL,
    "credentialsHash" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT,
    "config" TEXT,
    "capabilities" TEXT DEFAULT '{}',
    "lastSyncAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "lastError" TEXT,
    "syncCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceflowSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "userId" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'instagram',
    "variables" TEXT,
    "context" TEXT,
    "lastStep" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "VoiceflowSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID,
    "integrationId" UUID,
    "sessionId" UUID,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "requestHeaders" TEXT,
    "requestBody" TEXT,
    "statusCode" INTEGER NOT NULL,
    "responseHeaders" TEXT,
    "responseBody" TEXT,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "headers" TEXT,
    "payload" TEXT NOT NULL,
    "signature" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "wabaId" TEXT NOT NULL,
    "businessPhoneNumberId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "displayName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "webhookToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "appId" TEXT NOT NULL,
    "appSecret" TEXT NOT NULL,
    "businessVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID NOT NULL,
    "templateName" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "headerType" TEXT,
    "headerText" TEXT,
    "bodyText" TEXT NOT NULL,
    "footerText" TEXT,
    "buttonType" TEXT,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID NOT NULL,
    "messageId" TEXT,
    "waId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "contactName" TEXT,
    "messageType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "templateName" TEXT,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" UUID,
    "automationRuleId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID NOT NULL,
    "waId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT,
    "profileName" TEXT,
    "lastSeen" TIMESTAMP(3),
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateId" TEXT,
    "targetAudience" JSONB NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalTargets" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_automation_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" TEXT NOT NULL,
    "triggerValue" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "responseType" TEXT NOT NULL,
    "responseContent" TEXT NOT NULL,
    "responseTemplateId" TEXT,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "businessHoursOnly" BOOLEAN NOT NULL DEFAULT false,
    "maxResponses" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_webhook_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "whatsAppAccountId" UUID,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "aiPrompt" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "timeoutSeconds" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" UUID NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "integrationId" UUID NOT NULL,
    "integrationName" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "capabilityName" TEXT NOT NULL,
    "config" TEXT NOT NULL DEFAULT '{}',
    "positionX" INTEGER NOT NULL DEFAULT 0,
    "positionY" INTEGER NOT NULL DEFAULT 0,
    "stepOrder" INTEGER NOT NULL DEFAULT 0,
    "parentStepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowCondition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflowId" UUID NOT NULL,
    "conditionId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "trueStepId" TEXT,
    "falseStepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutomationGoal_businessId_idx" ON "AutomationGoal"("businessId");

-- CreateIndex
CREATE INDEX "AutomationGoal_goalType_idx" ON "AutomationGoal"("goalType");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationGoal_businessId_goalType_key" ON "AutomationGoal"("businessId", "goalType");

-- CreateIndex
CREATE INDEX "AIAgent_businessId_idx" ON "AIAgent"("businessId");

-- CreateIndex
CREATE INDEX "AIAgent_agentType_idx" ON "AIAgent"("agentType");

-- CreateIndex
CREATE INDEX "AIAgent_isActive_idx" ON "AIAgent"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "MessageTracker_automationId_idx" ON "MessageTracker"("automationId");

-- CreateIndex
CREATE INDEX "MessageTracker_lastMessageAt_idx" ON "MessageTracker"("lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTracker_automationId_pageId_senderId_key" ON "MessageTracker"("automationId", "pageId", "senderId");

-- CreateIndex
CREATE INDEX "SentimentAnalysis_automationId_idx" ON "SentimentAnalysis"("automationId");

-- CreateIndex
CREATE INDEX "SentimentAnalysis_analyzedAt_idx" ON "SentimentAnalysis"("analyzedAt");

-- CreateIndex
CREATE INDEX "SentimentAnalysis_sentiment_idx" ON "SentimentAnalysis"("sentiment");

-- CreateIndex
CREATE INDEX "PremiumAnalytics_userId_idx" ON "PremiumAnalytics"("userId");

-- CreateIndex
CREATE INDEX "PremiumAnalytics_date_idx" ON "PremiumAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumAnalytics_userId_date_key" ON "PremiumAnalytics"("userId", "date");

-- CreateIndex
CREATE INDEX "RevenueMetrics_userId_idx" ON "RevenueMetrics"("userId");

-- CreateIndex
CREATE INDEX "RevenueMetrics_date_idx" ON "RevenueMetrics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueMetrics_userId_date_key" ON "RevenueMetrics"("userId", "date");

-- CreateIndex
CREATE INDEX "RevenueOpportunity_userId_idx" ON "RevenueOpportunity"("userId");

-- CreateIndex
CREATE INDEX "RevenueOpportunity_leadTier_idx" ON "RevenueOpportunity"("leadTier");

-- CreateIndex
CREATE INDEX "RevenueOpportunity_status_idx" ON "RevenueOpportunity"("status");

-- CreateIndex
CREATE INDEX "ScheduledAction_leadId_idx" ON "ScheduledAction"("leadId");

-- CreateIndex
CREATE INDEX "ScheduledAction_scheduledFor_idx" ON "ScheduledAction"("scheduledFor");

-- CreateIndex
CREATE INDEX "ScheduledAction_status_idx" ON "ScheduledAction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CrmSyncSettings_userId_key" ON "CrmSyncSettings"("userId");

-- CreateIndex
CREATE INDEX "SentResponse_recipientKey_idx" ON "SentResponse"("recipientKey");

-- CreateIndex
CREATE INDEX "SentResponse_responseHash_idx" ON "SentResponse"("responseHash");

-- CreateIndex
CREATE INDEX "SentResponse_sentAt_idx" ON "SentResponse"("sentAt");

-- CreateIndex
CREATE INDEX "SentResponse_recipientKey_sentAt_idx" ON "SentResponse"("recipientKey", "sentAt");

-- CreateIndex
CREATE INDEX "SentimentAlert_automationId_idx" ON "SentimentAlert"("automationId");

-- CreateIndex
CREATE INDEX "SentimentAlert_senderId_idx" ON "SentimentAlert"("senderId");

-- CreateIndex
CREATE INDEX "SentimentAlert_riskLevel_idx" ON "SentimentAlert"("riskLevel");

-- CreateIndex
CREATE INDEX "SentimentAlert_resolved_idx" ON "SentimentAlert"("resolved");

-- CreateIndex
CREATE INDEX "SentimentAlert_triggeredAt_idx" ON "SentimentAlert"("triggeredAt");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_type_idx" ON "Alert"("type");

-- CreateIndex
CREATE INDEX "Alert_priority_idx" ON "Alert"("priority");

-- CreateIndex
CREATE INDEX "Alert_resolved_idx" ON "Alert"("resolved");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "GeneralNotification_userId_isRead_idx" ON "GeneralNotification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "GeneralNotification_userId_createdAt_idx" ON "GeneralNotification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "GeneralNotification_businessId_idx" ON "GeneralNotification"("businessId");

-- CreateIndex
CREATE INDEX "Tenant_userId_idx" ON "Tenant"("userId");

-- CreateIndex
CREATE INDEX "Tenant_isActive_idx" ON "Tenant"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "Tenant"("userId");

-- CreateIndex
CREATE INDEX "Integration_tenantId_idx" ON "Integration"("tenantId");

-- CreateIndex
CREATE INDEX "Integration_type_idx" ON "Integration"("type");

-- CreateIndex
CREATE INDEX "Integration_isActive_idx" ON "Integration"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_tenantId_type_key" ON "Integration"("tenantId", "type");

-- CreateIndex
CREATE INDEX "VoiceflowSession_tenantId_idx" ON "VoiceflowSession"("tenantId");

-- CreateIndex
CREATE INDEX "VoiceflowSession_userId_idx" ON "VoiceflowSession"("userId");

-- CreateIndex
CREATE INDEX "VoiceflowSession_status_idx" ON "VoiceflowSession"("status");

-- CreateIndex
CREATE INDEX "VoiceflowSession_lastActiveAt_idx" ON "VoiceflowSession"("lastActiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceflowSession_sessionId_key" ON "VoiceflowSession"("sessionId");

-- CreateIndex
CREATE INDEX "ApiLog_tenantId_idx" ON "ApiLog"("tenantId");

-- CreateIndex
CREATE INDEX "ApiLog_integrationId_idx" ON "ApiLog"("integrationId");

-- CreateIndex
CREATE INDEX "ApiLog_sessionId_idx" ON "ApiLog"("sessionId");

-- CreateIndex
CREATE INDEX "ApiLog_timestamp_idx" ON "ApiLog"("timestamp");

-- CreateIndex
CREATE INDEX "ApiLog_statusCode_idx" ON "ApiLog"("statusCode");

-- CreateIndex
CREATE INDEX "WebhookLog_tenantId_idx" ON "WebhookLog"("tenantId");

-- CreateIndex
CREATE INDEX "WebhookLog_source_idx" ON "WebhookLog"("source");

-- CreateIndex
CREATE INDEX "WebhookLog_eventType_idx" ON "WebhookLog"("eventType");

-- CreateIndex
CREATE INDEX "WebhookLog_processed_idx" ON "WebhookLog"("processed");

-- CreateIndex
CREATE INDEX "WebhookLog_timestamp_idx" ON "WebhookLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_accounts_wabaId_key" ON "whatsapp_accounts"("wabaId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_accounts_businessPhoneNumberId_key" ON "whatsapp_accounts"("businessPhoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_templates_whatsAppAccountId_templateName_key" ON "whatsapp_templates"("whatsAppAccountId", "templateName");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contacts_whatsAppAccountId_waId_key" ON "whatsapp_contacts"("whatsAppAccountId", "waId");

-- CreateIndex
CREATE INDEX "Workflow_tenantId_idx" ON "Workflow"("tenantId");

-- CreateIndex
CREATE INDEX "Workflow_isActive_idx" ON "Workflow"("isActive");

-- CreateIndex
CREATE INDEX "WorkflowStep_workflowId_idx" ON "WorkflowStep"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowStep_integrationId_idx" ON "WorkflowStep"("integrationId");

-- CreateIndex
CREATE INDEX "WorkflowStep_stepOrder_idx" ON "WorkflowStep"("stepOrder");

-- CreateIndex
CREATE INDEX "WorkflowCondition_workflowId_idx" ON "WorkflowCondition"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_automationId_key" ON "Business"("automationId");

-- CreateIndex
CREATE INDEX "Business_userId_idx" ON "Business"("userId");

-- CreateIndex
CREATE INDEX "Business_automationId_idx" ON "Business"("automationId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "ProcessedMessage_processCount_idx" ON "ProcessedMessage"("processCount");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_lemonSqueezySubscriptionId_key" ON "Subscription"("lemonSqueezySubscriptionId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");

-- AddForeignKey
ALTER TABLE "AutomationGoal" ADD CONSTRAINT "AutomationGoal_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAgent" ADD CONSTRAINT "AIAgent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageTracker" ADD CONSTRAINT "MessageTracker_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentimentAnalysis" ADD CONSTRAINT "SentimentAnalysis_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumAnalytics" ADD CONSTRAINT "PremiumAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueMetrics" ADD CONSTRAINT "RevenueMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueOpportunity" ADD CONSTRAINT "RevenueOpportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueOpportunity" ADD CONSTRAINT "RevenueOpportunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledAction" ADD CONSTRAINT "ScheduledAction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmSyncSettings" ADD CONSTRAINT "CrmSyncSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentimentAlert" ADD CONSTRAINT "SentimentAlert_sentimentAnalysisId_fkey" FOREIGN KEY ("sentimentAnalysisId") REFERENCES "SentimentAnalysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralNotification" ADD CONSTRAINT "GeneralNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralNotification" ADD CONSTRAINT "GeneralNotification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceflowSession" ADD CONSTRAINT "VoiceflowSession_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VoiceflowSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookLog" ADD CONSTRAINT "WebhookLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_accounts" ADD CONSTRAINT "whatsapp_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_templates" ADD CONSTRAINT "whatsapp_templates_whatsAppAccountId_fkey" FOREIGN KEY ("whatsAppAccountId") REFERENCES "whatsapp_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_whatsAppAccountId_fkey" FOREIGN KEY ("whatsAppAccountId") REFERENCES "whatsapp_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "whatsapp_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_automationRuleId_fkey" FOREIGN KEY ("automationRuleId") REFERENCES "whatsapp_automation_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_contacts" ADD CONSTRAINT "whatsapp_contacts_whatsAppAccountId_fkey" FOREIGN KEY ("whatsAppAccountId") REFERENCES "whatsapp_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_campaigns" ADD CONSTRAINT "whatsapp_campaigns_whatsAppAccountId_fkey" FOREIGN KEY ("whatsAppAccountId") REFERENCES "whatsapp_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_automation_rules" ADD CONSTRAINT "whatsapp_automation_rules_whatsAppAccountId_fkey" FOREIGN KEY ("whatsAppAccountId") REFERENCES "whatsapp_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowCondition" ADD CONSTRAINT "WorkflowCondition_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
