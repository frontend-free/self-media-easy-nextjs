-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AutoPublishSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceVideoDir" TEXT,
    "title" TEXT,
    "autoTitle" BOOLEAN DEFAULT false,
    "publishCount" INTEGER DEFAULT 2,
    "autoAdText" BOOLEAN DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutoPublishSetting_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AutoPublishSetting" ("autoAdText", "autoTitle", "createdAt", "id", "publishCount", "resourceVideoDir", "title", "updatedAt") SELECT "autoAdText", "autoTitle", "createdAt", "id", "publishCount", "resourceVideoDir", "title", "updatedAt" FROM "AutoPublishSetting";
DROP TABLE "AutoPublishSetting";
ALTER TABLE "new_AutoPublishSetting" RENAME TO "AutoPublishSetting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
