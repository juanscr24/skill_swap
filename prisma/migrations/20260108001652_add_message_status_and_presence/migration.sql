-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "read_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "user_presence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_presence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_presence_user_id_key" ON "user_presence"("user_id");

-- CreateIndex
CREATE INDEX "idx_presence_user_online" ON "user_presence"("user_id", "is_online");

-- CreateIndex
CREATE INDEX "idx_presence_updated" ON "user_presence"("updated_at");

-- AddForeignKey
ALTER TABLE "user_presence" ADD CONSTRAINT "user_presence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
