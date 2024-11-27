/*
  Warnings:

  - You are about to drop the `_UserJoinedEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserJoinedEvents" DROP CONSTRAINT "_UserJoinedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserJoinedEvents" DROP CONSTRAINT "_UserJoinedEvents_B_fkey";

-- DropTable
DROP TABLE "_UserJoinedEvents";
