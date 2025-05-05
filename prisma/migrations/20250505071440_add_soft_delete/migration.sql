-- AlterTable
ALTER TABLE "Account" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Publish" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "TagCoach" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;
