/*
  Warnings:

  - You are about to drop the column `phone` on the `School` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "address" TEXT,
    "description" TEXT,
    "authRewardHours" INTEGER DEFAULT 840,
    "videoRewardHours" INTEGER DEFAULT 600,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "School_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_School" ("address", "authRewardHours", "createdAt", "deletedAt", "id", "name", "updatedAt", "userId", "videoRewardHours") SELECT "address", "authRewardHours", "createdAt", "deletedAt", "id", "name", "updatedAt", "userId", "videoRewardHours" FROM "School";
DROP TABLE "School";
ALTER TABLE "new_School" RENAME TO "School";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
