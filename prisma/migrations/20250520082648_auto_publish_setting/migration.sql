-- CreateTable
CREATE TABLE "AutoPublishSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceVideoDir" TEXT,
    "title" TEXT,
    "lastRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutoPublishSetting_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
INSERT INTO "new_Account" ("authInfo", "authedAt", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "tagCoachId", "updatedAt", "userId") SELECT "authInfo", "authedAt", "createdAt", "deletedAt", "id", "logs", "platform", "platformAvatar", "platformId", "platformName", "status", "tagCoachId", "updatedAt", "userId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
