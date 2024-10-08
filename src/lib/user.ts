"use server"

import prisma from "./client";

// Get all users
export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      role: true,
    },
  });
};

// Update user role
export const updateUserRole = async (userId: string, roleId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { roleId },
  });
};


// Fetch user data by user ID
export const fetchUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }, 
    });

    if (!user) throw new Error('User not found');

    return user;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
};

// Check if the user is part of the team (support, mod, or admin)
export const isTeam = async (userId: string): Promise<boolean> => {
  try {
    const user = await fetchUserById(userId);
    return [2, 3, 4].includes(user.roleId);
  } catch (err) {
    console.error('Error checking if user is part of the team:', err);
    throw err;
  }
};

// Check if the user is a mod
export const isMod = async (userId: string): Promise<boolean> => {
  try {
    const user = await fetchUserById(userId);
    return user.roleId === 3;
  } catch (err) {
    console.error('Error checking if user is a mod:', err);
    throw err;
  }
};

// Check if the user is an admin
// export const isAdmin = async (userId: string): Promise<boolean> => {
//   try {
//     const user = await fetchUserById(userId);
//     // return user.roleId === 4;
//     return user.role.id === 4; 

//   } catch (err) {
//     console.error('Error checking if user is an admin:', err);
//     throw err;
//   }
// };


export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const user = await fetchUserById(userId);
    console.log('Fetched user:', user);
    console.log('Role ID:', user.role.id);
    // return user.role.id === 4; 

    return user.role.id === 4; 
  } catch (err) {
    console.error('Error checking if user is an admin:', err);
    throw err;
  }
};

export const hasAccess = async (userId: string, ticketId: number): Promise<boolean> => {
  try {
    const user = await fetchUserById(userId);
    const ticket = await prisma.ticketUser.findFirst({
      where: {
        userId: user.id,
        ticketId: ticketId,
      },
    });

    if (ticket) {
      return true;
    }

    return await isTeam(userId);
  } catch (err) {
    console.error('Error checking access:', err);
    throw err;
  }
};

export const getUserRoleId = async (userId: string): Promise<number | null> => {
  try {
    const user = await fetchUserById(userId);
    return user.roleId || null;
  } catch (err) {
    console.error('Error fetching user role ID:', err);
    throw err;
  }
};



export const getUserStats = async (userId: string) => {
  const totalTickets = await prisma.ticketUser.count({
    where: {
      userId: userId,
    },
  });

  const totalVouches = await prisma.vouch.count({
    where: {
      vouchedBy: userId,
    },
  });

  const pendingTickets = await prisma.ticket.count({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      status: 'pending',
    },
  });

  const closedTickets = await prisma.ticket.count({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      status: 'closed',
    },
  });

  const openedTickets = await prisma.ticket.count({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      status: 'open',
    },
  });

  return {
    totalTickets,
    totalVouches,
    pendingTickets,
    closedTickets,
    openedTickets,
  };
};
