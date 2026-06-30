import prisma from "../prisma";

export const getAccessTokenFromDB = async (email: string) => {
  const response = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      account: {
        select: {
          accessToken: true,
        },
      },
    },
  });

  return response;
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};
