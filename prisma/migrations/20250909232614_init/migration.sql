/*
  Warnings:

  - You are about to drop the `Pouch` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN "bloodType" TEXT DEFAULT 'A+';

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Pouch";
PRAGMA foreign_keys=on;
