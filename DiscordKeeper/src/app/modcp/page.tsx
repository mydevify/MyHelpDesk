"use client";
import { useState, useEffect } from "react";
import { getAllTickets, updateTicketStatus } from "@/lib/ticket";
import { getAllVouches, createVouch } from "@/lib/vouch";
import { getAllUsers, isTeam, updateUserRole } from "@/lib/user";
import { getAllRoles, createRole } from "@/lib/role";
import TicketsTable from "@/components/TicketsTable";
import VouchesTable from "@/components/VouchesTable";
import styles from "@/app/main.module.css";
import Sidebar from "@/components/Sidebar";
import ChatNavbar from "@/components/ChatNavbar";
import { useAuth } from "@clerk/nextjs";

const ModCP = () => {
  const { userId } = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [vouches, setVouches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const [tickets, vouches, users, roles] = await Promise.all([
        getAllTickets(),
        getAllVouches(),
        getAllUsers(),
        getAllRoles(),
      ]);
      setTickets(tickets);
      setVouches(vouches);
      setUsers(users);
      setRoles(roles);
      setLoading(false);
    };

    const checkUserRole = async () => {
      if (userId) {
        const isTeamMember = await isTeam(userId);
        setIsTeamMember(isTeamMember);
      }
    };

    fetchData();
    checkUserRole();
  }, [userId]);

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    await updateTicketStatus(ticketId, newStatus);
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    );
    setTickets(updatedTickets);
  };

  const handleUserRoleChange = async (userId: string, newRoleId: number) => {
    await updateUserRole(userId, newRoleId);
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, roleId: newRoleId } : user
    );
    setUsers(updatedUsers);
  };

  const handleCreateVouch = async (
    vouchedBy: string,
    vouchedTo: string,
    message: string
  ) => {
    const newVouch = await createVouch(vouchedBy, vouchedTo, message);
    setVouches([...vouches, newVouch]);
  };

  const handleCreateRole = async (name: string, description: string) => {
    const newRole = await createRole(name, description);
    setRoles([...roles, newRole]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <div className="h-screen overflow-hidden sticky top-0 overflow-x-hidden">
          <ChatNavbar />
          <div>
            <h1>ModCP - Management</h1>
            {isTeamMember ? (
              <>
                <h2>Tickets</h2>
                <TicketsTable
                  tickets={tickets}
                  handleStatusChange={handleStatusChange}
                />
              </>
            ) : (
              <p>You do not have access to this section.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModCP;
