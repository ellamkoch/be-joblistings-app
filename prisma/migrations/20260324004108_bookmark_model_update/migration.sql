/*
  Warnings:

  - You are about to drop the column `author_id` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `bookmarks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,job_id]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_author_id_fkey";

-- DropIndex
DROP INDEX "bookmarks_author_id_idx";

-- DropIndex
DROP INDEX "bookmarks_author_id_job_id_key";

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "author_id",
DROP COLUMN "updated_at",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_job_id_key" ON "bookmarks"("user_id", "job_id");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
