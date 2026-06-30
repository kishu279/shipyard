/*
  Warnings:

  - You are about to drop the `UserRepoCredentials` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,githubRepoId]` on the table `RepositoryIntegration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloneUrl` to the `RepositoryIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultBranch` to the `RepositoryIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sshCloneUrl` to the `RepositoryIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeploymentEnvironment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'ROLLBACK');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('WEBHOOK', 'MANUAL');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- DropForeignKey
ALTER TABLE "UserRepoCredentials" DROP CONSTRAINT "UserRepoCredentials_userId_fkey";

-- DropIndex
DROP INDEX "RepositoryIntegration_repoName_key";

-- AlterTable
ALTER TABLE "RepositoryIntegration" ADD COLUMN     "cloneUrl" TEXT NOT NULL,
ADD COLUMN     "defaultBranch" TEXT NOT NULL,
ADD COLUMN     "sshCloneUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserRepoCredentials";

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 22,
    "username" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentConfig" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "autoDeploy" BOOLEAN NOT NULL DEFAULT true,
    "dockerfilePath" TEXT NOT NULL,
    "containerName" TEXT NOT NULL,
    "environment" "DeploymentEnvironment" NOT NULL,
    "buildCommand" TEXT,
    "runCommand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeploymentConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL,
    "triggerType" "TriggerType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentLog" (
    "id" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeploymentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeploymentConfig_repositoryId_serverId_environment_key" ON "DeploymentConfig"("repositoryId", "serverId", "environment");

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryIntegration_userId_githubRepoId_key" ON "RepositoryIntegration"("userId", "githubRepoId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentConfig" ADD CONSTRAINT "DeploymentConfig_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "RepositoryIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentConfig" ADD CONSTRAINT "DeploymentConfig_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "RepositoryIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentLog" ADD CONSTRAINT "DeploymentLog_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
