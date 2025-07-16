/*
  Warnings:

  - You are about to drop the column `enabled` on the `AutoPublishSetting` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AutoPublishSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceVideoDir" TEXT,
    "title" TEXT,
    "autoTitle" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutoPublishSetting_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AutoPublishSetting" ("autoTitle", "createdAt", "id", "resourceVideoDir", "title", "updatedAt") SELECT "autoTitle", "createdAt", "id", "resourceVideoDir", "title", "updatedAt" FROM "AutoPublishSetting";
DROP TABLE "AutoPublishSetting";
ALTER TABLE "new_AutoPublishSetting" RENAME TO "AutoPublishSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
