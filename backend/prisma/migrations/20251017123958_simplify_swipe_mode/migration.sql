/*
  Warnings:

  - You are about to drop the column `actorType` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `matchedAt` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `recruiterId` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Swipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[swiperId,recipientId]` on the table `Swipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipientId` to the `Swipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swiperId` to the `Swipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'RECRUITER');

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_recruiterId_fkey";

-- DropIndex
DROP INDEX "public"."Swipe_candidateId_jobId_actorType_key";

-- AlterTable
ALTER TABLE "Swipe" DROP COLUMN "actorType",
DROP COLUMN "candidateId",
DROP COLUMN "jobId",
DROP COLUMN "matchedAt",
DROP COLUMN "recruiterId",
DROP COLUMN "updatedAt",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "swiperId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CANDIDATE';

-- DropEnum
DROP TYPE "public"."SwipeActorType";

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_swiperId_recipientId_key" ON "Swipe"("swiperId", "recipientId");

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_swiperId_fkey" FOREIGN KEY ("swiperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
