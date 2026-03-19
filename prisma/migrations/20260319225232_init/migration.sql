-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "languages" TEXT,
    "tools" TEXT,
    "logo_url" TEXT,
    "location" TEXT NOT NULL,
    "jobdesc" TEXT,
    "responsibilities" TEXT,
    "nice2have" TEXT,
    "about" TEXT,
    "eoestatement" TEXT,
    "requirements" TEXT,
    "author_id" TEXT NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "is_featured" BOOLEAN NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "jobs_author_id_idx" ON "jobs"("author_id");

-- CreateIndex
CREATE INDEX "bookmarks_job_id_idx" ON "bookmarks"("job_id");

-- CreateIndex
CREATE INDEX "bookmarks_author_id_idx" ON "bookmarks"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_author_id_job_id_key" ON "bookmarks"("author_id", "job_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
