/*
  Warnings:

  - You are about to drop the column `eoestatement` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `jobdesc` on the `jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "eoestatement",
DROP COLUMN "jobdesc",
ADD COLUMN     "eoeStatement" TEXT,
ADD COLUMN     "jobDesc" TEXT;
