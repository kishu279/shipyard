-- CreateTable
CREATE TABLE "UserRepoCredentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "serverName" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,

    CONSTRAINT "UserRepoCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRepoCredentials_userId_serverId_key" ON "UserRepoCredentials"("userId", "serverId");

-- AddForeignKey
ALTER TABLE "UserRepoCredentials" ADD CONSTRAINT "UserRepoCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
