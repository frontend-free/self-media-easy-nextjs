/*
  Warnings:

  - You are about to drop the column `autoPublishSettingId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `lastRunAt` on the `AutoPublishSetting` table. All the data in the column will be lost.
  - You are about to drop the column `runResourceOfVideos` on the `AutoPublishSetting` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "platformName" TEXT,
    "platformAvatar" TEXT,
    "platformId" TEXT,
    "authInfo" TEXT,
    "status" TEXT DEFAULT 'UNAUTHED',
    "authedAt" DATETIME NOT NULL,
    "logs" TEXT,
    "studentId" TEXT,
    "tagCoachId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Account_tagCoachId_fkey" FOREIGN KEY ("tagCoachId") REFERENCES "TagCoach" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("authInfo", "authedAt", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "studentId", "tagCoachId", "updatedAt", "userId") SELECT "authInfo", "authedAt", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "studentId", "tagCoachId", "updatedAt", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_AutoPublishSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "resourceVideoDir" TEXT,
    "title" TEXT,
    "autoTitle" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutoPublishSetting_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AutoPublishSetting" ("autoTitle", "createdAt", "enabled", "id", "resourceVideoDir", "title", "updatedAt") SELECT "autoTitle", "createdAt", "enabled", "id", "resourceVideoDir", "title", "updatedAt" FROM "AutoPublishSetting";
DROP TABLE "AutoPublishSetting";
ALTER TABLE "new_AutoPublishSetting" RENAME TO "AutoPublishSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
