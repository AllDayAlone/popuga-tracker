/*
  Warnings:

  - A unique constraint covering the columns `[userPublicid]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_userPublicid_key" ON "Account"("userPublicid");
