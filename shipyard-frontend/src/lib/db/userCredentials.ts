import prisma from "../prisma";

export type ServerInput = {
  userId: string;
  name: string;
  host: string;
  port: number;
  username: string;
  privateKey: string;
};

export const storeServer = async (server: ServerInput) => {
  return prisma.server.create({
    data: server,
  });
};

export const getServerById = async (id: string) => {
  return prisma.server.findUnique({
    where: { id },
  });
};

export const getServersByUserId = async (userId: string) => {
  return prisma.server.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
};

export const updateServer = async (id: string, data: Partial<ServerInput>) => {
  return prisma.server.update({
    where: { id },
    data,
  });
};

export const deleteServer = async (id: string) => {
  return prisma.server.delete({
    where: { id },
  });
};
