-- CreateTable
CREATE TABLE "_UserJoinedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserJoinedEvents_AB_unique" ON "_UserJoinedEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_UserJoinedEvents_B_index" ON "_UserJoinedEvents"("B");

-- AddForeignKey
ALTER TABLE "_UserJoinedEvents" ADD CONSTRAINT "_UserJoinedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedEvents" ADD CONSTRAINT "_UserJoinedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
