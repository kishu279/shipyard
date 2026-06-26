import prisma from "./prisma";

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
