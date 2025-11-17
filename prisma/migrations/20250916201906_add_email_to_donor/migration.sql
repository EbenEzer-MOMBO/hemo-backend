/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Donor" ADD COLUMN "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "Donor"("email");
