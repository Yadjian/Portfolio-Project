/*
  Warnings:

  - You are about to drop the column `actorType` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `Swipe` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `Swipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[candidateId,recruiterId]` on the table `Swipe` will be added. If there are existing duplicate values, this will fail.
  - Made the column `recruiterId` on table `Swipe` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Swipe" DROP CONSTRAINT "Swipe_recruiterId_fkey";

-- DropIndex
DROP INDEX "public"."Swipe_candidateId_jobId_actorType_key";

-- AlterTable
ALTER TABLE "Swipe" DROP COLUMN "actorType",
DROP COLUMN "direction",
DROP COLUMN "jobId",
ADD COLUMN     "candidateDirection" "SwipeDirection",
ADD COLUMN     "recruiterDirection" "SwipeDirection",
ALTER COLUMN "recruiterId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_candidateId_recruiterId_key" ON "Swipe"("candidateId", "recruiterId");

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "RecruiterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
