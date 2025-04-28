-- CreateTable
CREATE TABLE "TagCoach" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TagCoach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tagCoachId" TEXT NOT NULL,
    CONSTRAINT "Account_tagCoachId_fkey" FOREIGN KEY ("tagCoachId") REFERENCES "TagCoach" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
