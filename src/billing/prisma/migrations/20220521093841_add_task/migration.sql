-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskPublicId" TEXT NOT NULL,
    "assignCost" INTEGER NOT NULL,
    "bountyCost" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
