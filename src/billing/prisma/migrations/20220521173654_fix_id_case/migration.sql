/*
  Warnings:

  - You are about to drop the column `userPublicid` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPublicId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPublicId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_userPublicid_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userPublicid",
ADD COLUMN     "userPublicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "taskId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Account_userPublicId_key" ON "Account"("userPublicId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
