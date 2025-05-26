/*
  Warnings:

  - You are about to drop the column `autoTitle` on the `Publish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AutoPublishSetting" ADD COLUMN "autoTitle" BOOLEAN DEFAULT false;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Publish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceType" TEXT NOT NULL,
    "resourceOfVideo" TEXT,
    "title" TEXT,
    "description" TEXT,
    "publishType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Publish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Publish" ("createdAt", "deletedAt", "description", "id", "publishType", "resourceOfVideo", "resourceType", "title", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "description", "id", "publishType", "resourceOfVideo", "resourceType", "title", "updatedAt", "userId" FROM "Publish";
DROP TABLE "Publish";
ALTER TABLE "new_Publish" RENAME TO "Publish";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
