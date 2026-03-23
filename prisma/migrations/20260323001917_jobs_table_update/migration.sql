/*
  Warnings:

  - Made the column `languages` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tools` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `responsibilities` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobDesc` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs" ALTER COLUMN "languages" SET NOT NULL,
ALTER COLUMN "tools" SET NOT NULL,
ALTER COLUMN "responsibilities" SET NOT NULL,
ALTER COLUMN "jobDesc" SET NOT NULL;
