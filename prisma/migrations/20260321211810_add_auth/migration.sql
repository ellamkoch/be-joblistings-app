-- CreateTable
CREATE TABLE "revoked_tokens" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_token_hash_key" ON "revoked_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "revoked_tokens_expires_at_idx" ON "revoked_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_user_id_idx" ON "revoked_tokens"("user_id");
