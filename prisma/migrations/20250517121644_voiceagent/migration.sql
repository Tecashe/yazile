-- AlterTable
ALTER TABLE "WorkflowTemplate" ADD COLUMN     "isVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "lastVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BusinessProfileDescription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "automationId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfileDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfileDescription_automationId_key" ON "BusinessProfileDescription"("automationId");

-- CreateIndex
CREATE INDEX "BusinessProfileDescription_userId_idx" ON "BusinessProfileDescription"("userId");

-- CreateIndex
CREATE INDEX "BusinessProfileDescription_automationId_idx" ON "BusinessProfileDescription"("automationId");

-- AddForeignKey
ALTER TABLE "BusinessProfileDescription" ADD CONSTRAINT "BusinessProfileDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfileDescription" ADD CONSTRAINT "BusinessProfileDescription_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
