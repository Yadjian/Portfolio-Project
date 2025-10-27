/*
  Warnings:

  - A unique constraint covering the columns `[pushToken]` on the table `CandidateProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pushToken]` on the table `RecruiterProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "pushToken" TEXT;

-- AlterTable
ALTER TABLE "RecruiterProfile" ADD COLUMN     "pushToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_pushToken_key" ON "CandidateProfile"("pushToken");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterProfile_pushToken_key" ON "RecruiterProfile"("pushToken");
