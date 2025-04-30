-- CreateTable
CREATE TABLE "_AccountToPublish" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AccountToPublish_A_fkey" FOREIGN KEY ("A") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AccountToPublish_B_fkey" FOREIGN KEY ("B") REFERENCES "Publish" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToPublish_AB_unique" ON "_AccountToPublish"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToPublish_B_index" ON "_AccountToPublish"("B");
