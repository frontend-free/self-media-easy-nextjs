/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Publish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "schoolId" TEXT;

-- CreateTable
CREATE TABLE "H5Auth" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "qrcode" TEXT,
    "mobileCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "H5Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "autoPublishSettingId" TEXT,
    CONSTRAINT "Account_tagCoachId_fkey" FOREIGN KEY ("tagCoachId") REFERENCES "TagCoach" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_autoPublishSettingId_fkey" FOREIGN KEY ("autoPublishSettingId") REFERENCES "AutoPublishSetting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("authInfo", "authedAt", "autoPublishSettingId", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "tagCoachId", "updatedAt", "userId") SELECT "authInfo", "authedAt", "autoPublishSettingId", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "tagCoachId", "updatedAt", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_Publish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceType" TEXT NOT NULL,
    "resourceOfVideo" TEXT,
    "title" TEXT,
    "description" TEXT,
    "publishType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Publish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Publish" ("createdAt", "description", "id", "publishType", "resourceOfVideo", "resourceType", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "publishType", "resourceOfVideo", "resourceType", "title", "updatedAt", "userId" FROM "Publish";
DROP TABLE "Publish";
ALTER TABLE "new_Publish" RENAME TO "Publish";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
