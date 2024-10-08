/* eslint-disable react/jsx-no-undef */
// /* eslint-disable @next/next/no-img-element */
// "use client"
// import React, { useEffect, useState } from 'react';
// import TicketModal from './newticket';
// import { useAuth } from '@clerk/nextjs';
// import { fetchUserTickets } from '@/lib/data';
// import { Ticket } from '@prisma/client';
// import Link from 'next/link';
// import ShowMoreTicketsList from './SideBarTickets';

// const Sidebar = () => {
//   const { userId } = useAuth();
//   //console.log(userId)
  
//   const [tickets, setTickets] = useState<Ticket[]>([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         if (userId) { // Check if userId is defined
//           const userTickets = await fetchUserTickets(userId);
//           setTickets(userTickets);
//         } else {
//           console.error('User ID is not defined.');
//           // Handle case where userId is null or undefined
//         }
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         // Handle error state if needed
//       }
//     };

//     fetchTickets();
//   }, [userId]);

//   return (
//     <div className='h-screen overflow-hidden sticky top-0 z-30 overflow-x-hidden '>
//       <div className="z-50 drawer lg:drawer-open">
//         <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content flex flex-col items-center justify-center">
//           {/* Page content here */}
//         </div>
//         <div className="drawer-side">
//           <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
//           <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
//           <li className="mb-2 font-semibold text-xl">
                    
//                     <Link href={'/c'}>
//                     <img className="mask mask-squircle w-10" src="/icon.png" alt="Discord Keeper Logo"/>DK</Link>
//                      </li>
//             {/* Sidebar content here */}
//             <>

// <>

// <ShowMoreTicketsList/>
// </>

//             {tickets.map(ticket => (
//               <Link key={ticket.id} href={`/c/${ticket.token}`}>
//               <li>
//                     <p>{ticket.title}</p>
//                   </li>
//               </Link>
                  
//                 ))}
//             </>
//             <TicketModal />
//             {/* Display tickets in sidebar */}
//             {/* <div>
//               <h3>Your Tickets:</h3>
//               <ul>
//                 {tickets.map(ticket => (
//                   <li key={ticket.id}>
//                     <p>Title: {ticket.title}</p>
//                     <p>Token: {ticket.token}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div> */}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useEffect, useState } from 'react';
import TicketModal from './newticket';
import { useAuth } from '@clerk/nextjs';
import { fetchUserTickets } from '@/lib/data';
import { Ticket } from '@prisma/client';
import Link from 'next/link';
import ShowMoreTicketsList from './SideBarTickets';
import ExchangeModal from './WebSocketChat/ExchangeModal';

interface settings {
  sitename: string ;
  logo: string;
  discordLogs: boolean; 
  exchangeSystem:  boolean | null;
  storeSystem:  boolean;
  ticketSystem:  boolean;
}

const Sidebar = () => {
  const { userId } = useAuth();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [Settings, setSettings] = useState<settings | null>(null);

  const FetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data: settings = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch Site Settings:", error);
      
    }
  };
  useEffect(() => {
    FetchSiteSettings();
    const fetchTickets = async () => {
      try {
        if (userId) { 
          const userTickets = await fetchUserTickets(userId);
          setTickets(userTickets);
        } else {
          console.error('User ID is not defined.');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [userId]);

  return (
    <div className='h-screen overflow-hidden sticky top-0 z-30 overflow-x-hidden '>
      <div className="z-50 drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
            <li className="mb-2 font-semibold text-xl">
              <Link href={'/c'}>
              <img src={Settings?.logo ?? '/icon.png'} alt="Discord Keeper Logo" width={30} height={30} />
                {/* <img className="mask mask-squircle w-10" src="/icon.png" alt="Discord Keeper Logo"/>DK */}
              </Link>
            </li>
            {/* Sidebar content here */}
            <ShowMoreTicketsList tickets={tickets} />
            <ExchangeModal exchangeSystem={Settings?.exchangeSystem ?? false} />
            <TicketModal />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
