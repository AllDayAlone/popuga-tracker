/*
  Warnings:

  - A unique constraint covering the columns `[taskPublicId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_taskPublicId_key" ON "Task"("taskPublicId");
