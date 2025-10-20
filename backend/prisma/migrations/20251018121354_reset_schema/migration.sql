/*
  Warnings:

  - You are about to drop the column `recipientId` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `swiperId` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidateId,jobId,actorType]` on the table `Swipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actorType` to the `Swipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateId` to the `Swipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Swipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Swipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SwipeActorType" AS ENUM ('CANDIDATE', 'RECRUITER');

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_swiperId_fkey";

-- DropIndex
DROP INDEX "public"."Swipe_swiperId_recipientId_key";

-- AlterTable
ALTER TABLE "Swipe" DROP COLUMN "recipientId",
DROP COLUMN "swiperId",
ADD COLUMN     "actorType" "SwipeActorType" NOT NULL,
ADD COLUMN     "candidateId" TEXT NOT NULL,
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "matchedAt" TIMESTAMP(3),
ADD COLUMN     "recruiterId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_candidateId_jobId_actorType_key" ON "Swipe"("candidateId", "jobId", "actorType");

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "RecruiterProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
