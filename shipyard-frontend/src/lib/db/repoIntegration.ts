import prisma from "../prisma";

export type RepositoryIntegrationInput = {
  userId: string;
  githubRepoId: bigint;
  owner: string;
  repoName: string;
  fullName: string;
  cloneUrl: string;
  sshCloneUrl: string;
  defaultBranch: string;
  webhookId: bigint;
  status: "RUNNING" | "STOP";
};

export const storeRepositoryIntegration = async (
  integration: RepositoryIntegrationInput,
) => {
  return prisma.repositoryIntegration.upsert({
    where: {
      userId_githubRepoId: {
        userId: integration.userId,
        githubRepoId: integration.githubRepoId,
      },
    },
    create: integration,
    update: {
      webhookId: integration.webhookId,
      status: integration.status,
      cloneUrl: integration.cloneUrl,
      sshCloneUrl: integration.sshCloneUrl,
      defaultBranch: integration.defaultBranch,
    },
  });
};

export const getRepositoryIntegration = async (
  userId: string,
  githubRepoId: bigint,
) => {
  return prisma.repositoryIntegration.findUnique({
    where: {
      userId_githubRepoId: {
        userId,
        githubRepoId,
      },
    },
  });
};

export const getRepositoryIntegrationsByUserId = async (userId: string) => {
  return prisma.repositoryIntegration.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteRepositoryIntegration = async (
  userId: string,
  githubRepoId: bigint,
) => {
  return prisma.repositoryIntegration.delete({
    where: {
      userId_githubRepoId: {
        userId,
        githubRepoId,
      },
    },
  });
};
