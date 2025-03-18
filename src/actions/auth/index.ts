"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { onGetAllAccountDomains } from "../settings";

export const onCompleteUserRegistration = async (
  fullname: string,
  clerkId: string,
  type: string
) => {
  try {
    const registered = await prisma.user.create({
      data: {
        fullname,
        clerkId,
        type,
        subscription: {
          create: {},
        },
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });

    if (registered) {
      return { status: 200, user: registered };
    }
  } catch (error) {
    return { status: 400, error };
  }
};

export const onLoginUser = async () => {
  const user = await currentUser();
  if (!user) return { status: 400, error: "User not found." };
  else {
    try {
      const authenticated = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullname: true,
          id: true,
          type: true,
        },
      });

      if (authenticated) {
        const domains = await onGetAllAccountDomains();
        return { status: 200, user: authenticated, domains: domains?.domains };
      }
    } catch (error) {
      return { status: 400, error };
    }
  }
};
