/*
  Warnings:

  - The primary key for the `ConversationState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ConversationState` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "listenMode" TEXT NOT NULL DEFAULT 'KEYWORDS';

-- AlterTable
ALTER TABLE "ConversationState" DROP CONSTRAINT "ConversationState_pkey",
ADD COLUMN     "automationId" TEXT,
ADD COLUMN     "averageResponseTime" DOUBLE PRECISION,
ADD COLUMN     "handoffReason" TEXT,
ADD COLUMN     "isInHandoff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastMessageLength" INTEGER,
ADD COLUMN     "listenMode" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "isActive" SET DEFAULT false,
ADD CONSTRAINT "ConversationState_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "ConversationState_userId_idx" ON "ConversationState"("userId");

-- CreateIndex
CREATE INDEX "ConversationState_isActive_idx" ON "ConversationState"("isActive");
