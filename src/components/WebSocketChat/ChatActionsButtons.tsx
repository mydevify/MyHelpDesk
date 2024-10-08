import React, { useEffect, useState } from 'react';
import { CanBan } from '@/lib/ban';
import BanModal from '../mod/BanModal';
import CopyUrlComponent from '../ShareTicketLink';
import DownloadChatComponent from '../DownloadChat';
import VouchModal from '../VouchModal';
import TicketStatusModal from '../TicketStatusModal';
import { isTeam } from '@/lib/user';
import StaffNoteDrawer from './StaffNoteDrawer';
import { IoSettings } from 'react-icons/io5';

interface ActionButtonsProps {
  token: string;
  userId: string | null | undefined;
  ticketId: number;
}
const ChatActionButtons: React.FC<ActionButtonsProps> = ({ token, userId, ticketId }) => {
  const [showBanModal, setShowBanModal] = useState(false);
  const [Team, setTeam] = useState(false);

    useEffect(() => {
      const checkBanPermission = async () => {
        if (userId) {
          const isteam = await isTeam(userId);
          setTeam(isteam);
          const canBan = await CanBan(userId);
          setShowBanModal(canBan);
        }
      };
  
      checkBanPermission();
    }, [userId]);

  return (
    <div className="">
    <div className="dropdown dropdown-top dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-outline btn-info mt-2 btn-xs sm:btn-sm md:btn-md mr-2"><IoSettings /> </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow z-50">
       
        {showBanModal && <BanModal token={token} />}
        {/* {Team && <StaffNoteDrawer userId={userId} ticketId={ticketId}/> } */}
  
        <CopyUrlComponent />
        <DownloadChatComponent token={token} />
        <VouchModal />
        <TicketStatusModal token={token} />
        {/* <li><a>Item 1</a></li> */}
      </ul>
    </div>
  </div>
  
  );
};

export default ChatActionButtons;
