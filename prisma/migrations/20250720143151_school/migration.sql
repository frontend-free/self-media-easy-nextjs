/*
  Warnings:

  - Added the required column `userId` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "School_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_School" ("address", "createdAt", "deletedAt", "id", "name", "phone", "updatedAt") SELECT "address", "createdAt", "deletedAt", "id", "name", "phone", "updatedAt" FROM "School";
DROP TABLE "School";
ALTER TABLE "new_School" RENAME TO "School";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
